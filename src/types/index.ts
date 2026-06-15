export interface Space {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  promptCount: number;
  memberCount: number;
}

export interface Variable {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  defaultValue: string;
  description: string;
  options?: string[];
}

export interface Step {
  order: number;
  title: string;
  description: string;
}

export interface Example {
  title: string;
  input: string;
  output: string;
}

export interface Prompt {
  id: string;
  spaceId: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  currentVersion: number;
  variables: Variable[];
  steps: Step[];
  examples: Example[];
  notes: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  testCount: number;
  viewCount: number;
}

export interface Version {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  variables: Variable[];
  steps: Step[];
  examples: Example[];
  notes: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  changeLog: string;
}

export interface TestRecord {
  id: string;
  promptId: string;
  promptTitle: string;
  promptVersion: number;
  inputValues: Record<string, string>;
  output: string;
  duration: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  rating?: number;
  note?: string;
}

export interface Comment {
  id: string;
  promptId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  promptId: string;
  promptTitle: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  initiator: string;
  initiatorName: string;
  reviewers: string[];
  reviewerNames: string[];
  conclusion: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId: string;
  spaceId: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member';
}

export interface RecycleItem {
  id: string;
  type: 'space' | 'prompt';
  title: string;
  spaceName?: string;
  deletedBy: string;
  deletedAt: string;
  originalData: Space | Prompt;
}

export interface ActivityData {
  date: string;
  promptsCreated: number;
  testsRun: number;
  comments: number;
  activeUsers: number;
}

export interface AbandonedItem {
  id: string;
  type: 'space' | 'prompt';
  title: string;
  spaceName?: string;
  lastActivity: string;
  daysInactive: number;
}
