import { useState } from 'react';
import { Database, Link as LinkIcon, RefreshCw } from 'lucide-react';

export function Sheets() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // Simulate connection
    setTimeout(() => {
      setLoading(false);
      alert('Successfully connected to Google Sheets (Mock)! Go to Analytics to view data.');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
            <Database className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Google Sheets Integration</h1>
        <p className="text-slate-500 mt-2">Connect your live spreadsheets to automatically refresh your dashboard metrics.</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
        <form onSubmit={handleConnect} className="space-y-4">
            <div>
                <label htmlFor="sheetUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Google Sheet URL or Document ID
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
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    Make sure the document is set to "Anyone with the link can view" or authenticate via the Settings page.
                </p>
            </div>

            <button
                type="submit"
                disabled={loading || !url}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                    'Connect & Fetch Data'
                )}
            </button>
        </form>
      </div>
    </div>
  );
}
