import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Edit3,
  Save,
  Play,
  History,
  MessageSquare,
  Settings,
  Clock,
  Eye,
  FlaskConical,
  Copy,
  Share2,
  MoreHorizontal,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  ListOrdered,
  FileText,
  Sparkles,
  Tag,
  StickyNote,
  GitCompare,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Variable, Step, Example, Version } from '../../types';

type TabType = 'content' | 'variables' | 'steps' | 'examples' | 'notes' | 'history' | 'comments';

export default function PromptEditor() {
  const { spaceId, promptId } = useParams();
  const navigate = useNavigate();
  const { prompts, createPrompt, updatePrompt, addVersion, incrementViewCount, getVersionsByPromptId, rollbackToVersion } = useAppStore();

  const isNew = promptId === 'new';
  const prompt = !isNew ? prompts.find((p) => p.id === promptId) : null;
  const versions = !isNew ? getVersionsByPromptId(promptId!) : [];

  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [isEditing, setIsEditing] = useState(isNew);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showVersionDiff, setShowVersionDiff] = useState(false);
  const [compareVersions, setCompareVersions] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('营销文案');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [examples, setExamples] = useState<Example[]>([]);
  const [notes, setNotes] = useState('');
  const [changeLog, setChangeLog] = useState('');

  const [testInputs, setTestInputs] = useState<Record<string, string>>({});
  const [testOutput, setTestOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const [comments, setComments] = useState([
    { id: '1', user: '李华', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lihua', content: '这个提示词效果很好！', time: '2小时前' },
    { id: '2', user: '王芳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang', content: '建议增加更多变量选项', time: '1天前' },
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (prompt && !isNew) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      setContent(prompt.content);
      setCategory(prompt.category);
      setTags(prompt.tags);
      setVariables(prompt.variables);
      setSteps(prompt.steps);
      setExamples(prompt.examples);
      setNotes(prompt.notes);

      const inputs: Record<string, string> = {};
      prompt.variables.forEach((v) => {
        inputs[v.name] = v.defaultValue;
      });
      setTestInputs(inputs);

      incrementViewCount(prompt.id);
    }
  }, [prompt, isNew]);

  const tabs = [
    { id: 'content' as TabType, label: '提示词内容', icon: FileText },
    { id: 'variables' as TabType, label: '变量管理', icon: Sparkles },
    { id: 'steps' as TabType, label: '使用步骤', icon: ListOrdered },
    { id: 'examples' as TabType, label: '示例演示', icon: CheckCircle },
    { id: 'notes' as TabType, label: '注意事项', icon: StickyNote },
    { id: 'history' as TabType, label: '版本历史', icon: History },
    { id: 'comments' as TabType, label: '评论讨论', icon: MessageSquare },
  ];

  const handleSave = () => {
    if (!title.trim()) return;

    if (isNew) {
      createPrompt({
        spaceId: spaceId!,
        title,
        description,
        content,
        category,
        tags,
        status: 'draft',
        variables,
        steps,
        examples,
        notes,
        createdBy: 'user-1',
        createdByName: '张明',
      });
      navigate(`/spaces/${spaceId}`);
    } else {
      const newVersionNumber = (prompt?.currentVersion || 0) + 1;
      addVersion({
        promptId: promptId!,
        versionNumber: newVersionNumber,
        content,
        variables,
        steps,
        examples,
        notes,
        createdBy: 'user-1',
        createdByName: '张明',
        changeLog: changeLog || `更新版本 v${newVersionNumber}`,
      });
      updatePrompt(promptId!, {
        title,
        description,
        category,
        tags,
      });
      setIsEditing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddVariable = () => {
    setVariables([
      ...variables,
      { name: `变量${variables.length + 1}`, type: 'text', defaultValue: '', description: '' },
    ]);
  };

  const handleUpdateVariable = (index: number, key: keyof Variable, value: string) => {
    const updated = [...variables];
    (updated[index] as any)[key] = value;
    setVariables(updated);
  };

  const handleRemoveVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { order: steps.length + 1, title: '', description: '' }]);
  };

  const handleUpdateStep = (index: number, key: keyof Step, value: string) => {
    const updated = [...steps];
    (updated[index] as any)[key] = value;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleAddExample = () => {
    setExamples([...examples, { title: '', input: '', output: '' }]);
  };

  const handleUpdateExample = (index: number, key: keyof Example, value: string) => {
    const updated = [...examples];
    (updated[index] as any)[key] = value;
    setExamples(updated);
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let result = content;
    variables.forEach((v) => {
      const value = testInputs[v.name] || v.defaultValue || `{{${v.name}}}`;
      result = result.replace(new RegExp(`\\{\\{${v.name}\\}\\}`, 'g'), value);
    });

    setTestOutput(`【模拟生成结果】

${result}

---
*这是模拟的 AI 生成结果，实际使用时请接入真实的 API 服务。*`);
    setIsTesting(false);
  };

  const handleRollback = (versionId: string) => {
    if (confirm('确定要回滚到这个版本吗？这将创建一个新版本。')) {
      rollbackToVersion(promptId!, versionId);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      {
        id: Date.now().toString(),
        user: '张明',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
        content: newComment,
        time: '刚刚',
      },
      ...comments,
    ]);
    setNewComment('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">提示词标题</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入提示词标题"
                    className="input-field text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">简短描述</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="一句话描述这个提示词的用途"
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">分类</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-field"
                    >
                      <option value="营销文案">营销文案</option>
                      <option value="需求文档">需求文档</option>
                      <option value="前端开发">前端开发</option>
                      <option value="数据查询">数据查询</option>
                      <option value="客服话术">客服话术</option>
                      <option value="产品设计">产品设计</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">变更说明</label>
                    <input
                      type="text"
                      value={changeLog}
                      onChange={(e) => setChangeLog(e.target.value)}
                      placeholder="描述本次修改内容"
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">标签</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="输入标签后按回车添加"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">提示词内容</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在这里编写你的提示词..."
                    rows={16}
                    className="input-field font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-dark-500 mt-2">
                    使用 {'{{变量名}}'} 格式定义变量占位符
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-dark-400">{description}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="tag tag-primary">{category}</span>
                      {tags.map((tag) => (
                        <span key={tag} className="text-sm text-dark-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      复制
                    </button>
                    <button className="btn-ghost flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      分享
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-dark-400 pb-6 border-b border-dark-700/50">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {prompt?.viewCount || 0} 次浏览
                  </span>
                  <span className="flex items-center gap-1">
                    <FlaskConical className="w-4 h-4" />
                    {prompt?.testCount || 0} 次测试
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    更新于 {prompt ? new Date(prompt.updatedAt).toLocaleDateString('zh-CN') : '-'}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-4">提示词内容</h3>
                  <div className="p-6 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <pre className="font-mono text-sm text-dark-200 whitespace-pre-wrap">
                      {content || '暂无内容'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'variables':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-dark-400 text-sm">
                定义提示词中的变量，使用 {'{{变量名}}'} 格式占位
              </p>
              {isEditing && (
                <button onClick={handleAddVariable} className="btn-secondary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  添加变量
                </button>
              )}
            </div>

            {variables.length === 0 ? (
              <div className="text-center py-12 text-dark-500">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无变量</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4"
                  >
                    {isEditing ? (
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                          <label className="text-xs text-dark-400 mb-1 block">变量名</label>
                          <input
                            type="text"
                            value={variable.name}
                            onChange={(e) => handleUpdateVariable(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-dark-400 mb-1 block">类型</label>
                          <select
                            value={variable.type}
                            onChange={(e) => handleUpdateVariable(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                          >
                            <option value="text">文本</option>
                            <option value="number">数字</option>
                            <option value="select">选择</option>
                            <option value="textarea">长文本</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-dark-400 mb-1 block">默认值</label>
                          <input
                            type="text"
                            value={variable.defaultValue}
                            onChange={(e) => handleUpdateVariable(index, 'defaultValue', e.target.value)}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-dark-400 mb-1 block">描述</label>
                          <input
                            type="text"
                            value={variable.description}
                            onChange={(e) => handleUpdateVariable(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button
                            onClick={() => handleRemoveVariable(index)}
                            className="p-2 text-dark-500 hover:text-rose-400 hover:bg-dark-700/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{variable.name}</span>
                            <span className="text-xs px-2 py-0.5 bg-dark-700 text-dark-400 rounded">
                              {variable.type === 'text' ? '文本' : variable.type === 'number' ? '数字' : variable.type === 'select' ? '选择' : '长文本'}
                            </span>
                          </div>
                          <p className="text-sm text-dark-400 mt-0.5">{variable.description || '暂无描述'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-dark-500">默认值</p>
                          <p className="text-sm text-dark-300 font-mono">{variable.defaultValue || '-'}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'steps':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-dark-400 text-sm">分步说明如何使用这个提示词</p>
              {isEditing && (
                <button onClick={handleAddStep} className="btn-secondary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  添加步骤
                </button>
              )}
            </div>

            {steps.length === 0 ? (
              <div className="text-center py-12 text-dark-500">
                <ListOrdered className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无使用步骤</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                      {step.order || index + 1}
                    </div>
                    <div className="flex-1 glass-card p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                            placeholder="步骤标题"
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                          />
                          <textarea
                            value={step.description}
                            onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                            placeholder="步骤详细说明..."
                            rows={2}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleRemoveStep(index)}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              删除步骤
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium text-white mb-1">{step.title}</h4>
                          <p className="text-sm text-dark-400">{step.description}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-dark-400 text-sm">展示示例输入和输出，帮助理解使用方法</p>
              {isEditing && (
                <button onClick={handleAddExample} className="btn-secondary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  添加示例
                </button>
              )}
            </div>

            {examples.length === 0 ? (
              <div className="text-center py-12 text-dark-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无示例</p>
              </div>
            ) : (
              <div className="space-y-6">
                {examples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-5"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={example.title}
                          onChange={(e) => handleUpdateExample(index, 'title', e.target.value)}
                          placeholder="示例标题"
                          className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                        <div>
                          <label className="text-xs text-dark-400 mb-1 block">输入示例</label>
                          <textarea
                            value={example.input}
                            onChange={(e) => handleUpdateExample(index, 'input', e.target.value)}
                            placeholder="输入示例内容..."
                            rows={4}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-dark-400 mb-1 block">输出示例</label>
                          <textarea
                            value={example.output}
                            onChange={(e) => handleUpdateExample(index, 'output', e.target.value)}
                            placeholder="输出示例内容..."
                            rows={6}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none font-mono"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRemoveExample(index)}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            删除示例
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </span>
                          {example.title}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-dark-400 mb-2">输入</p>
                            <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700/50">
                              <pre className="font-mono text-xs text-dark-300 whitespace-pre-wrap">
                                {example.input}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-dark-400 mb-2">输出</p>
                            <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700/50">
                              <pre className="font-mono text-xs text-dark-300 whitespace-pre-wrap">
                                {example.output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <p className="text-dark-400 text-sm">记录使用时需要注意的事项和限制条件</p>

            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="输入注意事项..."
                rows={12}
                className="input-field resize-none"
              />
            ) : (
              <div className="glass-card p-6">
                {notes ? (
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-dark-300 whitespace-pre-wrap">{notes}</div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-dark-500">
                    <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>暂无注意事项</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-dark-400 text-sm">查看历史版本，支持版本对比和回滚</p>
              {compareVersions.length === 2 && (
                <button
                  onClick={() => setShowVersionDiff(true)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <GitCompare className="w-4 h-4" />
                  对比选中版本
                </button>
              )}
            </div>

            {versions.length === 0 ? (
              <div className="text-center py-12 text-dark-500">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无版本记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="glass-card p-4"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={compareVersions.includes(version.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (compareVersions.length < 2) {
                              setCompareVersions([...compareVersions, version.id]);
                            }
                          } else {
                            setCompareVersions(compareVersions.filter((v) => v !== version.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30"
                      />
                      <div className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center">
                        <span className="font-bold text-primary-400 text-sm">
                          v{version.versionNumber}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-white">版本 {version.versionNumber}</h4>
                          {version.versionNumber === prompt?.currentVersion && (
                            <span className="tag tag-success">当前版本</span>
                          )}
                        </div>
                        <p className="text-sm text-dark-400 mt-0.5">{version.changeLog}</p>
                        <p className="text-xs text-dark-500 mt-1">
                          {version.createdByName} · {new Date(version.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      {version.versionNumber !== prompt?.currentVersion && (
                        <button
                          onClick={() => handleRollback(version.id)}
                          className="btn-ghost text-sm flex items-center gap-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          回滚
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming"
                alt="头像"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="发表你的评论..."
                  rows={3}
                  className="input-field resize-none pr-20"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="absolute right-2 bottom-2 btn-primary text-sm py-1.5 px-4 disabled:opacity-50"
                >
                  发送
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{comment.user}</span>
                      <span className="text-xs text-dark-500">{comment.time}</span>
                    </div>
                    <p className="text-dark-300">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-dark-500 hover:text-primary-400">
                        回复
                      </button>
                      <button className="text-xs text-dark-500 hover:text-primary-400">
                        👍 0
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/spaces/${spaceId}`)}
          className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {isNew ? '新建提示词' : '提示词详情'}
          </h1>
          <p className="text-sm text-dark-400">
            {isNew ? '创建一个新的提示词' : `当前版本 v${prompt?.currentVersion || 1}`}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="glass-card">
            <div className="border-b border-dark-700/50 px-6">
              <div className="flex gap-1 -mb-px overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

            <div className="p-6">{renderContent()}</div>
          </div>
        </div>

        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="glass-card p-4 space-y-3">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  保存提示词
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    if (isNew) navigate(`/spaces/${spaceId}`);
                  }}
                  className="btn-secondary w-full"
                >
                  取消
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowTestPanel(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  在线试跑
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑提示词
                </button>
              </>
            )}
          </div>

          <div className="glass-card p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-primary-400" />
              快速信息
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">浏览次数</span>
                <span className="text-white">{prompt?.viewCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">测试次数</span>
                <span className="text-white">{prompt?.testCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">版本数</span>
                <span className="text-white">{versions.length || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">评论数</span>
                <span className="text-white">{comments.length}</span>
              </div>
            </div>
          </div>

          {!isNew && (
            <div className="glass-card p-4">
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-400" />
                快捷标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-dark-700/50 text-dark-300 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-dark-500">暂无标签</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showTestPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-950/60 backdrop-blur-sm z-40"
              onClick={() => setShowTestPanel(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              className="fixed right-0 top-0 h-full w-[480px] bg-dark-900 border-l border-dark-700/50 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-dark-700/50 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">在线试跑</h2>
                <button
                  onClick={() => setShowTestPanel(false)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    变量填充
                  </h3>
                  <div className="space-y-4">
                    {variables.length > 0 ? (
                      variables.map((variable) => (
                        <div key={variable.name}>
                          <label className="block text-sm text-dark-300 mb-2">
                            {variable.name}
                            {variable.description && (
                              <span className="text-dark-500 ml-2">
                                ({variable.description})
                              </span>
                            )}
                          </label>
                          {variable.type === 'textarea' ? (
                            <textarea
                              value={testInputs[variable.name] || ''}
                              onChange={(e) =>
                                setTestInputs({ ...testInputs, [variable.name]: e.target.value })
                              }
                              rows={4}
                              className="input-field resize-none text-sm"
                              placeholder={`输入${variable.name}`}
                            />
                          ) : variable.type === 'select' ? (
                            <select
                              value={testInputs[variable.name] || ''}
                              onChange={(e) =>
                                setTestInputs({ ...testInputs, [variable.name]: e.target.value })
                              }
                              className="input-field text-sm"
                            >
                              {(variable.options || []).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={variable.type === 'number' ? 'number' : 'text'}
                              value={testInputs[variable.name] || ''}
                              onChange={(e) =>
                                setTestInputs({ ...testInputs, [variable.name]: e.target.value })
                              }
                              className="input-field text-sm"
                              placeholder={`输入${variable.name}`}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-dark-500">此提示词暂无变量</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      运行试跑
                    </>
                  )}
                </button>

                {testOutput && (
                  <div>
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      生成结果
                    </h3>
                    <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-700/50">
                      <pre className="font-mono text-sm text-dark-200 whitespace-pre-wrap">
                        {testOutput}
                      </pre>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
                        <Copy className="w-4 h-4" />
                        复制结果
                      </button>
                      <button className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        保存记录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVersionDiff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-8"
            onClick={() => setShowVersionDiff(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-5xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-dark-700/50 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-white">版本对比</h2>
                <button
                  onClick={() => setShowVersionDiff(false)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-dark-400 mb-2">版本 A</p>
                    <div className="p-4 bg-dark-800/50 rounded-lg border border-rose-500/30">
                      <pre className="font-mono text-xs text-dark-300 whitespace-pre-wrap">
                        {versions.find((v) => v.id === compareVersions[0])?.content || ''}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-dark-400 mb-2">版本 B</p>
                    <div className="p-4 bg-dark-800/50 rounded-lg border border-emerald-500/30">
                      <pre className="font-mono text-xs text-dark-300 whitespace-pre-wrap">
                        {versions.find((v) => v.id === compareVersions[1])?.content || ''}
                      </pre>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-dark-500 mt-4 text-center">
                  * 完整版可集成 diff 库实现逐字差异对比
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
