import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, Activity, DollarSign, Users, Target, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/analyze');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return <div>Failed to load dashboard data.</div>;

  const icons = [DollarSign, Activity, Users, Target];

  // Table pagination and filtering logic
  const tableData = data.table?.data || [];
  const filteredData = tableData.filter((row: any) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentTableData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric: any, i: number) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.name}</h3>
                <Icon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white truncate" title={String(metric.value)}>
                  {typeof metric.value === 'number' && metric.name.toLowerCase().includes('revenue') ? '$' : ''}
                  {metric.value.toLocaleString()}
                </span>
                {metric.avg && (
                  <span className="flex items-center text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {metric.avg}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data.charts.map((chart: any, i: number) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{chart.title}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chart.type === 'bar' ? (
                  <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey={chart.x_key} stroke="#94a3b8" tick={{fontSize: 12}} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey={chart.y_key} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : chart.type === 'pie' ? (
                  <PieChart>
                     <Pie
                        data={chart.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey={chart.y_key}
                        nameKey={chart.x_key}
                      >
                        {chart.data.map((_entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                   </PieChart>
                ) : (
                  <LineChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey={chart.x_key} stroke="#94a3b8" tick={{fontSize: 12}} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Line type="monotone" dataKey={chart.y_key} stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      {data.table && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Dataset Explorer</h3>
             <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                   <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                   type="text"
                   className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="Search dataset..."
                   value={searchTerm}
                   onChange={(e) => {
                     setSearchTerm(e.target.value);
                     setCurrentPage(1);
                   }}
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  {data.table.columns.map((col: string, i: number) => (
                    <th key={i} scope="col" className="px-6 py-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTableData.length > 0 ? (
                  currentTableData.map((row: any, i: number) => (
                    <tr key={i} className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      {data.table.columns.map((col: string, j: number) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate" title={String(row[col])}>
                          {row[col] === null ? <span className="text-slate-300 italic">null</span> : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={data.table.columns.length} className="px-6 py-8 text-center text-slate-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
               <span className="text-sm text-slate-700 dark:text-slate-400">
                 Showing <span className="font-semibold text-slate-900 dark:text-white">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredData.length}</span> entries (max 100 loaded)
               </span>
               <div className="inline-flex mt-2 xs:mt-0 gap-1">
                 <button
                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                   disabled={currentPage === 1}
                   className="flex items-center justify-center px-3 h-8 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                 </button>
                 <button
                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                   disabled={currentPage === totalPages}
                   className="flex items-center justify-center px-3 h-8 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Next <ChevronRight className="w-4 h-4 ml-1" />
                 </button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insights Panel */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-900 dark:from-blue-950/40 dark:to-indigo-950/40 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          AI Analytics Insights
        </h3>
        <ul className="space-y-3">
          {data.ai_insights.map((insight: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-blue-800 dark:text-blue-200/80 bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="text-sm font-medium">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
