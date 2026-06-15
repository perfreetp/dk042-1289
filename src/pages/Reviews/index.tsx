import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Review } from '../../types';

export default function Reviews() {
  const { reviews, updateReviewStatus } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'reviewing' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews
    .filter((r) => r.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((r) => (activeTab === 'all' ? true : r.status === activeTab))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs = [
    { id: 'all' as const, label: '全部', count: reviews.length },
    { id: 'pending' as const, label: '待评审', count: reviews.filter((r) => r.status === 'pending').length },
    { id: 'reviewing' as const, label: '评审中', count: reviews.filter((r) => r.status === 'reviewing').length },
    { id: 'approved' as const, label: '已通过', count: reviews.filter((r) => r.status === 'approved').length },
    { id: 'rejected' as const, label: '已拒绝', count: reviews.filter((r) => r.status === 'rejected').length },
  ];

  const getStatusConfig = (status: Review['status']) => {
    const configs = {
      pending: { label: '待评审', icon: Clock, className: 'tag-warning' },
      reviewing: { label: '评审中', icon: MessageSquare, className: 'tag-primary' },
      approved: { label: '已通过', icon: CheckCircle, className: 'tag-success' },
      rejected: { label: '已拒绝', icon: XCircle, className: 'tag-danger' },
    };
    return configs[status];
  };

  const handleApprove = (id: string) => {
    updateReviewStatus(id, 'approved', '提示词质量合格，通过评审');
  };

  const handleReject = (id: string) => {
    updateReviewStatus(id, 'rejected', '需要进一步优化');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-dark-400 mt-1">管理提示词的评审流程，确保内容质量</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {tabs.map((tab, index) => {
          const statusConfig = tab.id === 'all' ? null : getStatusConfig(tab.id);
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`glass-card p-4 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'border-primary-500/50 bg-primary-500/5'
                  : 'hover:border-dark-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {statusConfig && (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tab.id === 'approved' ? 'bg-emerald-500/20' :
                    tab.id === 'rejected' ? 'bg-rose-500/20' :
                    tab.id === 'pending' ? 'bg-amber-500/20' :
                    'bg-primary-500/20'
                  }`}>
                    {(() => {
                      const Icon = statusConfig?.icon || MessageSquare;
                      return <Icon className={`w-5 h-5 ${
                        tab.id === 'approved' ? 'text-emerald-400' :
                        tab.id === 'rejected' ? 'text-rose-400' :
                        tab.id === 'pending' ? 'text-amber-400' :
                        'text-primary-400'
                      }`} />;
                    })()}
                  </div>
                )}
                {!statusConfig && (
                  <div className="w-10 h-10 rounded-xl bg-dark-700/50 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-dark-400" />
                  </div>
                )}
                <div>
                  <p className="text-2xl font-bold text-white">{tab.count}</p>
                  <p className="text-xs text-dark-400">{tab.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索评审..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredReviews.map((review, index) => {
          const statusConfig = getStatusConfig(review.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-card p-5 hover:border-primary-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {review.promptTitle}
                    </h3>
                    <span className={`tag ${statusConfig.className} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-dark-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      发起人：{review.initiatorName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      {review.reviewerNames.length} 位评审人
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-500">评审人：</span>
                    <div className="flex -space-x-2">
                      {review.reviewerNames.map((name, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-medium border-2 border-dark-800"
                        >
                          {name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {review.conclusion && (
                    <div className="mt-4 pt-4 border-t border-dark-700/50">
                      <p className="text-sm text-dark-300">
                        <span className="text-dark-500">评审结论：</span>
                        {review.conclusion}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  {review.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="px-3 py-1.5 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        通过
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="px-3 py-1.5 text-sm bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        拒绝
                      </button>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-dark-600 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="glass-card p-16 text-center">
          <AlertCircle className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-300 mb-2">暂无评审</h3>
          <p className="text-dark-500">当前分类下没有评审记录</p>
        </div>
      )}
    </div>
  );
}
