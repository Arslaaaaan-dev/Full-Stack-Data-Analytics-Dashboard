import { FileDown, Table as TableIcon, Download, BarChart } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Export Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full mb-4">
                <FileDown className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">PDF Report</h3>
            <p className="text-sm text-slate-500 mb-6">Complete visual dashboard export with charts and summaries.</p>
            <button className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 transition-colors font-medium">
                <Download className="h-4 w-4" /> Download PDF
            </button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mb-4">
                <TableIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Excel Export</h3>
            <p className="text-sm text-slate-500 mb-6">Raw data along with calculated metrics and formulas.</p>
            <button className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 transition-colors font-medium">
                <Download className="h-4 w-4" /> Download Excel
            </button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full mb-4">
                <BarChart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">CSV Data</h3>
            <p className="text-sm text-slate-500 mb-6">Clean, processed flat file of your current dataset.</p>
            <button className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 transition-colors font-medium">
                <Download className="h-4 w-4" /> Download CSV
            </button>
        </div>
      </div>
    </div>
  );
}
