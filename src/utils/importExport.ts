import type { Space, Prompt } from '../types';

export const exportToJSON = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (prompts: Prompt[], filename: string) => {
  const headers = ['标题', '描述', '分类', '标签', '内容', '状态', '创建人', '创建时间'];
  const rows = prompts.map((p) => [
    p.title,
    p.description,
    p.category,
    p.tags.join('; '),
    p.content.replace(/\n/g, '\\n'),
    p.status,
    p.createdByName,
    p.createdAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (err) {
        reject(new Error('JSON 格式解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

export const importFromCSV = (file: File): Promise<Partial<Prompt>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());
        const headers = parseCSVLine(lines[0]);
        const prompts: Partial<Prompt>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const prompt: Partial<Prompt> = {};

          headers.forEach((header, index) => {
            const value = values[index] || '';
            switch (header) {
              case '标题':
                prompt.title = value;
                break;
              case '描述':
                prompt.description = value;
                break;
              case '分类':
                prompt.category = value;
                break;
              case '标签':
                prompt.tags = value.split(';').map((t) => t.trim()).filter(Boolean);
                break;
              case '内容':
                prompt.content = value.replace(/\\n/g, '\n');
                break;
              case '状态':
                prompt.status = value as any;
                break;
            }
          });

          if (prompt.title) {
            prompts.push(prompt);
          }
        }

        resolve(prompts);
      } catch (err) {
        reject(new Error('CSV 格式解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file, 'UTF-8');
  });
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

export const generateId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
