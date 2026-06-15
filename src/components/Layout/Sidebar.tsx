import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  FlaskConical,
  MessageSquare,
  Trash2,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { to: '/', label: '工作台', icon: LayoutDashboard },
  { to: '/spaces', label: '空间列表', icon: FolderKanban },
  { to: '/tests', label: '测试记录', icon: FlaskConical },
  { to: '/reviews', label: '评审中心', icon: MessageSquare },
  { to: '/recycle', label: '回收站', icon: Trash2 },
  { to: '/settings', label: '权限设置', icon: Settings },
  { to: '/admin', label: '管理后台', icon: Shield },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-dark-900/80 backdrop-blur-xl border-r border-dark-700/50 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-dark-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">Prompt Hub</h1>
            <p className="text-xs text-dark-400">团队提示词知识库</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-primary-400' : 'text-dark-400 group-hover:text-dark-200'
                }`}
              />
              <span
                className={`relative z-10 transition-colors ${
                  isActive ? 'text-white' : 'text-dark-300 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-700/50">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming"
              alt="用户头像"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">张明</p>
              <p className="text-xs text-dark-400 truncate">系统管理员</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
