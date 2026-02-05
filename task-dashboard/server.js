const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const TASKS_FILE = path.join(__dirname, '..', 'TASKS.md');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

// Parse TASKS.md to JSON
function parseTasksMd(content) {
  const tasks = {
    urgent: [],
    important: [],
    normal: [],
    longterm: [],
    completed: [],
    learning: [],
    learningQueue: []
  };

  const lines = content.split('\n');
  let currentSection = null;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect sections
    if (line.includes('### 🔴 緊急任務')) currentSection = 'urgent';
    else if (line.includes('### 🟡 重要任務')) currentSection = 'important';
    else if (line.includes('### 🟢 一般任務')) currentSection = 'normal';
    else if (line.includes('### 🔵 長期')) currentSection = 'longterm';
    else if (line.includes('## ✅ 已完成任務')) currentSection = 'completed';
    else if (line.includes('### 🎓 學習中')) currentSection = 'learning';
    else if (line.includes('### 📋 待學習清單')) currentSection = 'learningQueue';
    else if (line.startsWith('## ') || line.startsWith('### ✅ 已完成學習')) currentSection = null;

    // Parse table rows
    if (line.startsWith('|') && !line.includes('---') && !line.includes('任務') && !line.includes('主題') && !line.includes('狀態')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c && c !== '-');
      
      if (cells.length >= 2 && cells[0] !== '-' && currentSection) {
        const task = {
          name: cells[0],
          status: cells[1] || '',
          date: cells[2] || '',
          deadline: cells[3] || '',
          note: cells[cells.length - 1] || ''
        };
        
        if (currentSection && tasks[currentSection]) {
          tasks[currentSection].push(task);
        }
      }
    }
  }

  return tasks;
}

// Generate TASKS.md from JSON
function generateTasksMd(tasks) {
  const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  
  let md = `# 📋 Lucy 任務管理系統

> 最後更新：${now}

---

## 🎯 如何使用

**指派任務給 Lucy：**
- 直接跟我說，我會加到這裡
- 或自己編輯這個檔案
- 或使用網頁介面：http://localhost:3456

**任務狀態：**
- ⬜ 待辦（Pending）
- 🔄 進行中（In Progress）
- ✅ 已完成（Done）
- ⏸️ 暫停（On Hold）

**優先級：**
- 🔴 緊急（今天要完成）
- 🟡 重要（本週內）
- 🟢 一般（有空再做）
- 🔵 長期（持續進行）

---

## 📌 當前任務

### 🔴 緊急任務
| 任務 | 狀態 | 指派日期 | 截止日期 | 備註 |
|------|------|----------|----------|------|
${tasks.urgent.length ? tasks.urgent.map(t => `| ${t.name} | ${t.status} | ${t.date} | ${t.deadline} | ${t.note} |`).join('\n') : '| - | - | - | - | - |'}

### 🟡 重要任務
| 任務 | 狀態 | 指派日期 | 截止日期 | 備註 |
|------|------|----------|----------|------|
${tasks.important.length ? tasks.important.map(t => `| ${t.name} | ${t.status} | ${t.date} | ${t.deadline} | ${t.note} |`).join('\n') : '| - | - | - | - | - |'}

### 🟢 一般任務
| 任務 | 狀態 | 指派日期 | 截止日期 | 備註 |
|------|------|----------|----------|------|
${tasks.normal.length ? tasks.normal.map(t => `| ${t.name} | ${t.status} | ${t.date} | ${t.deadline} | ${t.note} |`).join('\n') : '| - | - | - | - | - |'}

### 🔵 長期 / 持續任務
| 任務 | 狀態 | 開始日期 | 備註 |
|------|------|----------|------|
${tasks.longterm.length ? tasks.longterm.map(t => `| ${t.name} | ${t.status} | ${t.date} | ${t.note} |`).join('\n') : '| - | - | - | - |'}

---

## ✅ 已完成任務

| 任務 | 完成日期 | 成果 |
|------|----------|------|
${tasks.completed.length ? tasks.completed.map(t => `| ${t.name} | ${t.status} | ${t.date} |`).join('\n') : '| - | - | - |'}

---

## 📚 Lucy 學習計畫

### 🎓 學習中
| 主題 | 狀態 | 開始日期 | 進度 | 預計產出 |
|------|------|----------|------|----------|
${tasks.learning.length ? tasks.learning.map(t => `| ${t.name} | ${t.status} | ${t.date} | ${t.deadline} | ${t.note} |`).join('\n') : '| - | - | - | - | - |'}

### 📋 待學習清單
| 主題 | 優先級 | 預計開始 | 關聯目標 |
|------|--------|----------|----------|
${tasks.learningQueue.length ? tasks.learningQueue.map(t => `| ${t.name} | ${t.status} | ${t.date} | ${t.deadline} |`).join('\n') : '| - | - | - | - |'}

---

*此文件由 Lucy 維護，Vince 可隨時編輯或透過網頁介面管理*
`;

  return md;
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoints
  if (req.url === '/api/tasks' && req.method === 'GET') {
    try {
      const content = fs.readFileSync(TASKS_FILE, 'utf-8');
      const tasks = parseTasksMd(content);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tasks));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.url === '/api/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const tasks = JSON.parse(body);
        const md = generateTasksMd(tasks);
        fs.writeFileSync(TASKS_FILE, md);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Lucy 任務管理系統已啟動！`);
  console.log(`📋 請開啟瀏覽器訪問: http://localhost:${PORT}`);
  console.log(`\n按 Ctrl+C 停止伺服器`);
});
