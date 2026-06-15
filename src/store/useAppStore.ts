import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Space, Prompt, Version, TestRecord, Comment, Review, Member, RecycleItem, User } from '../types';
import {
  mockSpaces,
  mockPrompts,
  mockVersions,
  mockTestRecords,
  mockComments,
  mockReviews,
  mockMembers,
  mockUsers,
} from '../mock';

interface AppState {
  spaces: Space[];
  prompts: Prompt[];
  versions: Version[];
  testRecords: TestRecord[];
  comments: Comment[];
  reviews: Review[];
  members: Member[];
  recycleItems: RecycleItem[];
  users: User[];
  currentUserId: string;
  currentSpaceId: string | null;
  currentPromptId: string | null;

  setCurrentSpace: (id: string | null) => void;
  setCurrentPrompt: (id: string | null) => void;
  getCurrentUser: () => User | undefined;
  getCurrentUserRoleInSpace: (spaceId: string) => Member['role'] | null;
  canEditPrompt: (spaceId: string) => boolean;
  canDeletePrompt: (spaceId: string) => boolean;
  canInitiateReview: (spaceId: string) => boolean;

  createSpace: (space: Omit<Space, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'promptCount' | 'memberCount'>) => void;
  updateSpace: (id: string, data: Partial<Space>) => void;
  deleteSpace: (id: string) => void;
  restoreSpace: (id: string) => void;
  permanentDeleteSpace: (id: string) => void;

  createPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'testCount' | 'viewCount' | 'currentVersion'>) => void;
  updatePrompt: (id: string, data: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  restorePrompt: (id: string) => void;
  permanentDeletePrompt: (id: string) => void;
  incrementViewCount: (id: string) => void;

  addVersion: (version: Omit<Version, 'id' | 'createdAt'>) => void;
  getVersionsByPromptId: (promptId: string) => Version[];
  rollbackToVersion: (promptId: string, versionId: string) => void;

  addTestRecord: (record: Omit<TestRecord, 'id' | 'createdAt'>) => void;
  getTestRecordsByPromptId: (promptId: string) => TestRecord[];

  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getCommentsByPromptId: (promptId: string) => Comment[];

  createReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReviewStatus: (id: string, status: Review['status'], conclusion?: string) => void;

  addMember: (member: Omit<Member, 'id' | 'joinedAt'>) => void;
  updateMemberRole: (memberId: string, role: Member['role']) => void;
  removeMember: (memberId: string) => void;
  getMembersBySpaceId: (spaceId: string) => Member[];

  emptyRecycleBin: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      spaces: mockSpaces,
      prompts: mockPrompts,
      versions: mockVersions,
      testRecords: mockTestRecords,
      comments: mockComments,
      reviews: mockReviews,
      members: mockMembers,
      users: mockUsers,
      recycleItems: [],
      currentUserId: 'user-1',
      currentSpaceId: null,
      currentPromptId: null,

      setCurrentSpace: (id) => set({ currentSpaceId: id }),
      setCurrentPrompt: (id) => set({ currentPromptId: id }),

      getCurrentUser: () => {
        return get().users.find((u) => u.id === get().currentUserId);
      },

      getCurrentUserRoleInSpace: (spaceId) => {
        const { currentUserId, members } = get();
        const member = members.find((m) => m.spaceId === spaceId && m.userId === currentUserId);
        return member?.role || null;
      },

      canEditPrompt: (spaceId) => {
        const role = get().getCurrentUserRoleInSpace(spaceId);
        return role === 'owner' || role === 'admin' || role === 'editor';
      },

      canDeletePrompt: (spaceId) => {
        const role = get().getCurrentUserRoleInSpace(spaceId);
        return role === 'owner' || role === 'admin';
      },

      canInitiateReview: (spaceId) => {
        const role = get().getCurrentUserRoleInSpace(spaceId);
        return role === 'owner' || role === 'admin' || role === 'editor';
      },

      createSpace: (spaceData) => {
        const newSpace: Space = {
          ...spaceData,
          id: `space-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
          promptCount: 0,
          memberCount: 1,
        };
        set((state) => ({ spaces: [...state.spaces, newSpace] }));
      },

      updateSpace: (id, data) => {
        set((state) => ({
          spaces: state.spaces.map((s) =>
            s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },

      deleteSpace: (id) => {
        const { spaces, prompts } = get();
        const space = spaces.find((s) => s.id === id);
        if (!space) return;

        const recycleItem: RecycleItem = {
          id: `recycle-${Date.now()}`,
          type: 'space',
          title: space.name,
          deletedBy: '当前用户',
          deletedAt: new Date().toISOString(),
          originalData: space,
        };

        const spacePrompts = prompts.filter((p) => p.spaceId === id);
        const promptRecycleItems: RecycleItem[] = spacePrompts.map((p) => ({
          id: `recycle-${p.id}`,
          type: 'prompt',
          title: p.title,
          spaceName: space.name,
          deletedBy: '当前用户',
          deletedAt: new Date().toISOString(),
          originalData: p,
        }));

        set((state) => ({
          spaces: state.spaces.map((s) =>
            s.id === id ? { ...s, isDeleted: true, updatedAt: new Date().toISOString() } : s
          ),
          prompts: state.prompts.map((p) =>
            p.spaceId === id ? { ...p, isDeleted: true } : p
          ),
          recycleItems: [...state.recycleItems, recycleItem, ...promptRecycleItems],
        }));
      },

      restoreSpace: (id) => {
        set((state) => ({
          spaces: state.spaces.map((s) =>
            s.id === id ? { ...s, isDeleted: false, updatedAt: new Date().toISOString() } : s
          ),
          prompts: state.prompts.map((p) =>
            p.spaceId === id ? { ...p, isDeleted: false } : p
          ),
          recycleItems: state.recycleItems.filter(
            (item) => !(item.type === 'space' && (item.originalData as Space).id === id) &&
                      !(item.type === 'prompt' && (item.originalData as Prompt).spaceId === id)
          ),
        }));
      },

      permanentDeleteSpace: (id) => {
        set((state) => ({
          spaces: state.spaces.filter((s) => s.id !== id),
          prompts: state.prompts.filter((p) => p.spaceId !== id),
          recycleItems: state.recycleItems.filter(
            (item) => !(item.type === 'space' && (item.originalData as Space).id === id) &&
                      !(item.type === 'prompt' && (item.originalData as Prompt).spaceId === id)
          ),
        }));
      },

      createPrompt: (promptData) => {
        const newPrompt: Prompt = {
          ...promptData,
          id: `prompt-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
          testCount: 0,
          viewCount: 0,
          currentVersion: 1,
        };

        const newVersion: Version = {
          id: `version-${Date.now()}`,
          promptId: newPrompt.id,
          versionNumber: 1,
          content: promptData.content,
          variables: promptData.variables,
          steps: promptData.steps,
          examples: promptData.examples,
          notes: promptData.notes,
          createdBy: promptData.createdBy,
          createdByName: promptData.createdByName,
          createdAt: new Date().toISOString(),
          changeLog: '创建初始版本',
        };

        set((state) => ({
          prompts: [...state.prompts, newPrompt],
          versions: [...state.versions, newVersion],
          spaces: state.spaces.map((s) =>
            s.id === promptData.spaceId
              ? { ...s, promptCount: s.promptCount + 1, updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },

      updatePrompt: (id, data) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deletePrompt: (id) => {
        const { prompts } = get();
        const prompt = prompts.find((p) => p.id === id);
        const space = get().spaces.find((s) => s.id === prompt?.spaceId);
        if (!prompt) return;

        const recycleItem: RecycleItem = {
          id: `recycle-${id}`,
          type: 'prompt',
          title: prompt.title,
          spaceName: space?.name,
          deletedBy: '当前用户',
          deletedAt: new Date().toISOString(),
          originalData: prompt,
        };

        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, isDeleted: true, updatedAt: new Date().toISOString() } : p
          ),
          recycleItems: [...state.recycleItems, recycleItem],
        }));
      },

      restorePrompt: (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, isDeleted: false, updatedAt: new Date().toISOString() } : p
          ),
          recycleItems: state.recycleItems.filter(
            (item) => !(item.type === 'prompt' && (item.originalData as Prompt).id === id)
          ),
        }));
      },

      permanentDeletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
          versions: state.versions.filter((v) => v.promptId !== id),
          testRecords: state.testRecords.filter((t) => t.promptId !== id),
          comments: state.comments.filter((c) => c.promptId !== id),
          recycleItems: state.recycleItems.filter(
            (item) => !(item.type === 'prompt' && (item.originalData as Prompt).id === id)
          ),
        }));
      },

      incrementViewCount: (id) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
          ),
        }));
      },

      addVersion: (versionData) => {
        const newVersion: Version = {
          ...versionData,
          id: `version-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          versions: [...state.versions, newVersion],
          prompts: state.prompts.map((p) =>
            p.id === versionData.promptId
              ? {
                  ...p,
                  currentVersion: versionData.versionNumber,
                  content: versionData.content,
                  variables: versionData.variables,
                  steps: versionData.steps,
                  examples: versionData.examples,
                  notes: versionData.notes,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      getVersionsByPromptId: (promptId) => {
        return get()
          .versions.filter((v) => v.promptId === promptId)
          .sort((a, b) => b.versionNumber - a.versionNumber);
      },

      rollbackToVersion: (promptId, versionId) => {
        const version = get().versions.find((v) => v.id === versionId);
        const prompt = get().prompts.find((p) => p.id === promptId);
        if (!version || !prompt) return;

        const newVersionNumber = prompt.currentVersion + 1;
        const newVersion: Version = {
          id: `version-${Date.now()}`,
          promptId,
          versionNumber: newVersionNumber,
          content: version.content,
          variables: version.variables,
          steps: version.steps,
          examples: version.examples,
          notes: version.notes,
          createdBy: 'user-1',
          createdByName: '张明',
          createdAt: new Date().toISOString(),
          changeLog: `回滚到 v${version.versionNumber} 版本`,
        };

        set((state) => ({
          versions: [...state.versions, newVersion],
          prompts: state.prompts.map((p) =>
            p.id === promptId
              ? {
                  ...p,
                  currentVersion: newVersionNumber,
                  content: version.content,
                  variables: version.variables,
                  steps: version.steps,
                  examples: version.examples,
                  notes: version.notes,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      addTestRecord: (recordData) => {
        const newRecord: TestRecord = {
          ...recordData,
          id: `test-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          testRecords: [...state.testRecords, newRecord],
          prompts: state.prompts.map((p) =>
            p.id === recordData.promptId ? { ...p, testCount: p.testCount + 1 } : p
          ),
        }));
      },

      getTestRecordsByPromptId: (promptId) => {
        return get()
          .testRecords.filter((t) => t.promptId === promptId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      addComment: (commentData) => {
        const newComment: Comment = {
          ...commentData,
          id: `comment-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ comments: [...state.comments, newComment] }));
      },

      getCommentsByPromptId: (promptId) => {
        return get()
          .comments.filter((c) => c.promptId === promptId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      createReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `review-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ reviews: [...state.reviews, newReview] }));
      },

      updateReviewStatus: (id, status, conclusion) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? { ...r, status, conclusion: conclusion || r.conclusion, updatedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      addMember: (memberData) => {
        const newMember: Member = {
          ...memberData,
          id: `member-${Date.now()}`,
          joinedAt: new Date().toISOString(),
        };
        set((state) => ({
          members: [...state.members, newMember],
          spaces: state.spaces.map((s) =>
            s.id === memberData.spaceId
              ? { ...s, memberCount: s.memberCount + 1 }
              : s
          ),
        }));
      },

      updateMemberRole: (memberId, role) => {
        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId ? { ...m, role } : m
          ),
        }));
      },

      removeMember: (memberId) => {
        const member = get().members.find((m) => m.id === memberId);
        set((state) => ({
          members: state.members.filter((m) => m.id !== memberId),
          spaces: state.spaces.map((s) =>
            s.id === member?.spaceId
              ? { ...s, memberCount: Math.max(0, s.memberCount - 1) }
              : s
          ),
        }));
      },

      getMembersBySpaceId: (spaceId) => {
        return get().members.filter((m) => m.spaceId === spaceId);
      },

      emptyRecycleBin: () => {
        const { recycleItems } = get();
        const spaceIds = recycleItems
          .filter((item) => item.type === 'space')
          .map((item) => (item.originalData as Space).id);
        const promptIds = recycleItems
          .filter((item) => item.type === 'prompt')
          .map((item) => (item.originalData as Prompt).id);

        set((state) => ({
          spaces: state.spaces.filter((s) => !spaceIds.includes(s.id)),
          prompts: state.prompts.filter((p) => !promptIds.includes(p.id)),
          recycleItems: [],
        }));
      },
    }),
    {
      name: 'prompt-knowledge-base',
    }
  )
);
