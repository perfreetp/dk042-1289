import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  SortAsc,
  FileText,
  Clock,
  Eye,
  FlaskConical,
  Tag,
  MoreHorizontal,
  Settings,
  Users,
  Trash2,
  Grid3X3,
  List,
  PenTool,
  Layers,
  Code,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const iconMap: Record<string, any> = {
  PenTool,
  Layers,
  Code,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
};

const categories = ['全部', '营销文案', '需求文档', '前端开发', '数据查询', '客服话术', '产品设计'];

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { spaces, prompts, deletePrompt, canEditPrompt, canDeletePrompt } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('updated');

  const canEdit = canEditPrompt(spaceId || '');
  const canDel = canDeletePrompt(spaceId || '');

  const space = spaces.find((s) => s.id === spaceId);
  const IconComponent = space ? iconMap[space.icon] || PenTool : PenTool;

  const spacePrompts = prompts.filter(
    (p) =>
      p.spaceId === spaceId &&
      !p.isDeleted &&
      (activeCategory === '全部' || p.category === activeCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPrompts = [...spacePrompts].sort((a, b) => {
    if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'views') return b.viewCount - a.viewCount;
    if (sortBy === 'tests') return b.testCount - a.testCount;
    return 0;
  });

  const handleDeletePrompt = (id: string) => {
    if (confirm('确定要删除这个提示词吗？')) {
      deletePrompt(id);
    }
  };

  if (!space) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-dark-400">空间不存在</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/spaces')}
          className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${space.color}20` }}
        >
          <IconComponent className="w-6 h-6" style={{ color: space.color }} />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-white">{space.name}</h1>
          {!canEdit && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <Eye className="w-3.5 h-3.5" />
              只读模式
            </span>
          )}
        </div>
        <p className="text-sm text-dark-400">{space.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{space.promptCount}</p>
            <p className="text-xs text-dark-400">提示词总数</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {spacePrompts.reduce((sum, p) => sum + p.testCount, 0)}
            </p>
            <p className="text-xs text-dark-400">测试次数</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {spacePrompts.reduce((sum, p) => sum + p.viewCount, 0)}
            </p>
            <p className="text-xs text-dark-400">总浏览量</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{space.memberCount}</p>
            <p className="text-xs text-dark-400">团队成员</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索提示词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="updated">最近更新</option>
              <option value="created">最近创建</option>
              <option value="views">浏览最多</option>
              <option value="tests">测试最多</option>
            </select>

            <div className="flex items-center gap-1 p-1 bg-dark-800/50 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {canEdit && (
              <button
                onClick={() => navigate(`/spaces/${spaceId}/prompts/new`)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                新建提示词
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 card-hover cursor-pointer group"
              onClick={() => navigate(`/spaces/${spaceId}/prompts/${prompt.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`tag ${
                    prompt.status === 'published'
                      ? 'tag-success'
                      : prompt.status === 'draft'
                      ? 'tag-warning'
                      : 'tag-secondary'
                  }`}
                >
                  {prompt.status === 'published' ? '已发布' : prompt.status === 'draft' ? '草稿' : '已归档'}
                </span>
                {canDel && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePrompt(prompt.id);
                    }}
                    className="p-1.5 text-dark-500 hover:text-rose-400 hover:bg-dark-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                {prompt.title}
              </h3>
              <p className="text-sm text-dark-400 mb-4 line-clamp-2">{prompt.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-dark-700/50 text-dark-300 rounded-md">
                    #{tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 text-dark-500">+{prompt.tags.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-dark-400 pt-4 border-t border-dark-700/30">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {prompt.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5" />
                  {prompt.testCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(prompt.updatedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">提示词名称</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">分类</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">浏览量</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">测试数</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">更新时间</th>
                {canDel && (
                  <th className="text-right px-6 py-4 text-sm font-medium text-dark-400">操作</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedPrompts.map((prompt, index) => (
                <motion.tr
                  key={prompt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-dark-700/30 hover:bg-dark-700/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/spaces/${spaceId}/prompts/${prompt.id}`)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{prompt.title}</p>
                      <p className="text-xs text-dark-400 mt-0.5 truncate max-w-xs">
                        {prompt.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-300">{prompt.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`tag ${
                        prompt.status === 'published'
                          ? 'tag-success'
                          : prompt.status === 'draft'
                          ? 'tag-warning'
                          : 'tag-secondary'
                      }`}
                    >
                      {prompt.status === 'published'
                        ? '已发布'
                        : prompt.status === 'draft'
                        ? '草稿'
                        : '已归档'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-300">{prompt.viewCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-300">{prompt.testCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-400">
                      {new Date(prompt.updatedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </td>
                  {canDel && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrompt(prompt.id);
                        }}
                        className="p-2 text-dark-400 hover:text-rose-400 hover:bg-dark-700/50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sortedPrompts.length === 0 && (
        <div className="glass-card p-16 text-center">
          <FileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-300 mb-2">暂无提示词</h3>
          <p className="text-dark-500 mb-6">创建你的第一个提示词，开始沉淀团队知识</p>
          {canEdit && (
            <button
              onClick={() => navigate(`/spaces/${spaceId}/prompts/new`)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新建提示词
            </button>
          )}
        </div>
      )}
    </div>
  );
}
