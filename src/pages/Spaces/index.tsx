import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Layers,
  Code,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
  Plus,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Users,
  FileText,
  Clock,
  X,
  Trash2,
  Edit2,
  Filter,
  RotateCcw,
  Tag,
  Eye,
  FlaskConical,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Prompt, Space } from '../../types';

const iconMap: Record<string, any> = {
  PenTool,
  Layers,
  Code,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
};

const categories = ['全部', '营销文案', '需求文档', '前端开发', '数据查询', '客服话术', '产品设计'];

export default function Spaces() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    spaces,
    prompts,
    createSpace,
    deleteSpace,
    searchFilter,
    setSearchFilter,
    saveSearchFilter,
    restoreSearchFilter,
    searchPrompts,
    lastSearchFilter,
    canEditPrompt,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [newSpaceData, setNewSpaceData] = useState({
    name: '',
    description: '',
    icon: 'PenTool',
    color: '#6366f1',
  });

  const isSearchMode = searchParams.get('search') === '1';
  const hasActiveFilter = searchFilter.keyword ||
    searchFilter.spaceId || searchFilter.category ||
    searchFilter.tags.length > 0 || searchFilter.status ||
    searchFilter.createdBy || searchFilter.dateFrom || searchFilter.dateTo;

  const [searchResults, setSearchResults] = useState<Prompt[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(isSearchMode);

  useEffect(() => {
    if (isSearchMode && lastSearchFilter) {
      restoreSearchFilter();
    }
  }, []);

  useEffect(() => {
    if (isSearchMode || hasActiveFilter) {
      const results = searchPrompts();
      setSearchResults(results);
      setShowFilterPanel(true);
    }
  }, [searchFilter, isSearchMode]);

  const activeSpaces = spaces.filter(
    (s) => !s.isDeleted &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateSpace = () => {
    if (!newSpaceData.name.trim()) return;
    createSpace({
      name: newSpaceData.name,
      description: newSpaceData.description,
      icon: newSpaceData.icon,
      color: newSpaceData.color,
      ownerId: 'user-1',
    });
    setShowCreateModal(false);
    setNewSpaceData({ name: '', description: '', icon: 'PenTool', color: '#6366f1' });
  };

  const handleDeleteSpace = (id: string) => {
    deleteSpace(id);
    setSelectedSpace(null);
  };

  const handleNavigateToPrompt = (prompt: Prompt) => {
    saveSearchFilter();
    navigate(`/spaces/${prompt.spaceId}/prompts/${prompt.id}`);
  };

  const resetSearch = () => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'published': return '已发布';
      case 'archived': return '已归档';
      default: return status;
    }
  };

  const getStatusTagClass = (status: string) => {
    switch (status) {
      case 'published': return 'tag-success';
      case 'draft': return 'tag-warning';
      default: return 'tag-secondary';
    }
  };

  const iconOptions = ['PenTool', 'Layers', 'Code', 'BarChart3', 'HeadphonesIcon', 'GraduationCap'];
  const colorOptions = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 mt-1">
            {isSearchMode || hasActiveFilter
              ? `搜索结果：找到 ${searchResults.length} 个匹配的提示词`
              : '管理你的业务空间，按团队或项目组织提示词'}
          </p>
        </div>
        {!isSearchMode && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建空间
          </button>
        )}
      </div>

      {(isSearchMode || hasActiveFilter) && (
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white">筛选条件</span>
              {hasActiveFilter && (
                <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full">
                  筛选中
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="text-xs text-dark-400 hover:text-white flex items-center gap-1"
              >
                {showFilterPanel ? '收起' : '展开'}
              </button>
              <button
                onClick={resetSearch}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                重置
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilterPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-dark-400 mb-1.5 block">关键词</label>
                    <input
                      type="text"
                      value={searchFilter.keyword}
                      onChange={(e) => setSearchFilter({ keyword: e.target.value })}
                      placeholder="搜索标题/描述/内容"
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1.5 block">所属空间</label>
                    <select
                      value={searchFilter.spaceId}
                      onChange={(e) => setSearchFilter({ spaceId: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    >
                      <option value="">全部空间</option>
                      {spaces.filter(s => !s.isDeleted).map((space) => (
                        <option key={space.id} value={space.id}>{space.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1.5 block">分类</label>
                    <select
                      value={searchFilter.category}
                      onChange={(e) => setSearchFilter({ category: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    >
                      <option value="">全部分类</option>
                      {categories.filter(c => c !== '全部').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1.5 block">状态</label>
                    <select
                      value={searchFilter.status}
                      onChange={(e) => setSearchFilter({ status: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    >
                      <option value="">全部状态</option>
                      <option value="draft">草稿</option>
                      <option value="published">已发布</option>
                      <option value="archived">已归档</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilter && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-dark-700/50">
                    {searchFilter.keyword && (
                      <span className="text-xs px-2 py-1 bg-dark-700 text-dark-300 rounded flex items-center gap-1">
                        关键词: {searchFilter.keyword}
                        <button onClick={() => setSearchFilter({ keyword: '' })}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {searchFilter.spaceId && (
                      <span className="text-xs px-2 py-1 bg-dark-700 text-dark-300 rounded flex items-center gap-1">
                        空间: {spaces.find(s => s.id === searchFilter.spaceId)?.name}
                        <button onClick={() => setSearchFilter({ spaceId: '' })}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {searchFilter.category && (
                      <span className="text-xs px-2 py-1 bg-dark-700 text-dark-300 rounded flex items-center gap-1">
                        分类: {searchFilter.category}
                        <button onClick={() => setSearchFilter({ category: '' })}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {searchFilter.status && (
                      <span className="text-xs px-2 py-1 bg-dark-700 text-dark-300 rounded flex items-center gap-1">
                        状态: {getStatusLabel(searchFilter.status)}
                        <button onClick={() => setSearchFilter({ status: '' })}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {searchFilter.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-dark-700 text-dark-300 rounded flex items-center gap-1">
                        #{tag}
                        <button onClick={() => setSearchFilter({ tags: searchFilter.tags.filter(t => t !== tag) })}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {(isSearchMode || hasActiveFilter) ? (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Search className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 text-lg">没有找到匹配的提示词</p>
              <p className="text-dark-500 text-sm mt-2">试试调整筛选条件</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((prompt, index) => {
                const space = spaces.find(s => s.id === prompt.spaceId);
                return (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="glass-card p-5 card-hover cursor-pointer group"
                    onClick={() => handleNavigateToPrompt(prompt)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {prompt.title}
                        </h3>
                        <p className="text-xs text-dark-500 truncate mt-1">{prompt.description}</p>
                      </div>
                      <span className={`tag text-xs ml-2 flex-shrink-0 ${getStatusTagClass(prompt.status)}`}>
                        {getStatusLabel(prompt.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-dark-400 mb-3">
                      <span className="tag tag-primary text-xs">{prompt.category}</span>
                      {space && <span className="text-dark-500">{space.name}</span>}
                    </div>

                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prompt.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-dark-700/50 text-dark-400 rounded">
                            #{tag}
                          </span>
                        ))}
                        {prompt.tags.length > 3 && (
                          <span className="text-xs text-dark-500">+{prompt.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-dark-700/30">
                      <div className="flex items-center gap-4 text-xs text-dark-500">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{prompt.viewCount}</span>
                        <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3" />{prompt.testCount}</span>
                      </div>
                      <span className="text-xs text-dark-500">
                        {prompt.createdByName} · {new Date(prompt.updatedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索空间..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-dark-800/50 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSpaces.map((space, index) => {
                const IconComponent = iconMap[space.icon] || PenTool;
                return (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6 card-hover cursor-pointer group"
                    onClick={() => navigate(`/spaces/${space.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${space.color}20` }}>
                        <IconComponent className="w-7 h-7" style={{ color: space.color }} />
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedSpace(selectedSpace === space.id ? null : space.id); }}
                          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700/50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {selectedSpace === space.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 top-full mt-2 w-36 py-2 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => { navigate(`/spaces/${space.id}`); setSelectedSpace(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />进入空间
                              </button>
                              <button
                                onClick={() => handleDeleteSpace(space.id)}
                                className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-dark-600 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />删除空间
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{space.name}</h3>
                    <p className="text-sm text-dark-400 mb-4 line-clamp-2">{space.description}</p>
                    <div className="flex items-center gap-4 text-xs text-dark-400">
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{space.promptCount} 提示词</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{space.memberCount} 成员</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-700/50">
                      <Clock className="w-3.5 h-3.5 text-dark-500" />
                      <span className="text-xs text-dark-500">更新于 {new Date(space.updatedAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">空间名称</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">描述</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">提示词</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">成员</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">更新时间</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-dark-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSpaces.map((space, index) => {
                    const IconComponent = iconMap[space.icon] || PenTool;
                    return (
                      <motion.tr
                        key={space.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-dark-700/30 hover:bg-dark-700/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/spaces/${space.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${space.color}20` }}>
                              <IconComponent className="w-5 h-5" style={{ color: space.color }} />
                            </div>
                            <span className="font-medium text-white">{space.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><p className="text-sm text-dark-400 truncate max-w-xs">{space.description}</p></td>
                        <td className="px-6 py-4"><span className="tag tag-primary">{space.promptCount} 个</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-dark-300">{space.memberCount} 人</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-dark-400">{new Date(space.updatedAt).toLocaleDateString('zh-CN')}</span></td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSpace(space.id); }} className="p-2 text-dark-400 hover:text-rose-400 hover:bg-dark-700/50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0 }}
              className="glass-card p-8 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">创建新空间</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">空间名称</label>
                  <input type="text" value={newSpaceData.name} onChange={(e) => setNewSpaceData({ ...newSpaceData, name: e.target.value })} placeholder="输入空间名称" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">空间描述</label>
                  <textarea value={newSpaceData.description} onChange={(e) => setNewSpaceData({ ...newSpaceData, description: e.target.value })} placeholder="描述这个空间的用途..." rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">选择图标</label>
                  <div className="flex gap-2">
                    {iconOptions.map((icon) => {
                      const IconComp = iconMap[icon] || PenTool;
                      return (
                        <button key={icon} onClick={() => setNewSpaceData({ ...newSpaceData, icon })} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${newSpaceData.icon === icon ? 'bg-primary-500/20 border-2 border-primary-500' : 'bg-dark-700/50 border border-dark-600 hover:border-dark-500'}`}>
                          <IconComp className="w-6 h-6" style={{ color: newSpaceData.icon === icon ? newSpaceData.color : '#94a3b8' }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">主题颜色</label>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button key={color} onClick={() => setNewSpaceData({ ...newSpaceData, color })} className={`w-10 h-10 rounded-full transition-all ${newSpaceData.color === color ? 'ring-2 ring-offset-2 ring-offset-dark-800 ring-white scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 btn-secondary">取消</button>
                <button onClick={handleCreateSpace} disabled={!newSpaceData.name.trim()} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">创建空间</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
