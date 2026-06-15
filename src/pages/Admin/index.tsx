import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Users,
  FileText,
  FlaskConical,
  AlertTriangle,
  Trash2,
  BarChart3,
  Activity,
  Calendar,
  Clock,
  FolderKanban,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { mockActivityData } from '../../mock';

export default function Admin() {
  const { spaces, prompts, testRecords, members } = useAppStore();
  const [activeTab, setActiveTab] = useState<'activity' | 'abandoned' | 'cleanup'>('activity');
  const [timeRange, setTimeRange] = useState('30days');

  const activeSpaces = spaces.filter((s) => !s.isDeleted);
  const activePrompts = prompts.filter((p) => !p.isDeleted);

  const stats = [
    {
      title: '总用户数',
      value: 12,
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/10',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: '总空间数',
      value: activeSpaces.length,
      icon: FolderKanban,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: '总提示词数',
      value: activePrompts.length,
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      trend: '+23%',
      trendUp: true,
    },
    {
      title: '总测试次数',
      value: testRecords.length,
      icon: FlaskConical,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      trend: '+42%',
      trendUp: true,
    },
  ];

  const maxValue = Math.max(...mockActivityData.map((d) => d.promptsCreated + d.testsRun + d.comments));

  const abandonedItems = [
    { id: '1', type: 'prompt', title: '旧版营销文案生成器', spaceName: '内容创作中心', lastActivity: '60天前', daysInactive: 60 },
    { id: '2', type: 'prompt', title: '产品需求文档模板 v1', spaceName: '产品设计', lastActivity: '45天前', daysInactive: 45 },
    { id: '3', type: 'space', title: '项目归档空间', spaceName: '-', lastActivity: '90天前', daysInactive: 90 },
    { id: '4', type: 'prompt', title: '旧版 SQL 查询助手', spaceName: '数据分析', lastActivity: '35天前', daysInactive: 35 },
    { id: '5', type: 'prompt', title: '客服欢迎话术', spaceName: '客户服务', lastActivity: '30天前', daysInactive: 30 },
  ];

  const tabs = [
    { id: 'activity' as const, label: '活跃度统计', icon: Activity },
    { id: 'abandoned' as const, label: '废弃内容', icon: AlertTriangle },
    { id: 'cleanup' as const, label: '批量清理', icon: Trash2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <p className="text-dark-400 text-sm">系统管理员</p>
          <h1 className="font-display text-xl font-bold text-white">管理后台</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" style={{ WebkitTextFillColor: 'transparent' }} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    stat.trendUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-dark-400">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card">
        <div className="border-b border-dark-700/50 px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-primary-500'
                      : 'text-dark-400 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-400" />
                  团队活跃度趋势
                </h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="7days">近 7 天</option>
                  <option value="30days">近 30 天</option>
                  <option value="90days">近 90 天</option>
                </select>
              </div>

              <div className="h-64 flex items-end justify-between gap-1">
                {mockActivityData.slice(-14).map((day, index) => {
                  const totalHeight = day.promptsCreated + day.testsRun + day.comments;
                  const height = (totalHeight / maxValue) * 100;

                  return (
                    <motion.div
                      key={day.date}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.03, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-primary-600 to-secondary-500 rounded-t-lg hover:opacity-80 transition-opacity relative group cursor-pointer"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {totalHeight} 次活动
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs text-dark-500 -mt-6">
                {mockActivityData.slice(-14).map((day, index) => (
                  <span key={day.date} className="flex-1 text-center">
                    {index % 2 === 0 ? new Date(day.date).getDate() + '日' : ''}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-dark-700/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-400">
                    {mockActivityData.reduce((sum, d) => sum + d.promptsCreated, 0)}
                  </p>
                  <p className="text-xs text-dark-400 mt-1">提示词创建</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {mockActivityData.reduce((sum, d) => sum + d.testsRun, 0)}
                  </p>
                  <p className="text-xs text-dark-400 mt-1">测试运行</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">
                    {mockActivityData.reduce((sum, d) => sum + d.comments, 0)}
                  </p>
                  <p className="text-xs text-dark-400 mt-1">评论讨论</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-rose-400">
                    {Math.max(...mockActivityData.map((d) => d.activeUsers))}
                  </p>
                  <p className="text-xs text-dark-400 mt-1">日活峰值</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'abandoned' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-dark-400 text-sm">
                  以下内容超过 30 天未被使用，建议进行清理或归档
                </p>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-sm">全选</button>
                  <button className="btn-primary text-sm">批量归档</button>
                </div>
              </div>

              <div className="space-y-2">
                {abandonedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30"
                    />
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === 'space' ? 'bg-primary-500/20' : 'bg-emerald-500/20'
                      }`}
                    >
                      {item.type === 'space' ? (
                        <FolderKanban className="w-5 h-5 text-primary-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                          {item.daysInactive} 天未使用
                        </span>
                      </div>
                      <p className="text-sm text-dark-400">
                        {item.type === 'space' ? '空间' : '提示词'} · {item.spaceName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-dark-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" />
                        最后活动：{item.lastActivity}
                      </p>
                    </div>
                    <button className="p-2 text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cleanup' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-medium text-white mb-2">清理草稿提示词</h3>
                  <p className="text-sm text-dark-400 mb-4">
                    删除超过 7 天未发布的草稿提示词
                  </p>
                  <p className="text-lg font-bold text-amber-400 mb-4">12 个待清理</p>
                  <button className="btn-secondary w-full text-sm">立即清理</button>
                </div>

                <div className="glass-card p-5">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-rose-400" />
                  </div>
                  <h3 className="font-medium text-white mb-2">清空回收站</h3>
                  <p className="text-sm text-dark-400 mb-4">
                    永久删除回收站中的所有内容
                  </p>
                  <p className="text-lg font-bold text-rose-400 mb-4">8 个项目</p>
                  <button className="bg-rose-500/20 text-rose-400 border border-rose-500/30 w-full py-2 rounded-lg text-sm font-medium hover:bg-rose-500/30 transition-colors">
                    清空回收站
                  </button>
                </div>

                <div className="glass-card p-5">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                    <FolderKanban className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="font-medium text-white mb-2">归档闲置空间</h3>
                  <p className="text-sm text-dark-400 mb-4">
                    归档超过 90 天无活动的空间
                  </p>
                  <p className="text-lg font-bold text-primary-400 mb-4">2 个空间</p>
                  <button className="btn-secondary w-full text-sm">查看详情</button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-medium text-white mb-4">清理记录</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-dark-800/30">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">自动清理任务完成</p>
                      <p className="text-xs text-dark-500">清理了 5 个过期草稿提示词</p>
                    </div>
                    <span className="text-xs text-dark-400">2 天前</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-dark-800/30">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">生成活跃度报告</p>
                      <p className="text-xs text-dark-500">月度团队活跃统计报告</p>
                    </div>
                    <span className="text-xs text-dark-400">5 天前</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
