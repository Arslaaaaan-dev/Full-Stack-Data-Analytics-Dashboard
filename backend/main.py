from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import pandas as pd
import io
import json

app = FastAPI(title="InsightPro Analytics API")

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

        # Store in memory for demo
        dataset_id = "default"
        datasets[dataset_id] = df

        # Create summary
        columns = df.columns.tolist()
        num_rows = len(df)
        num_cols = len(columns)

        # Basic data types
        dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}

        # Get a preview of the data
        preview = json.loads(df.head(5).to_json(orient="records"))

        return {
            "message": f"Successfully uploaded {file.filename}",
            "summary": {
                "rows": num_rows,
                "columns": num_cols,
                "column_names": columns,
                "data_types": dtypes
            },
            "preview": preview
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analyze")
async def get_analysis(dataset_id: str = "default"):
    if dataset_id not in datasets:
        # Return mock data if no dataset uploaded yet
        return get_mock_analysis()

    df = datasets[dataset_id]

    # Simple automatic numeric analysis
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=['number']).columns.tolist()

    analysis = {
        "dataset_info": {
            "total_records": len(df),
            "numeric_columns": len(numeric_cols),
            "categorical_columns": len(categorical_cols)
        },
        "metrics": [],
        "charts": []
    }

    # Calculate some basic metrics
    if numeric_cols:
        for col in numeric_cols[:4]: # Take up to 4 numeric cols
            analysis["metrics"].append({
                "name": f"Total {col.replace('_', ' ').title()}",
                "value": round(float(df[col].sum()), 2),
                "avg": round(float(df[col].mean()), 2)
            })

        # Generate chart data (e.g., aggregate by first categorical col if exists)
        if categorical_cols:
            cat_col = categorical_cols[0]
            num_col = numeric_cols[0]

            # Group by and sum
            agg_df = df.groupby(cat_col)[num_col].sum().reset_index().head(10) # Top 10

            chart_data = json.loads(agg_df.to_json(orient="records"))
            analysis["charts"].append({
                "title": f"{num_col.replace('_', ' ').title()} by {cat_col.replace('_', ' ').title()}",
                "type": "bar",
                "data": chart_data,
                "x_key": cat_col,
                "y_key": num_col
            })

            # Trend mock data (if date col existed, but we'll mock for simplicity)
            analysis["charts"].append({
                "title": "Monthly Trend",
                "type": "line",
                "data": [
                    {"name": "Jan", "value": 4000},
                    {"name": "Feb", "value": 3000},
                    {"name": "Mar", "value": 2000},
                    {"name": "Apr", "value": 2780},
                    {"name": "May", "value": 1890},
                    {"name": "Jun", "value": 2390},
                ],
                "x_key": "name",
                "y_key": "value"
            })

    # Mock AI Insights
    analysis["ai_insights"] = [
        "Revenue increased by 15% compared to the previous period.",
        "Category 'Electronics' is your top performing segment.",
        "Consider investigating the drop in engagement on weekends."
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
        "ai_insights": [
            "Based on your mock data, revenue peaks strongly in March.",
            "Electronics is leading sales by a significant margin.",
            "Growth trend is volatile, investigate the drop in May."
        ]
    }
