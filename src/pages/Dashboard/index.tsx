import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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

const quickActions = [
  { title: '创建提示词', icon: Plus, color: 'bg-gradient-primary' },
  { title: '新建空间', icon: FolderKanban, color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  { title: '批量导入', icon: Upload, color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  { title: '批量导出', icon: Download, color: 'bg-gradient-to-r from-rose-500 to-pink-500' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { spaces, prompts, testRecords } = useAppStore();

  const activeSpaces = spaces.filter((s) => !s.isDeleted);
  const activePrompts = prompts.filter((p) => !p.isDeleted);

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

  return (
    <div className="space-y-8">
      <section className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <h2 className="font-display text-2xl font-bold text-white">欢迎回来，张明</h2>
          </div>
          <p className="text-dark-400 mb-6">今天也要高效创作哦～ 你有 3 个待评审的提示词</p>
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
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
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
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => {
                      if (action.title === '新建空间') navigate('/spaces');
                    }}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/50 transition-all group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-dark-200 font-medium">{action.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">待处理任务</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">3 个待评审提示词</p>
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
                    <p className="text-sm font-medium text-white">5 个新测试结果</p>
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
                    <p className="text-sm font-medium text-white">2 个新成员加入</p>
                    <p className="text-xs text-dark-400 mt-1">需要分配权限</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
