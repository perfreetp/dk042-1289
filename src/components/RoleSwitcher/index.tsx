import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, CheckCircle, Eye, Edit3, Shield, Crown, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function RoleSwitcher() {
  const {
    users,
    members,
    currentUserId,
    viewAsUserId,
    setViewAsUserId,
    currentSpaceId,
    getCurrentUserRoleInSpace,
    spaces,
  } = useAppStore();

  const [showMenu, setShowMenu] = useState(false);

  const currentUser = users.find((u) => u.id === currentUserId);
  const effectiveUserId = viewAsUserId || currentUserId;
  const effectiveUser = users.find((u) => u.id === effectiveUserId);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3.5 h-3.5" />;
      case 'admin':
        return <Shield className="w-3.5 h-3.5" />;
      case 'editor':
        return <Edit3 className="w-3.5 h-3.5" />;
      case 'viewer':
        return <Eye className="w-3.5 h-3.5" />;
      default:
        return <Settings className="w-3.5 h-3.5" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return '所有者';
      case 'admin':
        return '管理员';
      case 'editor':
        return '可编辑';
      case 'viewer':
        return '只读';
      default:
        return '成员';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-amber-400 bg-amber-500/20';
      case 'admin':
        return 'text-rose-400 bg-rose-500/20';
      case 'editor':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'viewer':
        return 'text-sky-400 bg-sky-500/20';
      default:
        return 'text-dark-400 bg-dark-700';
    }
  };

  const spaceMembers = currentSpaceId
    ? members
        .filter((m) => m.spaceId === currentSpaceId)
        .map((m) => {
          const user = users.find((u) => u.id === m.userId);
          return { ...m, user };
        })
    : members
        .map((m) => {
          const user = users.find((u) => u.id === m.userId);
          const space = spaces.find((s) => s.id === m.spaceId);
          return { ...m, user, spaceName: space?.name };
        })
        .filter((m) => m.userId !== currentUserId)
        .slice(0, 4);

  const currentRole = currentSpaceId ? getCurrentUserRoleInSpace(currentSpaceId) : null;

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          viewAsUserId
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : 'bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 border border-dark-700 hover:border-dark-600'
        }`}
      >
        <Users className="w-4 h-4" />
        <div className="flex items-center gap-2">
          <img
            src={effectiveUser?.avatar}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium">{effectiveUser?.name}</span>
          {currentRole && (
            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getRoleColor(currentRole)}`}>
              {getRoleIcon(currentRole)}
              {getRoleLabel(currentRole)}
            </span>
          )}
          {viewAsUserId && (
            <span className="text-xs px-2 py-0.5 bg-amber-500/30 text-amber-300 rounded-full">
              模拟中
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-72 py-2 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-dark-700/50">
              <p className="text-xs text-dark-400 mb-2">视角切换</p>
              <p className="text-xs text-dark-500">
                切换不同角色体验权限控制效果
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setViewAsUserId(null);
                  setShowMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  !viewAsUserId
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'hover:bg-dark-700/50 text-dark-300'
                }`}
              >
                <img
                  src={currentUser?.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium flex items-center gap-2">
                    {currentUser?.name}
                    {!viewAsUserId && <CheckCircle className="w-3.5 h-3.5 text-primary-400" />}
                  </p>
                  <p className="text-xs text-dark-500">（本人）{currentUser?.email}</p>
                </div>
              </button>

              <div className="my-2 border-t border-dark-700/50" />

              <p className="text-xs text-dark-500 px-3 py-1">模拟其他成员</p>

              {spaceMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setViewAsUserId(member.userId);
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    viewAsUserId === member.userId
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'hover:bg-dark-700/50 text-dark-300'
                  }`}
                >
                  <img
                    src={member.user?.avatar || member.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium flex items-center gap-2">
                      {member.name}
                      {viewAsUserId === member.userId && (
                        <CheckCircle className="w-3.5 h-3.5 text-primary-400" />
                      )}
                    </p>
                    <p className="text-xs text-dark-500 flex items-center gap-1">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        {getRoleLabel(member.role)}
                      </span>
                      {member.spaceName && <span>· {member.spaceName}</span>}
                    </p>
                  </div>
                </button>
              ))}

              {spaceMembers.length === 0 && (
                <p className="text-sm text-dark-500 text-center py-4">
                  暂无其他成员
                </p>
              )}
            </div>

            <div className="px-4 py-3 border-t border-dark-700/50 bg-dark-900/50">
              <p className="text-xs text-dark-500">
                💡 提示：切换到只读成员后，编辑、删除、新建等操作将被禁用
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
