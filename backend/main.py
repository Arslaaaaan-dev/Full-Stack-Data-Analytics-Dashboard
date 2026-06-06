from pydantic import BaseModel
import re as regex
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware



from typing import List, Dict, Any
import pandas as pd
import io
import json

app = FastAPI(title="InsightPro Analytics API")

class SheetRequest(BaseModel):
    url: str

@app.post("/api/sheets/connect")
async def connect_sheet(request: SheetRequest):
    url = request.url
    # Try to extract ID
    # https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
    match = regex.search(r'/d/([a-zA-Z0-9-_]+)', url)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid Google Sheets URL")

    sheet_id = match.group(1)
    csv_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"

    try:
        # Load directly into pandas
        df = pd.read_csv(csv_url)

        # Clean up column names
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

        # Replace NaN with None so it's JSON serializable
        df = df.where(pd.notnull(df), None)

        # Store in memory for demo
        dataset_id = "default"
        datasets[dataset_id] = df

        # Create summary
        columns = df.columns.tolist()
        num_rows = len(df)
        num_cols = len(columns)

        # Better data types detection
        dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()

        date_cols = [col for col in columns if 'date' in col.lower() or 'time' in col.lower()]

        preview = json.loads(df.head(5).to_json(orient="records"))

        return {
            "message": f"Successfully connected to Google Sheet",
            "summary": {
                "rows": num_rows,
                "columns": num_cols,
                "column_names": columns,
                "data_types": dtypes,
                "numeric_columns": numeric_cols,
                "date_columns": date_cols
            },
            "preview": preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Google Sheet: Make sure it is public. Error: {str(e)}")


# Setup CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for demo purposes
datasets: Dict[str, pd.DataFrame] = {}

@app.get("/")
def read_root():
    return {"message": "InsightPro API is running"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    try:
        contents = await file.read()

        # Load into pandas dataframe based on extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV or Excel.")

        # Clean up column names
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

        # Replace NaN with None so it's JSON serializable
        df = df.where(pd.notnull(df), None)

        # Store in memory for demo
        dataset_id = "default"
        datasets[dataset_id] = df

        # Create summary
        columns = df.columns.tolist()
        num_rows = len(df)
        num_cols = len(columns)

        # Better data types detection
        dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()

        # Simple date detection attempt (often pandas loads dates as object, let's try to infer if any column contains 'date' in name)
        date_cols = [col for col in columns if 'date' in col.lower() or 'time' in col.lower()]

        # Get a preview of the data (first 5 rows)
        # Using json.loads and to_json to handle NaN -> null correctly
        preview = json.loads(df.head(5).to_json(orient="records"))

        return {
            "message": f"Successfully uploaded {file.filename}",
            "summary": {
                "rows": num_rows,
                "columns": num_cols,
                "column_names": columns,
                "data_types": dtypes,
                "numeric_columns": numeric_cols,
                "date_columns": date_cols
            },
            "preview": preview
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analyze")
async def get_analysis(dataset_id: str = "default"):
    if dataset_id not in datasets or datasets[dataset_id].empty:
        # Return mock data if no dataset uploaded yet
        return get_mock_analysis()

    df = datasets[dataset_id]

    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=['number']).columns.tolist()

    analysis = {
        "dataset_info": {
            "total_records": len(df),
            "numeric_columns": len(numeric_cols),
            "categorical_columns": len(categorical_cols)
        },
        "metrics": [],
        "charts": [],
        "table": {
            "columns": df.columns.tolist(),
            # Return first 100 rows for the table view
            "data": json.loads(df.head(100).to_json(orient="records"))
        }
    }

    # KPIs
    analysis["metrics"].append({
        "name": "Total Rows",
        "value": len(df),
        "avg": None
    })

    if numeric_cols:
        # Try to find revenue-like columns
        revenue_cols = [c for c in numeric_cols if 'revenue' in c.lower() or 'sales' in c.lower() or 'total' in c.lower() or 'price' in c.lower()]
        profit_cols = [c for c in numeric_cols if 'profit' in c.lower() or 'margin' in c.lower()]

        rev_col = revenue_cols[0] if revenue_cols else numeric_cols[0]
        prof_col = profit_cols[0] if profit_cols else (numeric_cols[1] if len(numeric_cols) > 1 else None)

        analysis["metrics"].append({
            "name": f"Total {rev_col.replace('_', ' ').title()}",
            "value": round(float(df[rev_col].sum()), 2),
            "avg": round(float(df[rev_col].mean()), 2)
        })

        if prof_col:
            analysis["metrics"].append({
                "name": f"Total {prof_col.replace('_', ' ').title()}",
                "value": round(float(df[prof_col].sum()), 2),
                "avg": round(float(df[prof_col].mean()), 2)
            })

        # Add another average metric
        avg_col = numeric_cols[-1]
        analysis["metrics"].append({
            "name": f"Avg {avg_col.replace('_', ' ').title()}",
            "value": round(float(df[avg_col].mean()), 2),
            "avg": None
        })

        # Charts
        if categorical_cols:
            cat_col = categorical_cols[0]
            region_cols = [c for c in categorical_cols if 'region' in c.lower() or 'country' in c.lower() or 'state' in c.lower() or 'city' in c.lower()]
            cat_col2 = region_cols[0] if region_cols else (categorical_cols[1] if len(categorical_cols) > 1 else None)

            # Bar Chart: Top 10 by Category
            agg_df = df.groupby(cat_col)[rev_col].sum().reset_index().sort_values(by=rev_col, ascending=False).head(10)
            analysis["charts"].append({
                "title": f"{rev_col.replace('_', ' ').title()} by {cat_col.replace('_', ' ').title()}",
                "type": "bar",
                "data": json.loads(agg_df.to_json(orient="records")),
                "x_key": cat_col,
                "y_key": rev_col
            })

            # Pie Chart: Same as bar for variety if no second cat, or use second cat
            pie_cat = cat_col2 if cat_col2 else cat_col
            pie_val = prof_col if prof_col else rev_col
            pie_df = df.groupby(pie_cat)[pie_val].sum().reset_index().sort_values(by=pie_val, ascending=False).head(5)
            analysis["charts"].append({
                "title": f"Top 5 {pie_val.replace('_', ' ').title()} Distribution by {pie_cat.replace('_', ' ').title()}",
                "type": "pie",
                "data": json.loads(pie_df.to_json(orient="records")),
                "x_key": pie_cat,
                "y_key": pie_val
            })

        # Try to find date col for Line chart
        date_cols = [c for c in df.columns if 'date' in c.lower() or 'time' in c.lower() or 'month' in c.lower() or 'year' in c.lower()]
        if date_cols:
            date_col = date_cols[0]
            try:
                # Group by date/month
                # Ensure it's string for JSON serialization
                temp_df = df.copy()
                temp_df[date_col] = temp_df[date_col].astype(str).str[:10] # simple truncation for grouping
                time_df = temp_df.groupby(date_col)[rev_col].sum().reset_index().sort_values(by=date_col).head(20)
                analysis["charts"].append({
                    "title": f"{rev_col.replace('_', ' ').title()} Over Time",
                    "type": "line",
                    "data": json.loads(time_df.to_json(orient="records")),
                    "x_key": date_col,
                    "y_key": rev_col
                })
            except:
                pass

        # If no line chart created yet, make a mock one based on index
        if not any(c["type"] == "line" for c in analysis["charts"]):
            line_df = df.head(20).reset_index()
            analysis["charts"].append({
                "title": f"Sample {rev_col.replace('_', ' ').title()} Trend",
                "type": "line",
                "data": json.loads(line_df.to_json(orient="records")),
                "x_key": "index",
                "y_key": rev_col
            })

    analysis["ai_insights"] = [
        f"Dataset loaded with {len(df)} records.",
        f"Detected {len(numeric_cols)} numeric and {len(categorical_cols)} categorical columns.",
        "Auto-generated charts based on column types."
    ]

    return analysis

def get_mock_analysis():
    # Return realistic mock data for empty states
    return {
         "dataset_info": {
            "total_records": 15420,
            "numeric_columns": 5,
            "categorical_columns": 3
        },
        "metrics": [
            {"name": "Total Revenue", "value": 125430.50, "avg": 8.13},
            {"name": "Total Orders", "value": 4205, "avg": 1.2},
            {"name": "Active Users", "value": 8432, "avg": None},
            {"name": "Conversion Rate", "value": "4.2%", "avg": None}
        ],
        "charts": [
            {
                "title": "Revenue by Category",
                "type": "bar",
                "data": [
                    {"category": "Electronics", "revenue": 45000},
                    {"category": "Clothing", "revenue": 32000},
                    {"category": "Home", "revenue": 28000},
                    {"category": "Sports", "revenue": 20430}
                ],
                "x_key": "category",
                "y_key": "revenue"
            },
            {
                "title": "Monthly Growth Trend",
                "type": "line",
                "data": [
                    {"month": "Jan", "users": 4000, "revenue": 2400},
                    {"month": "Feb", "users": 3000, "revenue": 1398},
                    {"month": "Mar", "users": 2000, "revenue": 9800},
                    {"month": "Apr", "users": 2780, "revenue": 3908},
                    {"month": "May", "users": 1890, "revenue": 4800},
                    {"month": "Jun", "users": 2390, "revenue": 3800},
                ],
                "x_key": "month",
                "y_key": "revenue" # Could also plot users
            }
        ],

        "table": {
            "columns": ["month", "users", "revenue"],
            "data": [
                {"month": "Jan", "users": 4000, "revenue": 2400},
                {"month": "Feb", "users": 3000, "revenue": 1398},
                {"month": "Mar", "users": 2000, "revenue": 9800},
                {"month": "Apr", "users": 2780, "revenue": 3908},
                {"month": "May", "users": 1890, "revenue": 4800},
                {"month": "Jun", "users": 2390, "revenue": 3800}
            ]
        },
        "ai_insights": [

            "Based on your mock data, revenue peaks strongly in March.",
            "Electronics is leading sales by a significant margin.",
            "Growth trend is volatile, investigate the drop in May."
        ]
    }
