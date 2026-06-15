import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  User,
  FolderOpen,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AdvancedSearchProps {
  show: boolean;
  onClose: () => void;
  onSearch: () => void;
}

export default function AdvancedSearch({ show, onClose, onSearch }: AdvancedSearchProps) {
  const {
    spaces,
    users,
    searchFilter,
    setSearchFilter,
    prompts,
  } = useAppStore();

  const [expanded, setExpanded] = useState(true);

  const categories = ['营销文案', '需求文档', '前端开发', '数据查询', '客服话术', '产品设计'];
  const statuses = [
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
    { value: 'archived', label: '已归档' },
  ];
  const sortOptions = [
    { value: 'updatedAt', label: '更新时间' },
    { value: 'createdAt', label: '创建时间' },
    { value: 'title', label: '标题' },
    { value: 'viewCount', label: '浏览量' },
    { value: 'testCount', label: '测试次数' },
  ];

  const allTags = Array.from(new Set(prompts.filter(p => !p.isDeleted).flatMap(p => p.tags)));

  const allCreators = Array.from(
    new Set(prompts.filter(p => !p.isDeleted).map(p => p.createdBy))
  ).map(userId => {
    const user = users.find(u => u.id === userId);
    return { id: userId, name: user?.name || '未知用户' };
  });

  const handleReset = () => {
    setSearchFilter({
      keyword: '',
      spaceId: '',
      category: '',
      tags: [],
      status: '',
      createdBy: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = searchFilter.tags;
    if (currentTags.includes(tag)) {
      setSearchFilter({ tags: currentTags.filter(t => t !== tag) });
    } else {
      setSearchFilter({ tags: [...currentTags, tag] });
    }
  };

  const handleSearch = () => {
    onSearch();
    onClose();
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="w-full max-w-4xl max-h-[80vh overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-dark-700/50">
              <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={searchFilter.keyword}
                  onChange={(e) => setSearchFilter({ keyword: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索提示词标题、描述、内容..."
                  className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-lg"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearch}
                className="btn-primary px-8 py-3 text-base"
              >
                搜索
              </button>
              <button
                onClick={onClose}
                className="p-3 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                {expanded ? '收起筛选' : '展开筛选'}
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置筛选
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-6 border-t border-dark-700/50">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        <FolderOpen className="w-4 h-4 text-primary-400" />
                        所属空间
                      </label>
                      <select
                        value={searchFilter.spaceId}
                        onChange={(e) => setSearchFilter({ spaceId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      >
                        <option value="">全部空间</option>
                        {spaces.filter(s => !s.isDeleted).map((space) => (
                          <option key={space.id} value={space.id}>
                            {space.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        <Tag className="w-4 h-4 text-primary-400" />
                        分类
                      </label>
                      <select
                        value={searchFilter.category}
                        onChange={(e) => setSearchFilter({ category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      >
                        <option value="">全部分类</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                      <Tag className="w-4 h-4 text-primary-400" />
                      标签
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.length > 0 ? (
                        allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              searchFilter.tags.includes(tag)
                                ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50'
                                : 'bg-dark-700/50 text-dark-400 border border-transparent hover:bg-dark-700 hover:text-dark-300'
                            }`}
                          >
                            #{tag}
                          </button>
                          ))
                      ) : (
                        <span className="text-sm text-dark-500">暂无标签</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        <Clock className="w-4 h-4 text-primary-400" />
                        状态
                      </label>
                      <div className="flex gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status.value}
                            onClick={() => setSearchFilter({ status: searchFilter.status === status.value ? '' : status.value })}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
                              searchFilter.status === status.value
                                ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50'
                                : 'bg-dark-700/50 text-dark-400 border border-transparent hover:bg-dark-700 hover:text-dark-300'
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        <User className="w-4 h-4 text-primary-400" />
                        创建人
                      </label>
                      <select
                        value={searchFilter.createdBy}
                        onChange={(e) => setSearchFilter({ createdBy: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      >
                        <option value="">全部创建人</option>
                        {allCreators.map((creator) => (
                          <option key={creator.id} value={creator.id}>
                            {creator.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        创建时间（起）
                      </label>
                      <input
                        type="date"
                        value={searchFilter.dateFrom}
                        onChange={(e) => setSearchFilter({ dateFrom: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        创建时间（止）
                      </label>
                      <input
                        type="date"
                        value={searchFilter.dateTo}
                        onChange={(e) => setSearchFilter({ dateTo: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        排序方式
                      </label>
                      <select
                        value={searchFilter.sortBy}
                        onChange={(e) => setSearchFilter({ sortBy: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      >
                        {sortOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-3">
                        排序顺序
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSearchFilter({ sortOrder: 'desc' })}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
                            searchFilter.sortOrder === 'desc'
                              ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50'
                              : 'bg-dark-700/50 text-dark-400 border border-transparent hover:bg-dark-700 hover:text-dark-300'
                          }`}
                        >
                          降序
                        </button>
                        <button
                          onClick={() => setSearchFilter({ sortOrder: 'asc' })}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
                            searchFilter.sortOrder === 'asc'
                              ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50'
                              : 'bg-dark-700/50 text-dark-400 border border-transparent hover:bg-dark-700 hover:text-dark-300'
                          }`}
                        >
                          升序
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 bg-dark-800/30 border-t border-dark-700/50 flex items-center justify-between">
            <div className="text-sm text-dark-400">
              提示：按 Enter 快速搜索，按 Esc 关闭
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              应用筛选条件
            </button>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
