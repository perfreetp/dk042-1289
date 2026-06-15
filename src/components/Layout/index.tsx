import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import AdvancedSearch from '../AdvancedSearch';
import RoleSwitcher from '../RoleSwitcher';
import { useAppStore } from '../../store/useAppStore';
import { Search, Bell, Plus, X, FileCheck, MessageSquare, Eye } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    viewAsUserId,
    getEffectiveUserId,
    getReviewsForUser,
    canEditPrompt,
    currentSpaceId,
  } = useAppStore();

  const [showSearch, setShowSearch] = useState(false);
  const effectiveUserId = getEffectiveUserId();
  const pendingReviews = getReviewsForUser(effectiveUserId);

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

  const handleSearch = () => {
    navigate('/spaces?search=1');
  };

  const showNewButton = () => {
    const path = location.pathname;
    if (path.includes('/editor/new')) return false;
    if (currentSpaceId) return canEditPrompt(currentSpaceId);
    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950" onClick={() => {}}>
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <header className="h-16 bg-dark-900/50 backdrop-blur-xl border-b border-dark-700/50 sticky top-0 z-30">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-xl font-semibold text-white">
                {getPageTitle()}
              </h1>
              {viewAsUserId && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs">
                  <Eye className="w-3 h-3" />
                  正在以只读成员视角浏览
                  <button
                    onClick={() => useAppStore.getState().setViewAsUserId(null)}
                    className="ml-1 text-amber-300 hover:text-amber-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <div className="w-72 pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-400 flex items-center justify-between">
                  <span>搜索提示词、空间...</span>
                  <span className="text-xs px-1.5 py-0.5 bg-dark-700 rounded text-dark-500">
                    /
                  </span>
                </div>
              </div>

              <div className="relative">
                <button className="relative p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700/50 transition-colors">
                  <Bell className="w-5 h-5" />
                  {pendingReviews.length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                      {pendingReviews.length}
                    </span>
                  )}
                </button>
                {pendingReviews.length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-dark-800 border border-dark-700 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-dark-700/50">
                      <p className="text-sm font-medium text-white">待办事项</p>
                    </div>
                    {pendingReviews.slice(0, 3).map((review) => (
                      <button
                        key={review.id}
                        onClick={() => navigate('/reviews')}
                        className="w-full px-3 py-2 hover:bg-dark-700/50 text-left flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileCheck className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            待评审：{review.promptTitle}
                          </p>
                          <p className="text-xs text-dark-500 mt-0.5">
                            发起人：{review.initiatorName}
                          </p>
                        </div>
                      </button>
                    ))}
                    <div className="px-3 py-2 border-t border-dark-700/50">
                      <button
                        onClick={() => navigate('/reviews')}
                        className="text-xs text-primary-400 hover:text-primary-300"
                      >
                        查看全部待办 →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <RoleSwitcher />

              {showNewButton() && (
                <button
                  onClick={() => {
                    if (currentSpaceId) {
                      navigate(`/spaces/${currentSpaceId}/prompt/new`);
                    } else {
                      navigate('/spaces');
                    }
                  }}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  新建提示词
                </button>
              )}
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

      <AdvancedSearch
        show={showSearch}
        onClose={() => setShowSearch(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
