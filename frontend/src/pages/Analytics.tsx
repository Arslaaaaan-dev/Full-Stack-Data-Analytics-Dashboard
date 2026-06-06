import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { Download, Filter, Maximize2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Re-using the analyze endpoint to get chart data for the Analytics page
        const response = await axios.get('http://localhost:8000/api/analyze');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
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

  if (!data || !data.charts) return <div>Failed to load analytics data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics</h1>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Filter className="h-4 w-4" /> Filter
           </button>
           <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" /> Export Report
           </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {data.charts.map((chart: any, index: number) => (
          <div key={index} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm group">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">{chart.title}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" title="Fullscreen">
                        <Maximize2 className="h-4 w-4 text-slate-500" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" title="Download PNG">
                        <Download className="h-4 w-4 text-slate-500" />
                    </button>
                </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chart.type === 'bar' ? (
                  <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey={chart.x_key} stroke="#64748b" tick={{fill: '#64748b'}} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                    <Bar dataKey={chart.y_key} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : chart.type === 'line' ? (
                  <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey={chart.x_key} stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                    <Area type="monotone" dataKey={chart.y_key} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                ) : (
                   <PieChart>
                     <Pie
                        data={chart.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey={chart.y_key}
                        nameKey={chart.x_key}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {chart.data.map((_entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                   </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}

        {/* Mock additional chart for variety if data doesn't provide enough */}
        {data.charts.length < 3 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm group">
               <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Distribution Analysis (Mock)</h3>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                             <Pie
                                data={data.charts[0]?.data || []}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey={data.charts[0]?.y_key || "value"}
                                nameKey={data.charts[0]?.x_key || "name"}
                              >
                                {(data.charts[0]?.data || []).map((_entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                           </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
