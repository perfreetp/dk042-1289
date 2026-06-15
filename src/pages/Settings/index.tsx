import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Crown,
  Shield,
  Edit3,
  Eye,
  Trash2,
  ChevronDown,
  Mail,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const roles = [
  { id: 'owner', label: '所有者', icon: Crown, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  { id: 'admin', label: '管理员', icon: Shield, color: 'text-primary-400', bgColor: 'bg-primary-500/20' },
  { id: 'editor', label: '可编辑', icon: Edit3, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { id: 'viewer', label: '只读', icon: Eye, color: 'text-dark-400', bgColor: 'bg-dark-700/50' },
];

export default function Settings() {
  const { spaces, members, addMember, updateMemberRole, removeMember } = useAppStore();
  const [activeSpace, setActiveSpace] = useState(spaces[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);

  const currentSpace = spaces.find((s) => s.id === activeSpace);
  const spaceMembers = members.filter(
    (m) =>
      m.spaceId === activeSpace &&
      (m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentSpaceMembers = members.filter((m) => m.spaceId === activeSpace);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    addMember({
      userId: `user-${Date.now()}`,
      spaceId: activeSpace,
      name: inviteEmail.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail}`,
      role: inviteRole as any,
    });

    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('viewer');
  };

  const handleChangeRole = (memberId: string, role: string) => {
    updateMemberRole(memberId, role as any);
    setOpenRoleMenu(null);
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('确定要移除该成员吗？')) {
      removeMember(memberId);
    }
  };

  const getRoleInfo = (role: string) => {
    return roles.find((r) => r.id === role) || roles[3];
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-dark-400 mt-1">管理空间成员和权限设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <h3 className="font-medium text-white mb-4">选择空间</h3>
            <div className="space-y-1">
              {spaces
                .filter((s) => !s.isDeleted)
                .map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setActiveSpace(space.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      activeSpace === space.id
                        ? 'bg-primary-500/20 text-white'
                        : 'text-dark-300 hover:bg-dark-700/50 hover:text-white'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                      style={{ backgroundColor: `${space.color}30`, color: space.color }}
                    >
                      {space.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium truncate">{space.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">
                    {currentSpace?.name || '空间'} 成员
                  </h2>
                  <p className="text-sm text-dark-400">共 {currentSpaceMembers.length} 位成员</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                邀请成员
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索成员..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800/50 border border-dark-700 rounded-lg text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              {spaceMembers.map((member, index) => {
                const roleInfo = getRoleInfo(member.role);
                const RoleIcon = roleInfo.icon;

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-700/30 transition-colors"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{member.name}</h4>
                        {member.role === 'owner' && (
                          <span className="text-xs text-amber-400">所有者</span>
                        )}
                      </div>
                      <p className="text-sm text-dark-400">
                        加入于 {new Date(member.joinedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setOpenRoleMenu(openRoleMenu === member.id ? null : member.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${roleInfo.bgColor} ${roleInfo.color} text-sm font-medium hover:opacity-80 transition-opacity`}
                        disabled={member.role === 'owner'}
                      >
                        <RoleIcon className="w-4 h-4" />
                        {roleInfo.label}
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>

                      <AnimatePresence>
                        {openRoleMenu === member.id && member.role !== 'owner' && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-2 w-40 py-2 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-10"
                          >
                            {roles
                              .filter((r) => r.id !== 'owner')
                              .map((role) => {
                                const RIcon = role.icon;
                                return (
                                  <button
                                    key={role.id}
                                    onClick={() => handleChangeRole(member.id, role.id)}
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-dark-600 transition-colors ${
                                      member.role === role.id ? role.color : 'text-dark-200'
                                    }`}
                                  >
                                    <RIcon className="w-4 h-4" />
                                    {role.label}
                                  </button>
                                );
                              })}
                            <div className="my-1 border-t border-dark-600" />
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-dark-600 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              移除成员
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">权限说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const permissions = {
                  owner: ['管理所有成员', '编辑空间设置', '创建/编辑提示词', '删除空间', '所有数据访问'],
                  admin: ['管理成员', '编辑空间设置', '创建/编辑提示词', '查看所有数据'],
                  editor: ['创建/编辑提示词', '查看所有数据', '发表评论', '发起评审'],
                  viewer: ['查看提示词', '试跑测试', '发表评论'],
                };

                return (
                  <div
                    key={role.id}
                    className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${role.color}`} />
                      </div>
                      <h4 className="font-medium text-white">{role.label}</h4>
                    </div>
                    <ul className="space-y-2">
                      {permissions[role.id as keyof typeof permissions].map((perm, i) => (
                        <li key={i} className="text-sm text-dark-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-500" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">邀请成员</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    邮箱地址
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="输入成员邮箱"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    设置角色
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles
                      .filter((r) => r.id !== 'owner')
                      .map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.id}
                            onClick={() => setInviteRole(role.id)}
                            className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                              inviteRole === role.id
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-dark-600 hover:border-dark-500'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                inviteRole === role.id ? role.color : 'text-dark-400'
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                inviteRole === role.id ? 'text-white' : 'text-dark-300'
                              }`}
                            >
                              {role.label}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送邀请
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
