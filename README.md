# InsightPro Analytics Dashboard

InsightPro is an advanced business intelligence dashboard that allows users to upload, connect, analyze, visualize, and export insights from structured datasets.

## Features

- **Modern SaaS UI**: Built with React, Tailwind CSS, and Lucide Icons. Dark/Light mode supported.
- **Dataset Upload**: Upload CSV and Excel files to process.
- **Data Analytics Engine**: Powered by Python, FastAPI, and Pandas.
- **Interactive Visualizations**: Line, Bar, Area, and Pie charts using Recharts.
- **AI Insights**: Automated dataset summarization and trend analysis.

## Tech Stack

### Frontend
- React.js + TypeScript (Vite)
- Tailwind CSS
- Recharts
- Axios
- React Router DOM

### Backend
- Python
- FastAPI
- Pandas & NumPy
- openpyxl

## Local Development Setup

### 1. Start the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev &
```

The frontend will be available at `http://localhost:5173`.

## Deployment

The project is structured to be easily deployed:
- **Frontend**: Ready for Vercel deployment (use the `vercel.json` config).
- **Backend**: Ready for Render deployment (use the `render.yaml` config).

## Sample Data

A `sample_data.csv` is provided in the `backend/` directory for testing the upload and analysis features.
