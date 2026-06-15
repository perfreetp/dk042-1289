import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  RotateCcw,
  Trash,
  AlertTriangle,
  Search,
  Filter,
  FolderKanban,
  FileText,
  Clock,
  User,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Recycle() {
  const {
    recycleItems,
    restoreSpace,
    restorePrompt,
    permanentDeleteSpace,
    permanentDeletePrompt,
    emptyRecycleBin,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'space' | 'prompt'>('all');
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = recycleItems.filter(
    (item) =>
      (activeFilter === 'all' ? true : item.type === activeFilter) &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = (item: any) => {
    if (item.type === 'space') {
      restoreSpace(item.originalData.id);
    } else {
      restorePrompt(item.originalData.id);
    }
  };

  const handlePermanentDelete = (item: any) => {
    if (confirm('确定要永久删除吗？此操作不可恢复。')) {
      if (item.type === 'space') {
        permanentDeleteSpace(item.originalData.id);
      } else {
        permanentDeletePrompt(item.originalData.id);
      }
    }
  };

  const handleEmptyRecycleBin = () => {
    emptyRecycleBin();
    setShowEmptyConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 mt-1">管理已删除的内容，可恢复或永久删除</p>
        </div>
        {recycleItems.length > 0 && (
          <button
            onClick={() => setShowEmptyConfirm(true)}
            className="btn-ghost text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            清空回收站
          </button>
        )}
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索已删除内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveFilter('space')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                activeFilter === 'space'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              空间
            </button>
            <button
              onClick={() => setActiveFilter('prompt')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                activeFilter === 'prompt'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              提示词
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50 bg-dark-800/30">
                <th className="text-left px-6 py-3 text-sm font-medium text-dark-400 w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredItems.map((i) => i.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30"
                  />
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-dark-400">类型</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-dark-400">名称</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-dark-400">所属空间</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-dark-400">删除人</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-dark-400">删除时间</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-dark-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-dark-700/30 hover:bg-dark-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter((id) => id !== item.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {item.type === 'space' ? (
                      <span className="flex items-center gap-2 text-primary-400">
                        <FolderKanban className="w-4 h-4" />
                        空间
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-emerald-400">
                        <FileText className="w-4 h-4" />
                        提示词
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{item.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-400">{item.spaceName || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {item.deletedBy}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(item.deletedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestore(item)}
                        className="p-2 text-dark-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="恢复"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item)}
                        className="p-2 text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="永久删除"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="glass-card p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-dark-700/30 flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-10 h-10 text-dark-600" />
          </div>
          <h3 className="text-lg font-medium text-dark-300 mb-2">回收站为空</h3>
          <p className="text-dark-500">删除的内容会在这里保留，可以随时恢复</p>
        </div>
      )}

      <AnimatePresence>
        {showEmptyConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmptyConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>

              <h2 className="font-display text-xl font-bold text-white text-center mb-2">
                确认清空回收站？
              </h2>
              <p className="text-dark-400 text-center mb-6">
                此操作将永久删除回收站中的所有内容，删除后无法恢复，确定要继续吗？
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmptyConfirm(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleEmptyRecycleBin}
                  className="flex-1 px-4 py-2 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 transition-colors"
                >
                  确认清空
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
