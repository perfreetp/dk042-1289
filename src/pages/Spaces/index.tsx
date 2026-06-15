import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Space } from '../../types';

const iconMap: Record<string, any> = {
  PenTool,
  Layers,
  Code,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
};

export default function Spaces() {
  const navigate = useNavigate();
  const { spaces, createSpace, deleteSpace } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [newSpace, setNewSpace] = useState({
    name: '',
    description: '',
    icon: 'PenTool',
    color: '#6366f1',
  });

  const activeSpaces = spaces.filter(
    (s) => !s.isDeleted &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateSpace = () => {
    if (!newSpace.name.trim()) return;

    createSpace({
      name: newSpace.name,
      description: newSpace.description,
      icon: newSpace.icon,
      color: newSpace.color,
      ownerId: 'user-1',
    });

    setShowCreateModal(false);
    setNewSpace({ name: '', description: '', icon: 'PenTool', color: '#6366f1' });
  };

  const handleDeleteSpace = (id: string) => {
    deleteSpace(id);
    setSelectedSpace(null);
  };

  const iconOptions = ['PenTool', 'Layers', 'Code', 'BarChart3', 'HeadphonesIcon', 'GraduationCap'];
  const colorOptions = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 mt-1">管理你的业务空间，按团队或项目组织提示词</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建空间
        </button>
      </div>

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
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-dark-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-dark-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
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
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${space.color}20` }}
                  >
                    <IconComponent className="w-7 h-7" style={{ color: space.color }} />
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpace(selectedSpace === space.id ? null : space.id);
                      }}
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
                            onClick={() => {
                              navigate(`/spaces/${space.id}`);
                              setSelectedSpace(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            进入空间
                          </button>
                          <button
                            onClick={() => handleDeleteSpace(space.id)}
                            className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-dark-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除空间
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {space.name}
                </h3>
                <p className="text-sm text-dark-400 mb-4 line-clamp-2">{space.description}</p>

                <div className="flex items-center gap-4 text-xs text-dark-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {space.promptCount} 提示词
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {space.memberCount} 成员
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-700/50">
                  <Clock className="w-3.5 h-3.5 text-dark-500" />
                  <span className="text-xs text-dark-500">
                    更新于 {new Date(space.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
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
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${space.color}20` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: space.color }} />
                        </div>
                        <span className="font-medium text-white">{space.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-dark-400 truncate max-w-xs">{space.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="tag tag-primary">{space.promptCount} 个</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark-300">{space.memberCount} 人</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark-400">
                        {new Date(space.updatedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSpace(space.id);
                        }}
                        className="p-2 text-dark-400 hover:text-rose-400 hover:bg-dark-700/50 rounded-lg transition-colors"
                      >
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
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">空间名称</label>
                  <input
                    type="text"
                    value={newSpace.name}
                    onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                    placeholder="输入空间名称"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">空间描述</label>
                  <textarea
                    value={newSpace.description}
                    onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                    placeholder="描述这个空间的用途..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">选择图标</label>
                  <div className="flex gap-2">
                    {iconOptions.map((icon) => {
                      const IconComp = iconMap[icon] || PenTool;
                      return (
                        <button
                          key={icon}
                          onClick={() => setNewSpace({ ...newSpace, icon })}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            newSpace.icon === icon
                              ? 'bg-primary-500/20 border-2 border-primary-500'
                              : 'bg-dark-700/50 border border-dark-600 hover:border-dark-500'
                          }`}
                        >
                          <IconComp
                            className="w-6 h-6"
                            style={{ color: newSpace.icon === icon ? newSpace.color : '#94a3b8' }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">主题颜色</label>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewSpace({ ...newSpace, color })}
                        className={`w-10 h-10 rounded-full transition-all ${
                          newSpace.color === color
                            ? 'ring-2 ring-offset-2 ring-offset-dark-800 ring-white scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateSpace}
                  disabled={!newSpace.name.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建空间
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
