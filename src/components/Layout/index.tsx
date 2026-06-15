import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { Search, Bell, Plus } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return '工作台';
    if (path.startsWith('/spaces')) return '空间列表';
    if (path.startsWith('/tests')) return '测试记录';
    if (path.startsWith('/reviews')) return '评审中心';
    if (path.startsWith('/recycle')) return '回收站';
    if (path.startsWith('/settings')) return '权限设置';
    if (path.startsWith('/admin')) return '管理后台';
    return '';
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <header className="h-16 bg-dark-900/50 backdrop-blur-xl border-b border-dark-700/50 sticky top-0 z-30">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-xl font-semibold text-white">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索提示词、空间..."
                  className="w-72 pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                />
              </div>

              <button className="relative p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700/50 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
              </button>

              <button className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                新建提示词
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
