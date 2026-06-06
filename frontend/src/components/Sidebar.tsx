import { NavLink } from 'react-router-dom';
import { ThemeToggle } from "./ThemeToggle";
import { LayoutDashboard, Upload, FileSpreadsheet, BarChart2, FileText, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upload Dataset', href: '/upload', icon: Upload },
  { name: 'Google Sheets', href: '/sheets', icon: FileSpreadsheet },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 border-r border-slate-800 text-white">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-blue-500" />
          InsightPro
        </h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-y-7 px-4 pt-4">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                    )
                  }
                >
                  <item.icon
                    className="h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
