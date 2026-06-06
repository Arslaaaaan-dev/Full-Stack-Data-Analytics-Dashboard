import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, File, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();

      if (!validTypes.includes(selectedFile.type) && !['csv', 'xls', 'xlsx'].includes(fileExt || '')) {
        setError('Invalid file type. Please upload a CSV or Excel file.');
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();

      if (!validTypes.includes(selectedFile.type) && !['csv', 'xls', 'xlsx'].includes(fileExt || '')) {
        setError('Invalid file type. Please upload a CSV or Excel file.');
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Upload Dataset</h1>

      <div
        className="mt-6 flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-xl backdrop-blur-sm">
             <div className="flex flex-col items-center">
                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-2"></div>
                 <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Uploading and processing...</p>
             </div>
          </div>
        )}
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
          <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
            <span className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
              <span>Upload a file</span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-slate-500 mt-2">CSV, XLS, XLSX up to 50MB</p>
        </div>
      </div>

      {file && !loading && !success && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-blue-500" />
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Process Dataset
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <CheckCircle className="h-5 w-5" />
               <span className="font-medium">File successfully processed!</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-sm font-medium bg-green-100 dark:bg-green-800 px-3 py-1.5 rounded-md hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
            >
              Go to Dashboard <Play className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Dataset Summary</h3>
              <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span><strong className="text-slate-900 dark:text-slate-100">{success.summary.rows}</strong> Rows</span>
                <span><strong className="text-slate-900 dark:text-slate-100">{success.summary.columns}</strong> Columns</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    {success.summary.column_names.map((col: string, i: number) => (
                      <th key={i} className="px-6 py-3 whitespace-nowrap">
                        {col}
                        <span className="block text-[10px] text-slate-400 normal-case mt-1">{success.summary.data_types[col]}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {success.preview.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      {success.summary.column_names.map((col: string, j: number) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate">
                          {row[col] === null ? 'null' : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
