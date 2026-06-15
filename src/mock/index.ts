import type { Space, Prompt, Version, TestRecord, Comment, Review, Member, User, ActivityData } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '张明',
    email: 'zhangming@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    role: 'admin',
  },
  {
    id: 'user-2',
    name: '李华',
    email: 'lihua@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lihua',
    role: 'member',
  },
  {
    id: 'user-3',
    name: '王芳',
    email: 'wangfang@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang',
    role: 'member',
  },
  {
    id: 'user-4',
    name: '陈杰',
    email: 'chenjie@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjie',
    role: 'member',
  },
];

export const mockSpaces: Space[] = [
  {
    id: 'space-1',
    name: '内容创作中心',
    description: '聚焦营销文案、社媒内容、博客文章等内容创作类提示词',
    icon: 'PenTool',
    color: '#6366f1',
    ownerId: 'user-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    isDeleted: false,
    promptCount: 24,
    memberCount: 8,
  },
  {
    id: 'space-2',
    name: '产品设计',
    description: '产品需求文档、用户故事、原型描述等产品相关提示词',
    icon: 'Layers',
    color: '#8b5cf6',
    ownerId: 'user-2',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-18T11:20:00Z',
    isDeleted: false,
    promptCount: 15,
    memberCount: 6,
  },
  {
    id: 'space-3',
    name: '代码开发',
    description: '代码生成、代码审查、Bug 修复等开发类提示词',
    icon: 'Code',
    color: '#10b981',
    ownerId: 'user-3',
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-03-22T16:45:00Z',
    isDeleted: false,
    promptCount: 32,
    memberCount: 12,
  },
  {
    id: 'space-4',
    name: '数据分析',
    description: '数据分析报告、SQL 查询、数据可视化等相关提示词',
    icon: 'BarChart3',
    color: '#f59e0b',
    ownerId: 'user-1',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-15T09:30:00Z',
    isDeleted: false,
    promptCount: 18,
    memberCount: 5,
  },
  {
    id: 'space-5',
    name: '客户服务',
    description: '客服回复模板、投诉处理、FAQ 生成等客户服务类提示词',
    icon: 'HeadphonesIcon',
    color: '#06b6d4',
    ownerId: 'user-4',
    createdAt: '2024-03-01T13:00:00Z',
    updatedAt: '2024-03-21T10:15:00Z',
    isDeleted: false,
    promptCount: 12,
    memberCount: 7,
  },
  {
    id: 'space-6',
    name: '教育培训',
    description: '课程设计、习题生成、学习计划等教育类提示词',
    icon: 'GraduationCap',
    color: '#ec4899',
    ownerId: 'user-2',
    createdAt: '2024-03-10T10:30:00Z',
    updatedAt: '2024-03-19T15:00:00Z',
    isDeleted: false,
    promptCount: 9,
    memberCount: 4,
  },
];

export const mockPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    spaceId: 'space-1',
    title: '爆款小红书文案生成器',
    description: '生成吸引人的小红书风格文案，包含标题、正文、标签',
    content: `你是一位资深的小红书内容创作者，擅长撰写爆款笔记。请根据以下信息创作一篇小红书风格的文案：

产品/主题：{{topic}}
目标受众：{{audience}}
核心卖点：{{sellingPoints}}
风格要求：{{style}}

请按照以下格式输出：

【标题】
（创作3-5个吸引人的标题选项）

【正文】
（撰写正文内容，要求：
- 开头要有吸引力，能引起读者共鸣
- 中间分点阐述核心内容，使用emoji点缀
- 结尾要有互动引导，鼓励评论点赞
- 整体语气亲切自然，像朋友分享）

【标签】
（推荐5-8个相关热门标签）`,
    category: '营销文案',
    tags: ['小红书', '文案', '营销', '爆款'],
    status: 'published',
    currentVersion: 3,
    variables: [
      { name: 'topic', type: 'text', defaultValue: '', description: '产品或主题名称' },
      { name: 'audience', type: 'text', defaultValue: '年轻女性', description: '目标受众群体' },
      { name: 'sellingPoints', type: 'textarea', defaultValue: '', description: '核心卖点，每行一个' },
      {
        name: 'style',
        type: 'select',
        defaultValue: '活泼亲切',
        description: '文案风格',
        options: ['活泼亲切', '专业权威', '文艺清新', '搞笑幽默', '干货实用'],
      },
    ],
    steps: [
      { order: 1, title: '明确主题', description: '确定要推广的产品或内容主题' },
      { order: 2, title: '填充变量', description: '根据实际情况填写所有变量信息' },
      { order: 3, title: '生成文案', description: '点击试跑生成文案初稿' },
      { order: 4, title: '优化调整', description: '根据生成结果进行人工优化和调整' },
    ],
    examples: [
      {
        title: '示例：护肤品推广',
        input: `topic: 玻尿酸保湿精华
audience: 25-35岁干性肌肤女性
sellingPoints: 深层补水、持久保湿、清爽不粘腻、敏感肌可用
style: 活泼亲切`,
        output: `【标题】
1. 干皮救星💦这支玻尿酸精华让我皮肤喝饱水！
2. 用了3天皮肤嫩到掐出水💧平价玻尿酸天花板
3. 敏感肌也能冲！这支精华补水力真的绝绝子

【正文】
姐妹们！今天必须给你们安利这支我最近的心头好——玻尿酸保湿精华！💦

作为一个资深干皮，我真的试过太多补水产品了
要么不够保湿，要么粘腻到怀疑人生...
直到我遇到这支！真的打开了新世界的大门🚪

✨为啥我这么爱它？
🔸 深层补水：小分子玻尿酸直达肌底，不是表面假润
🔸 持久保湿：早上涂的，到晚上脸还是嫩嫩的
🔸 清爽不粘：质地像水一样，吸收超快，油皮也能用
🔸 温和安心：无香精无酒精，敏感肌姐妹放心冲

我现在每天早晚都用
上妆前涂一点，底妆都服帖好多
再也没有卡粉斑驳的尴尬了～

💡小tips：
敷面膜前涂一层打底，效果翻倍哦！

好啦，今天的分享就到这里
姐妹们有什么补水好物，评论区告诉我呀～
喜欢的话记得点赞收藏哦💗

【标签】
#玻尿酸精华 #干皮救星 #补水保湿 #护肤分享
#平价好物 #敏感肌护肤 #学生党护肤 #好物推荐`,
      },
    ],
    notes:
      '1. 建议根据实际产品调整卖点描述，越具体效果越好\n2. 标签建议搭配热门标签和长尾标签\n3. 发布时间建议选择用户活跃时段（早8点、午12点、晚8点）',
    createdBy: 'user-1',
    createdByName: '张明',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    isDeleted: false,
    testCount: 156,
    viewCount: 892,
  },
  {
    id: 'prompt-2',
    spaceId: 'space-1',
    title: '公众号推文标题生成',
    description: '生成多种风格的公众号文章标题',
    content: '你是一位专业的新媒体标题策划师...',
    category: '营销文案',
    tags: ['公众号', '标题', '新媒体'],
    status: 'published',
    currentVersion: 1,
    variables: [
      { name: 'articleTopic', type: 'text', defaultValue: '', description: '文章主题' },
      { name: 'titleStyle', type: 'select', defaultValue: '悬念式', description: '标题风格', options: ['悬念式', '数字式', '对比式', '情感共鸣式', '干货式'] },
    ],
    steps: [
      { order: 1, title: '确定主题', description: '明确文章的核心主题' },
      { order: 2, title: '选择风格', description: '根据内容类型选择合适的标题风格' },
      { order: 3, title: '生成并筛选', description: '生成多个标题，选择最佳方案' },
    ],
    examples: [],
    notes: '',
    createdBy: 'user-2',
    createdByName: '李华',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-05T09:00:00Z',
    isDeleted: false,
    testCount: 87,
    viewCount: 456,
  },
  {
    id: 'prompt-3',
    spaceId: 'space-3',
    title: 'React 组件代码生成',
    description: '根据需求描述生成高质量的 React 组件代码',
    content: '你是一位资深的前端工程师，精通 React 和 TypeScript...',
    category: '前端开发',
    tags: ['React', 'TypeScript', '组件', '前端'],
    status: 'published',
    currentVersion: 2,
    variables: [
      { name: 'componentName', type: 'text', defaultValue: '', description: '组件名称' },
      { name: 'requirements', type: 'textarea', defaultValue: '', description: '组件功能需求描述' },
      { name: 'uiFramework', type: 'select', defaultValue: 'Tailwind CSS', description: 'UI 框架', options: ['Tailwind CSS', 'Ant Design', 'Material UI', '无'] },
    ],
    steps: [
      { order: 1, title: '描述需求', description: '详细描述组件的功能和样式需求' },
      { order: 2, title: '生成代码', description: '运行提示词生成组件代码' },
      { order: 3, title: '审查调整', description: '代码审查和必要的调整' },
    ],
    examples: [],
    notes: '生成的代码需要根据项目实际情况进行调整',
    createdBy: 'user-3',
    createdByName: '王芳',
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    isDeleted: false,
    testCount: 234,
    viewCount: 1205,
  },
  {
    id: 'prompt-4',
    spaceId: 'space-2',
    title: '用户故事撰写模板',
    description: '标准格式的用户故事和验收条件生成',
    content: '作为一名产品经理，请帮我撰写用户故事...',
    category: '需求文档',
    tags: ['用户故事', '敏捷', '需求'],
    status: 'draft',
    currentVersion: 1,
    variables: [],
    steps: [],
    examples: [],
    notes: '',
    createdBy: 'user-2',
    createdByName: '李华',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    isDeleted: false,
    testCount: 12,
    viewCount: 89,
  },
  {
    id: 'prompt-5',
    spaceId: 'space-4',
    title: 'SQL 查询优化助手',
    description: '分析 SQL 查询性能并提供优化建议',
    content: '你是一位数据库性能优化专家...',
    category: '数据查询',
    tags: ['SQL', '性能优化', '数据库'],
    status: 'published',
    currentVersion: 1,
    variables: [],
    steps: [],
    examples: [],
    notes: '',
    createdBy: 'user-1',
    createdByName: '张明',
    createdAt: '2024-02-20T15:00:00Z',
    updatedAt: '2024-02-20T15:00:00Z',
    isDeleted: false,
    testCount: 78,
    viewCount: 345,
  },
  {
    id: 'prompt-6',
    spaceId: 'space-5',
    title: '客户投诉回复模板',
    description: '生成专业且有同理心的客户投诉回复',
    content: '你是一位经验丰富的客户服务主管...',
    category: '客服话术',
    tags: ['客服', '投诉处理', '沟通'],
    status: 'published',
    currentVersion: 2,
    variables: [],
    steps: [],
    examples: [],
    notes: '',
    createdBy: 'user-4',
    createdByName: '陈杰',
    createdAt: '2024-03-05T09:30:00Z',
    updatedAt: '2024-03-15T14:20:00Z',
    isDeleted: false,
    testCount: 56,
    viewCount: 234,
  },
];

export const mockVersions: Version[] = [
  {
    id: 'version-1-1',
    promptId: 'prompt-1',
    versionNumber: 1,
    content: '初始版本的小红书文案生成器...',
    variables: [],
    steps: [],
    examples: [],
    notes: '',
    createdBy: 'user-1',
    createdByName: '张明',
    createdAt: '2024-01-20T10:00:00Z',
    changeLog: '创建初始版本',
  },
  {
    id: 'version-1-2',
    promptId: 'prompt-1',
    versionNumber: 2,
    content: '优化后的小红书文案生成器，增加了更多标题选项...',
    variables: [],
    steps: [],
    examples: [],
    notes: '',
    createdBy: 'user-1',
    createdByName: '张明',
    createdAt: '2024-02-10T14:00:00Z',
    changeLog: '增加标题选项数量，优化正文结构',
  },
  {
    id: 'version-1-3',
    promptId: 'prompt-1',
    versionNumber: 3,
    content: `你是一位资深的小红书内容创作者...`,
    variables: mockPrompts[0].variables,
    steps: mockPrompts[0].steps,
    examples: mockPrompts[0].examples,
    notes: mockPrompts[0].notes,
    createdBy: 'user-2',
    createdByName: '李华',
    createdAt: '2024-03-20T14:30:00Z',
    changeLog: '重构提示词结构，增加变量和步骤说明',
  },
];

export const mockTestRecords: TestRecord[] = [
  {
    id: 'test-1',
    promptId: 'prompt-1',
    promptTitle: '爆款小红书文案生成器',
    promptVersion: 3,
    inputValues: {
      topic: '春季新款连衣裙',
      audience: '18-25岁女大学生',
      sellingPoints: '显瘦、百搭、性价比高',
      style: '活泼亲切',
    },
    output: '生成的小红书文案内容...',
    duration: 2500,
    createdBy: 'user-1',
    createdByName: '张明',
    createdAt: '2024-03-22T10:30:00Z',
    rating: 5,
    note: '效果很好，直接可用',
  },
  {
    id: 'test-2',
    promptId: 'prompt-3',
    promptTitle: 'React 组件代码生成',
    promptVersion: 2,
    inputValues: {
      componentName: 'DataTable',
      requirements: '支持分页、排序、筛选的数据表格组件',
      uiFramework: 'Tailwind CSS',
    },
    output: '生成的 React 组件代码...',
    duration: 3200,
    createdBy: 'user-3',
    createdByName: '王芳',
    createdAt: '2024-03-21T15:45:00Z',
    rating: 4,
  },
  {
    id: 'test-3',
    promptId: 'prompt-1',
    promptTitle: '爆款小红书文案生成器',
    promptVersion: 2,
    inputValues: {
      topic: '咖啡探店',
      audience: '城市白领',
      sellingPoints: '环境好、咖啡香、适合拍照',
      style: '文艺清新',
    },
    output: '生成的咖啡探店文案...',
    duration: 2100,
    createdBy: 'user-2',
    createdByName: '李华',
    createdAt: '2024-03-20T09:15:00Z',
    rating: 4,
    note: '需要增加一些具体细节',
  },
  {
    id: 'test-4',
    promptId: 'prompt-5',
    promptTitle: 'SQL 查询优化助手',
    promptVersion: 1,
    inputValues: {},
    output: 'SQL 优化建议...',
    duration: 1800,
    createdBy: 'user-4',
    createdByName: '陈杰',
    createdAt: '2024-03-19T11:00:00Z',
    rating: 5,
  },
  {
    id: 'test-5',
    promptId: 'prompt-6',
    promptTitle: '客户投诉回复模板',
    promptVersion: 2,
    inputValues: {},
    output: '客服回复内容...',
    duration: 1500,
    createdBy: 'user-4',
    createdByName: '陈杰',
    createdAt: '2024-03-18T16:30:00Z',
    rating: 3,
  },
];

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    promptId: 'prompt-1',
    userId: 'user-2',
    userName: '李华',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lihua',
    content: '这个提示词真的超好用！生成的文案质量很高',
    parentId: null,
    createdAt: '2024-03-21T10:00:00Z',
  },
  {
    id: 'comment-2',
    promptId: 'prompt-1',
    userId: 'user-3',
    userName: '王芳',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang',
    content: '同意！我最近也一直在用，节省了好多时间',
    parentId: 'comment-1',
    createdAt: '2024-03-21T10:30:00Z',
  },
  {
    id: 'comment-3',
    promptId: 'prompt-1',
    userId: 'user-1',
    userName: '张明',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    content: '建议可以增加一些不同行业的模板选项',
    parentId: null,
    createdAt: '2024-03-20T15:00:00Z',
  },
];

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    promptId: 'prompt-1',
    promptTitle: '爆款小红书文案生成器',
    status: 'approved',
    initiator: 'user-2',
    initiatorName: '李华',
    reviewers: ['user-1', 'user-3'],
    reviewerNames: ['张明', '王芳'],
    conclusion: '提示词质量优秀，可以推广使用',
    createdAt: '2024-03-18T09:00:00Z',
    updatedAt: '2024-03-19T14:00:00Z',
  },
  {
    id: 'review-2',
    promptId: 'prompt-3',
    promptTitle: 'React 组件代码生成',
    status: 'reviewing',
    initiator: 'user-3',
    initiatorName: '王芳',
    reviewers: ['user-1'],
    reviewerNames: ['张明'],
    conclusion: '',
    createdAt: '2024-03-21T11:00:00Z',
    updatedAt: '2024-03-21T11:00:00Z',
  },
  {
    id: 'review-3',
    promptId: 'prompt-4',
    promptTitle: '用户故事撰写模板',
    status: 'pending',
    initiator: 'user-2',
    initiatorName: '李华',
    reviewers: ['user-1', 'user-4'],
    reviewerNames: ['张明', '陈杰'],
    conclusion: '',
    createdAt: '2024-03-22T08:30:00Z',
    updatedAt: '2024-03-22T08:30:00Z',
  },
];

export const mockMembers: Member[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    spaceId: 'space-1',
    name: '张明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    role: 'owner',
    joinedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'member-2',
    userId: 'user-2',
    spaceId: 'space-1',
    name: '李华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lihua',
    role: 'editor',
    joinedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 'member-3',
    userId: 'user-3',
    spaceId: 'space-1',
    name: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang',
    role: 'viewer',
    joinedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: 'member-4',
    userId: 'user-4',
    spaceId: 'space-1',
    name: '陈杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjie',
    role: 'editor',
    joinedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'member-5',
    userId: 'user-2',
    spaceId: 'space-2',
    name: '李华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lihua',
    role: 'owner',
    joinedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'member-6',
    userId: 'user-3',
    spaceId: 'space-3',
    name: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang',
    role: 'owner',
    joinedAt: '2024-01-20T08:30:00Z',
  },
  {
    id: 'member-7',
    userId: 'user-1',
    spaceId: 'space-3',
    name: '张明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    role: 'admin',
    joinedAt: '2024-01-25T10:00:00Z',
  },
];

export const mockActivityData: ActivityData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    promptsCreated: Math.floor(Math.random() * 10) + 2,
    testsRun: Math.floor(Math.random() * 50) + 10,
    comments: Math.floor(Math.random() * 20) + 5,
    activeUsers: Math.floor(Math.random() * 15) + 5,
  };
});
