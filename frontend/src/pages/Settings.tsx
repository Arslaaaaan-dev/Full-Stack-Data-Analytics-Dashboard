import { User, Shield, Bell, Key } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar */}
            <div className="border-r border-slate-200 dark:border-slate-800 p-4 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                    <User className="h-4 w-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <Shield className="h-4 w-4" /> Security
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <Bell className="h-4 w-4" /> Notifications
                </button>
                 <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <Key className="h-4 w-4" /> API Keys
                </button>
            </div>

            {/* Content */}
            <div className="col-span-3 p-8">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <form className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                            <input type="text" defaultValue="Admin" className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                            <input type="text" defaultValue="User" className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input type="email" defaultValue="admin@insightpro.com" className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </div>

                     <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
