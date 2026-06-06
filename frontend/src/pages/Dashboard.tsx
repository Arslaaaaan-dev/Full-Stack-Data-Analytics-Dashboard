import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, Activity, DollarSign, Users, Target } from 'lucide-react';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/analyze');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric: any, i: number) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.name}</h3>
                <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {typeof metric.value === 'number' && metric.name.toLowerCase().includes('revenue') ? '$' : ''}
                  {metric.value}
                </span>
                {metric.avg && (
                  <span className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    {metric.avg}%
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
            <h3 className="text-lg font-semibold mb-4">{chart.title}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chart.type === 'bar' ? (
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey={chart.x_key} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Bar dataKey={chart.y_key} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey={chart.x_key} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Line type="monotone" dataKey={chart.y_key} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20 p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          AI Analytics Insights
        </h3>
        <ul className="space-y-2">
          {data.ai_insights.map((insight: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
