import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  FileText,
  FlaskConical,
  TrendingUp,
  Plus,
  Clock,
  Star,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Upload,
  Download,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  FolderPlus,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  importFromCSV,
} from '../../utils/importExport';
import type { Space, Prompt, Variable, Step, Example } from '../../types';

const statCards = [
  {
    title: '空间数量',
    value: 0,
    icon: FolderKanban,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    trend: '+12%',
    trendUp: true,
    key: 'spaces',
  },
  {
    title: '提示词总数',
    value: 0,
    icon: FileText,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    trend: '+25%',
    trendUp: true,
    key: 'prompts',
  },
  {
    title: '测试次数',
    value: 0,
    icon: FlaskConical,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    trend: '+42%',
    trendUp: true,
    key: 'tests',
  },
  {
    title: '本周活跃',
    value: 0,
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    trend: '+8%',
    trendUp: true,
    key: 'activity',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    spaces,
    prompts,
    testRecords,
    createSpace,
    createPrompt,
    reviews,
  } = useAppStore();

  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importType, setImportType] = useState<'json' | 'csv'>('json');
  const [importTarget, setImportTarget] = useState<'new-space' | 'existing-space'>('new-space');
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [newSpaceName, setNewSpaceName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSpaces = spaces.filter((s) => !s.isDeleted);
  const activePrompts = prompts.filter((p) => !p.isDeleted);
  const pendingReviews = reviews.filter((r) => r.status === 'pending' || r.status === 'reviewing');

  const stats = {
    spaces: activeSpaces.length,
    prompts: activePrompts.length,
    tests: testRecords.length,
    activity: Math.floor(Math.random() * 20) + 15,
  };

  const recentPrompts = [...activePrompts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const topPrompts = [...activePrompts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let data: any;

      if (importType === 'json') {
        data = await importFromJSON(file);
      } else {
        data = await importFromCSV(file);
      }

      if (Array.isArray(data)) {
        setImportPreview(data);
      } else if (data.spaces || data.prompts) {
        setImportPreview(data.prompts || data.spaces || []);
      } else {
        setImportPreview([data]);
      }

      setImportResult(null);
    } catch (err: any) {
      alert(err.message || '文件解析失败');
    }
  };

  const handleImport = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      if (importTarget === 'new-space' && newSpaceName.trim()) {
        const spaceColors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];
        const randomColor = spaceColors[Math.floor(Math.random() * spaceColors.length)];

        const tempSpaceId = `space-${Date.now()}`;
        createSpace({
          name: newSpaceName.trim(),
          description: '通过批量导入创建',
          icon: 'FileText',
          color: randomColor,
          ownerId: 'user-1',
        });

        const newSpace = spaces.find((s) => s.name === newSpaceName.trim());
        if (newSpace) {
          for (const item of importPreview) {
            try {
              createPrompt({
                spaceId: newSpace.id,
                title: item.title || item.name || '未命名提示词',
                description: item.description || '',
                content: item.content || '',
                category: item.category || '未分类',
                tags: item.tags || [],
                status: 'draft',
                variables: item.variables || [],
                steps: item.steps || [],
                examples: item.examples || [],
                notes: item.notes || '',
                createdBy: 'user-1',
                createdByName: '张明',
              });
              successCount++;
            } catch {
              failedCount++;
            }
          }
        }
      } else if (importTarget === 'existing-space' && selectedSpaceId) {
        for (const item of importPreview) {
          try {
            createPrompt({
              spaceId: selectedSpaceId,
              title: item.title || item.name || '未命名提示词',
              description: item.description || '',
              content: item.content || '',
              category: item.category || '未分类',
              tags: item.tags || [],
              status: 'draft',
              variables: item.variables || [],
              steps: item.steps || [],
              examples: item.examples || [],
              notes: item.notes || '',
              createdBy: 'user-1',
              createdByName: '张明',
            });
            successCount++;
          } catch {
            failedCount++;
          }
        }
      }

      setImportResult({ success: successCount, failed: failedCount });
    } catch (err) {
      console.error(err);
      setImportResult({ success: 0, failed: importPreview.length });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      exportTime: new Date().toISOString(),
      spaces: activeSpaces,
      prompts: activePrompts.map((p) => ({
        ...p,
      })),
    };
    exportToJSON(exportData, `prompt-hub-export-${Date.now()}`);
    setShowExportModal(false);
  };

  const handleExportCSV = () => {
    exportToCSV(activePrompts, `prompts-export-${Date.now()}`);
    setShowExportModal(false);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportPreview([]);
    setImportResult(null);
    setNewSpaceName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <h2 className="font-display text-2xl font-bold text-white">欢迎回来，张明</h2>
          </div>
          <p className="text-dark-400 mb-6">
            今天也要高效创作哦～ 你有 {pendingReviews.length} 个待评审的提示词
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/spaces')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              开始创建
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              查看教程
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats];

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="glass-card p-6 card-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" style={{ WebkitTextFillColor: 'transparent', background: `linear-gradient(135deg, ${card.color})`, WebkitBackgroundClip: 'text' }} />
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${
                    card.trendUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <ArrowUpRight
                    className={`w-3 h-3 ${!card.trendUp && 'rotate-180'}`}
                  />
                  {card.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-sm text-dark-400">{card.title}</p>
            </motion.div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">最近更新</h3>
                  <p className="text-xs text-dark-400">最近编辑的提示词</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/spaces')}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() =>
                    navigate(`/spaces/${prompt.spaceId}/prompts/${prompt.id}`)
                  }
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                      {prompt.title}
                    </p>
                    <p className="text-xs text-dark-400 truncate">{prompt.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-400">
                      {new Date(prompt.updatedAt).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <span
                      className={`tag text-xs mt-1 ${
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
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">热门提示词</h3>
                <p className="text-xs text-dark-400">浏览量最高的提示词</p>
              </div>
            </div>

            <div className="space-y-3">
              {topPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() =>
                    navigate(`/spaces/${prompt.spaceId}/prompts/${prompt.id}`)
                  }
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                      {prompt.title}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-dark-400 flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" />
                        {prompt.testCount} 次测试
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{prompt.viewCount}</p>
                    <p className="text-xs text-dark-400">浏览量</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate('/spaces')}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-dark-200 font-medium">创建提示词</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                onClick={() => navigate('/spaces')}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-dark-200 font-medium">新建空间</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowImportModal(true)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-dark-200 font-medium">批量导入</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                onClick={() => setShowExportModal(true)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-dark-200 font-medium">批量导出</span>
              </motion.button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">待处理任务</h3>
            <div className="space-y-3">
              <div
                className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-colors"
                onClick={() => navigate('/reviews')}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {pendingReviews.length} 个待评审提示词
                    </p>
                    <p className="text-xs text-dark-400 mt-1">需要你的审核意见</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FlaskConical className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{testRecords.length} 个测试记录</p>
                    <p className="text-xs text-dark-400 mt-1">团队成员提交了测试</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Plus className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activeSpaces.reduce((sum, s) => sum + s.memberCount, 0)} 位团队成员
                    </p>
                    <p className="text-xs text-dark-400 mt-1">共同协作</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeImportModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">批量导入</h2>
                <button
                  onClick={closeImportModal}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!importResult ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-3">
                      导入格式
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setImportType('json');
                          setImportPreview([]);
                        }}
                        className={`flex-1 p-4 rounded-xl border transition-all ${
                          importType === 'json'
                            ? 'bg-primary-500/20 border-primary-500 text-white'
                            : 'bg-dark-800/30 border-dark-700 text-dark-300 hover:border-dark-600'
                        }`}
                      >
                        <div className="font-medium">JSON</div>
                        <div className="text-xs opacity-70 mt-1">支持空间+提示词完整数据</div>
                      </button>
                      <button
                        onClick={() => {
                          setImportType('csv');
                          setImportPreview([]);
                        }}
                        className={`flex-1 p-4 rounded-xl border transition-all ${
                          importType === 'csv'
                            ? 'bg-primary-500/20 border-primary-500 text-white'
                            : 'bg-dark-800/30 border-dark-700 text-dark-300 hover:border-dark-600'
                        }`}
                      >
                        <div className="font-medium">CSV</div>
                        <div className="text-xs opacity-70 mt-1">仅支持提示词基础信息</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-3">
                      导入目标
                    </label>
                    <div className="space-y-3">
                      <label
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          importTarget === 'new-space'
                            ? 'bg-primary-500/10 border-primary-500/50'
                            : 'bg-dark-800/30 border-dark-700 hover:border-dark-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importTarget"
                          checked={importTarget === 'new-space'}
                          onChange={() => setImportTarget('new-space')}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-white">导入到新空间</p>
                          <p className="text-xs text-dark-400 mt-1">创建一个新空间存放导入的提示词</p>
                          {importTarget === 'new-space' && (
                            <input
                              type="text"
                              value={newSpaceName}
                              onChange={(e) => setNewSpaceName(e.target.value)}
                              placeholder="输入空间名称"
                              className="input-field mt-3 text-sm"
                            />
                          )}
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          importTarget === 'existing-space'
                            ? 'bg-primary-500/10 border-primary-500/50'
                            : 'bg-dark-800/30 border-dark-700 hover:border-dark-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importTarget"
                          checked={importTarget === 'existing-space'}
                          onChange={() => setImportTarget('existing-space')}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-white">导入到已有空间</p>
                          <p className="text-xs text-dark-400 mt-1">选择一个现有的空间</p>
                          {importTarget === 'existing-space' && (
                            <select
                              value={selectedSpaceId}
                              onChange={(e) => setSelectedSpaceId(e.target.value)}
                              className="input-field mt-3 text-sm"
                            >
                              <option value="">选择空间...</option>
                              {activeSpaces.map((space) => (
                                <option key={space.id} value={space.id}>
                                  {space.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-3">
                      选择文件
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all"
                    >
                      <Upload className="w-10 h-10 text-dark-500 mx-auto mb-3" />
                      <p className="text-dark-300 mb-1">点击或拖拽文件到这里</p>
                      <p className="text-xs text-dark-500">
                        支持 {importType.toUpperCase()} 格式
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={importType === 'json' ? '.json' : '.csv'}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {importPreview.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-dark-300">
                          预览 ({importPreview.length} 条)
                        </label>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2 bg-dark-800/30 rounded-lg p-3">
                        {importPreview.slice(0, 5).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 rounded-lg bg-dark-700/30"
                          >
                            <FileText className="w-4 h-4 text-primary-400" />
                            <span className="text-sm text-dark-200 truncate flex-1">
                              {item.title || item.name || '未命名'}
                            </span>
                          </div>
                        ))}
                        {importPreview.length > 5 && (
                          <p className="text-xs text-dark-500 text-center pt-2">
                            ...还有 {importPreview.length - 5} 条
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeImportModal}
                      className="flex-1 btn-secondary"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={
                        isImporting ||
                        importPreview.length === 0 ||
                        (importTarget === 'new-space' && !newSpaceName.trim()) ||
                        (importTarget === 'existing-space' && !selectedSpaceId)
                      }
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isImporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          导入中...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          确认导入
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">导入完成</h3>
                  <p className="text-dark-400 mb-6">
                    成功导入 {importResult.success} 条
                    {importResult.failed > 0 && `，失败 ${importResult.failed} 条`}
                  </p>
                  <button
                    onClick={closeImportModal}
                    className="btn-primary min-w-[120px]"
                  >
                    完成
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">批量导出</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-dark-400 mb-6">
                选择导出格式，将当前知识库数据下载到本地
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleExportJSON}
                  className="w-full p-4 rounded-xl bg-dark-800/30 border border-dark-700 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-left flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">导出 JSON</p>
                    <p className="text-xs text-dark-400">
                      完整导出空间和提示词数据，包含变量、步骤等详细信息
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="w-full p-4 rounded-xl bg-dark-800/30 border border-dark-700 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-left flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">导出 CSV</p>
                    <p className="text-xs text-dark-400">
                      仅导出提示词基础信息，可用 Excel 打开
                    </p>
                  </div>
                </button>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-dark-800/50 border border-dark-700">
                <p className="text-xs text-dark-400">
                  <AlertCircle className="w-4 h-4 inline mr-1 align-text-bottom" />
                  当前共 {activeSpaces.length} 个空间、{activePrompts.length} 条提示词
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
