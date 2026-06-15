import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Search,
  Filter,
  Clock,
  Star,
  ChevronRight,
  FileText,
  Calendar,
  User,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function TestRecords() {
  const { testRecords } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRecords = testRecords
    .filter((r) =>
      r.promptTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filters = [
    { id: 'all', label: '全部' },
    { id: 'today', label: '今天' },
    { id: 'week', label: '本周' },
    { id: 'month', label: '本月' },
  ];

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-dark-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-dark-400 mt-1">查看所有提示词的测试记录和效果评估</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{testRecords.length}</p>
            <p className="text-xs text-dark-400">总测试次数</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">4.6</p>
            <p className="text-xs text-dark-400">平均评分</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {new Set(testRecords.map((r) => r.promptId)).size}
            </p>
            <p className="text-xs text-dark-400">涉及提示词</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {new Set(testRecords.map((r) => r.createdBy)).size}
            </p>
            <p className="text-xs text-dark-400">测试人员</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索测试记录..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="glass-card p-5 hover:border-primary-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {record.promptTitle}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-dark-700 text-dark-400 rounded">
                      v{record.promptVersion}
                    </span>
                    {record.rating && getRatingStars(record.rating)}
                  </div>
                  <p className="text-sm text-dark-400 line-clamp-2 mb-3">
                    {Object.entries(record.inputValues).map(([key, value]) => (
                      <span key={key} className="mr-3">
                        <span className="text-dark-500">{key}:</span>{' '}
                        <span className="text-dark-300">{value || '-'}</span>
                      </span>
                    ))}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-dark-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {record.createdByName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {record.duration}ms
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-2" />
            </div>

            {record.note && (
              <div className="mt-4 pt-4 border-t border-dark-700/50">
                <p className="text-sm text-dark-400">
                  <span className="text-dark-500">备注：</span>
                  {record.note}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="glass-card p-16 text-center">
          <FlaskConical className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-300 mb-2">暂无测试记录</h3>
          <p className="text-dark-500">去提示词详情页开始你的第一次试跑吧</p>
        </div>
      )}
    </div>
  );
}
