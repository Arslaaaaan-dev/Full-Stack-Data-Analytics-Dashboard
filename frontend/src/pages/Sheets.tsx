import { useState } from 'react';
import axios from 'axios';
import { Database, Link as LinkIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Sheets() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
        await axios.post(import.meta.env.VITE_API_URL + '/api/sheets/connect', { url });
        navigate('/');
    } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred while connecting to the sheet.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
            <Database className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Google Sheets Integration</h1>
        <p className="text-slate-500 mt-2">Connect your public spreadsheets to automatically refresh your dashboard metrics.</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
        <form onSubmit={handleConnect} className="space-y-4">
            <div>
                <label htmlFor="sheetUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Google Sheet URL
                </label>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LinkIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                        type="url"
                        name="sheetUrl"
                        id="sheetUrl"
                        className="block w-full rounded-md border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    Make sure the document access is set to "Anyone with the link can view".
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !url}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                ) : (
                    'Connect & Fetch Data'
                )}
            </button>
        </form>
      </div>
    </div>
  );
}
