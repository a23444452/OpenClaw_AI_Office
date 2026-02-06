# Obsidian 進階工作流設定指南（2026 年版）

> 目標讀者：想用 Obsidian 建立個人知識庫的工程師
> 風格：實用導向、有具體設定步驟、可直接套用

---

## 目錄

1. [筆記結構設計](#1-筆記結構設計)
2. [必裝插件推薦](#2-必裝插件推薦2026-年版)
3. [與 Lucy Workspace 整合方案](#3-與-lucy-workspace-整合方案)
4. [工作流範例模板](#4-工作流範例模板)
5. [快速開始 Checklist](#5-快速開始-checklist)

---

## 1. 筆記結構設計

### 1.1 PARA 方法（Projects, Areas, Resources, Archives）

PARA 是 Tiago Forte 提出的筆記組織系統，核心理念是**按可行動性（Actionability）而非類別**來組織筆記。

#### 四大分類

| 類別 | 定義 | 範例 |
|------|------|------|
| **Projects** | 有明確截止日的主動專案 | `開發新功能 v2.0`、`Q1 投資組合調整` |
| **Areas** | 持續關注的責任領域 | `健康`、`財務`、`職涯發展` |
| **Resources** | 未來可能用到的參考資料 | `Python 最佳實踐`、`投資策略筆記` |
| **Archives** | 已完成或不再活躍的內容 | 舊專案、過期資料 |

#### Obsidian 實作建議

```
📁 00-Inbox/           # 快速捕捉，稍後整理
📁 01-Projects/        # 活躍專案
📁 02-Areas/           # 持續關注領域
📁 03-Resources/       # 參考資料庫
📁 04-Archives/        # 歸檔區
📁 Templates/          # 模板資料夾
```

**重點設定：**
- 使用數字前綴（01, 02...）確保資料夾排序
- 設定 `Inbox` 為預設新筆記位置
- 定期（每週）Review Inbox，分類到正確位置

---

### 1.2 Zettelkasten 卡片盒筆記法

Zettelkasten 強調**原子化筆記**和**雙向連結**，適合建立可生長的知識網絡。

#### 核心原則

1. **原子性（Atomicity）**：一則筆記只講一個概念
2. **連結性（Connectivity）**：透過 `[[連結]]` 建立知識網絡
3. **自己的話（Own Words）**：用自己理解的方式重寫，不是複製貼上

#### 實作技巧

```markdown
# 永久筆記範例

## 複利效應在學習中的應用

每天學習的知識會累積，並與既有知識產生連結，形成指數成長。

相關連結：
- [[學習的邊際效益遞增]]
- [[知識複利 vs 金錢複利]]
- [[刻意練習的時間分配]]

來源：[[2026-01-15 讀書筆記 - 原子習慣]]
```

**與 PARA 整合：**
- PARA 管理「位置」（哪個資料夾）
- Zettelkasten 管理「連結」（筆記間關係）
- 兩者可以共存，不衝突

---

### 1.3 MOC（Map of Content）索引頁設計

MOC 是「內容地圖」，作為特定主題的導航中心。

#### MOC 結構範例

```markdown
# 🗺️ 投資研究 MOC

> 這是我的投資知識索引頁，匯集所有投資相關筆記。

## 📚 核心概念
- [[價值投資基礎]]
- [[技術分析入門]]
- [[資產配置策略]]

## 📈 個股研究
- [[台積電分析]]
- [[NVIDIA 產業地位]]

## 📊 動態索引（Dataview）

### 最近更新的投資筆記
```dataview
TABLE file.mtime as "更新時間"
FROM #投資 
SORT file.mtime DESC
LIMIT 10
```

### 待研究清單
```dataview
TASK
FROM #投資 
WHERE !completed
```
```

#### MOC 層級設計

```
🏠 Home（首頁 MOC）
├── 🗺️ 技術筆記 MOC
│   ├── [[Python MOC]]
│   ├── [[DevOps MOC]]
│   └── [[AI/ML MOC]]
├── 🗺️ 投資研究 MOC
│   ├── [[美股 MOC]]
│   └── [[台股 MOC]]
└── 🗺️ 個人知識庫 MOC
    ├── [[生產力 MOC]]
    └── [[健康 MOC]]
```

---

### 1.4 混合結構建議（技術筆記 + 投資研究 + 個人知識庫）

針對工程師的綜合需求，推薦以下結構：

```
📁 Vault/
├── 📁 00-Inbox/                    # 快速捕捉
├── 📁 01-Projects/                 # 活躍專案
│   ├── 📁 Work/                    # 工作專案
│   └── 📁 Side/                    # Side Projects
├── 📁 02-Areas/                    # 責任領域
│   ├── 📁 Career/                  # 職涯發展
│   ├── 📁 Finance/                 # 財務投資
│   └── 📁 Health/                  # 健康
├── 📁 03-Resources/                # 知識庫
│   ├── 📁 Tech/                    # 技術筆記
│   │   ├── 📁 Programming/
│   │   ├── 📁 DevOps/
│   │   └── 📁 AI-ML/
│   ├── 📁 Investment/              # 投資研究
│   │   ├── 📁 Stocks/
│   │   ├── 📁 Strategies/
│   │   └── 📁 Analysis/
│   └── 📁 Learning/                # 學習筆記
├── 📁 04-Archives/                 # 歸檔
├── 📁 05-Daily/                    # 每日筆記
├── 📁 06-Templates/                # 模板
└── 📁 07-MOCs/                     # 索引頁
```

**命名慣例：**
- 資料夾：`PascalCase` 或 `kebab-case`
- 筆記：`描述性名稱` 或 `YYYY-MM-DD 主題`
- 標籤：`#領域/子領域`（如 `#tech/python`、`#投資/台股`）

---

## 2. 必裝插件推薦（2026 年版）

### 2.1 核心生產力插件

#### Templater ⭐⭐⭐⭐⭐
> 動態模板引擎，支援 JavaScript

**用途：**
- 建立動態模板，自動填入日期、檔名等
- 執行 JavaScript 腳本
- 根據資料夾自動套用模板

**設定重點：**
```
Settings > Templater
├── Template folder location: 06-Templates
├── Trigger Templater on new file creation: ✅
└── Folder Templates: 
    ├── 05-Daily → Daily Note Template
    └── 01-Projects → Project Template
```

**推薦程度：必裝**

---

#### Dataview ⭐⭐⭐⭐⭐
> 將 Vault 當作資料庫查詢

**用途：**
- 動態列出符合條件的筆記
- 建立任務儀表板
- 自動生成索引

**常用查詢範例：**
```dataview
// 列出所有專案筆記
TABLE status, deadline
FROM "01-Projects"
WHERE status != "done"
SORT deadline ASC

// 列出本週建立的筆記
LIST
FROM ""
WHERE file.cday >= date(today) - dur(7 days)
SORT file.cday DESC
```

**設定重點：**
```
Settings > Dataview
├── Enable JavaScript Queries: ✅
├── Enable Inline Queries: ✅
└── Automatic View Refresh: ✅
```

**推薦程度：必裝**

---

#### Tasks ⭐⭐⭐⭐⭐
> 進階任務管理

**用途：**
- 跨筆記管理任務
- 設定到期日、重複任務
- 任務查詢和篩選

**語法範例：**
```markdown
- [ ] 完成報告 📅 2026-01-20 ⏫
- [ ] 每週回顧 🔁 every week 📅 2026-01-21
- [x] 已完成任務 ✅ 2026-01-15
```

**任務查詢範例：**
````markdown
```tasks
not done
due before tomorrow
sort by priority
```
````

**推薦程度：必裝**

---

#### Calendar ⭐⭐⭐⭐
> 日曆視圖，快速建立/導航每日筆記

**用途：**
- 視覺化瀏覽每日筆記
- 點擊日期快速建立筆記
- 顯示每日任務數量

**設定重點：**
```
Settings > Calendar
├── Words per dot: 250 (每 250 字顯示一個點)
└── Confirm before creating new note: ✅
```

**推薦程度：強烈推薦**

---

### 2.2 寫作增強插件

#### Excalidraw ⭐⭐⭐⭐⭐
> 內建手繪風格白板

**用途：**
- 繪製流程圖、架構圖
- 視覺化筆記
- 嵌入到 Markdown 筆記中

**2024-2025 新功能：**
- Ctrl/Cmd + 方向鍵快速建立流程圖
- PDF 頁面匯入和標註
- OCR 文字辨識整合

**設定重點：**
```
Settings > Excalidraw
├── Excalidraw folder: 99-Excalidraw
├── New drawing default location: Active pane
└── Embed type: PNG or SVG
```

**推薦程度：必裝（視覺化思考者）**

---

#### Advanced Tables ⭐⭐⭐⭐
> Markdown 表格增強

**用途：**
- Tab 鍵在欄位間移動
- 自動對齊表格
- 快速新增列/欄

**快捷鍵：**
- `Tab`：移到下一欄
- `Enter`：新增一列
- `Ctrl+Shift+D`：開啟表格控制面板

**推薦程度：強烈推薦**

---

#### Outliner ⭐⭐⭐⭐
> 大綱模式增強

**用途：**
- 拖拽重排項目
- 摺疊/展開項目
- Zoom in 到特定項目

**快捷鍵：**
- `Ctrl+Shift+↑/↓`：移動項目
- `Ctrl+.`：摺疊/展開

**推薦程度：推薦**

---

### 2.3 知識連結插件

#### Graph Analysis ⭐⭐⭐⭐
> 進階圖譜分析

**用途：**
- 社群偵測（找出知識叢集）
- 連結預測（建議可能的連結）
- 共引分析（找出相關筆記）

**設定重點：**
- 啟用後在左側面板出現 Graph Analysis 按鈕
- 可篩選特定資料夾或標籤

**推薦程度：推薦（知識庫達一定規模後）**

---

#### Strange New Worlds ⭐⭐⭐
> 探索未連結但相關的筆記

**用途：**
- 顯示可能相關但未連結的筆記
- 發現知識庫中的「孤島」

**推薦程度：可選（適合大型知識庫）**

---

#### Breadcrumbs ⭐⭐⭐⭐
> 層級導航麵包屑

**用途：**
- 定義筆記間的父子關係
- 顯示導航路徑
- 建立知識樹狀結構

**Frontmatter 設定：**
```yaml
---
up: "[[父筆記]]"
down: "[[子筆記1]], [[子筆記2]]"
---
```

**推薦程度：推薦（需要嚴格層級結構時）**

---

### 2.4 同步備份插件

#### Obsidian Git ⭐⭐⭐⭐⭐
> Git 版本控制整合

**用途：**
- 自動 commit 和 push
- 版本歷史追蹤
- 多設備同步（免費方案）

**設定步驟：**

1. **初始化 Git**
```bash
cd /path/to/vault
git init
git remote add origin https://github.com/username/obsidian-vault.git
```

2. **設定插件**
```
Settings > Obsidian Git
├── Auto commit-and-sync: 5 minutes
├── Auto pull on startup: ✅
├── Commit message: vault backup: {{date}}
└── Pull changes before push: ✅
```

3. **建立 .gitignore**
```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
.DS_Store
```

**推薦程度：必裝（開發者首選）**

---

#### Remotely Save ⭐⭐⭐⭐
> 雲端同步（支援多種後端）

**支援服務：**
- S3 / Cloudflare R2 / Backblaze B2
- WebDAV（NextCloud, Synology）
- Dropbox, OneDrive, Google Drive

**用途：**
- 不想用 Git 的同步方案
- 跨平台（包含手機）同步
- 端對端加密

**設定重點：**
```
Settings > Remotely Save
├── Service: [選擇你的服務]
├── Sync interval: 5 minutes
├── Enable sync on save: ✅
└── Password (encryption): [設定加密密碼]
```

**注意事項：**
- 初次設定前務必備份 Vault
- 大型 Vault 首次同步可能較慢
- 手機端建議使用 Incremental Pull

**推薦程度：強烈推薦（非開發者）**

---

### 2.5 其他實用插件

#### QuickAdd ⭐⭐⭐⭐⭐
> 快速新增內容的瑞士刀

**用途：**
- 快速建立新筆記（用模板）
- 快速捕捉想法到特定筆記
- 建立自動化工作流（Macro）

**設定範例：**
```
QuickAdd Choices:
├── 📝 New Daily Note (Template)
├── 💡 Quick Idea (Capture → Inbox.md)
├── 📚 New Book Note (Template + Prompt)
└── 🔧 Tech TIL (Macro: Template + Move to folder)
```

**推薦程度：必裝**

---

#### Kanban ⭐⭐⭐⭐
> 看板視圖管理

**用途：**
- 視覺化專案進度
- 拖拽管理任務狀態
- 整合 Markdown 連結

**範例：**
```markdown
---
kanban-plugin: basic
---

## Backlog
- [ ] 研究新功能

## In Progress
- [ ] 撰寫技術文件

## Done
- [x] 部署 v1.0
```

**推薦程度：強烈推薦（專案管理用）**

---

#### Periodic Notes ⭐⭐⭐⭐
> 週期性筆記（日/週/月/季/年）

**用途：**
- 建立週報、月報模板
- 自動連結相鄰週期筆記
- 整合 Calendar 插件

**設定範例：**
```
Settings > Periodic Notes
├── Daily Notes
│   ├── Folder: 05-Daily/Daily
│   ├── Format: YYYY-MM-DD
│   └── Template: Templates/Daily Note
├── Weekly Notes
│   ├── Folder: 05-Daily/Weekly
│   ├── Format: YYYY-[W]WW
│   └── Template: Templates/Weekly Review
└── Monthly Notes
    ├── Folder: 05-Daily/Monthly
    └── Format: YYYY-MM
```

**推薦程度：強烈推薦**

---

### 插件安裝優先順序

```
階段 1（第一天）：
✅ Templater
✅ Dataview
✅ Tasks
✅ QuickAdd
✅ Calendar

階段 2（一週後）：
✅ Obsidian Git 或 Remotely Save
✅ Periodic Notes
✅ Advanced Tables

階段 3（一個月後）：
✅ Excalidraw
✅ Kanban
✅ Outliner
✅ Graph Analysis
```

---

## 3. 與 Lucy Workspace 整合方案

### 3.1 目前 Workspace 結構分析

```
workspace/
├── docs/                    # 技術文件、投資分析、學習筆記
│   ├── investment/
│   ├── analysis/
│   ├── learning/
│   └── ...
├── memory/                  # Lucy 每日記憶
│   ├── YYYY-MM-DD.md
│   ├── topics/
│   └── archive/
├── MEMORY.md               # Lucy 長期記憶
├── TASKS.md                # 任務清單
├── USER.md                 # 使用者資訊
├── AGENTS.md               # 代理設定
└── ...
```

### 3.2 整合方案選擇

#### 方案 A：Obsidian Vault 直接指向 Workspace（推薦）

**優點：**
- 單一資料來源，無同步問題
- Lucy 和 Obsidian 使用相同檔案
- 減少重複維護

**缺點：**
- 需要處理 `.obsidian` 資料夾
- 部分 Lucy 系統檔案可能干擾

**設定步驟：**

1. **開啟 Obsidian，選擇「Open folder as vault」**
   - 選擇 `~/.openclaw/workspace`

2. **建立 Obsidian 專屬設定**
   ```bash
   # .gitignore 新增
   .obsidian/
   .trash/
   ```

3. **調整資料夾可見性**
   在 Obsidian Settings > Files & Links：
   - Excluded files: `memory/archive/*`, `.git/*`

4. **建立 Home MOC**
   ```markdown
   # 🏠 Home
   
   ## 📚 文件區
   - [[docs/learning/Learning MOC|學習筆記]]
   - [[docs/investment/Investment MOC|投資研究]]
   
   ## 🧠 Lucy 系統
   - [[MEMORY|長期記憶]]
   - [[TASKS|任務清單]]
   
   ## 📅 每日記憶
   - [[memory/{{date:YYYY-MM-DD}}|今日記憶]]
   ```

---

#### 方案 B：分開管理，選擇性同步

**優點：**
- Obsidian Vault 保持乾淨
- 可以有不同的組織結構
- 降低誤操作風險

**缺點：**
- 需要同步機制
- 可能產生版本衝突

**設定方式：**

1. **建立獨立 Vault**
   ```
   ~/Obsidian/
   ├── PKM/                    # 主要知識庫
   └── Lucy-Sync/              # 同步區
   ```

2. **設定 symlink 連結**
   ```bash
   cd ~/Obsidian/PKM
   ln -s ~/.openclaw/workspace/docs ./Lucy-Docs
   ln -s ~/.openclaw/workspace/memory ./Lucy-Memory
   ```

3. **使用 Obsidian 的 Symbolic Link 支援**
   - 這樣可以在 Obsidian 中直接編輯 workspace 檔案

---

### 3.3 推薦整合架構（方案 A 詳細版）

```
~/.openclaw/workspace/          # = Obsidian Vault
├── .obsidian/                  # Obsidian 設定（gitignore）
├── 00-Inbox/                   # 新增：快速捕捉區
├── docs/                       # 現有：技術文件
│   ├── investment/
│   ├── analysis/
│   ├── learning/
│   └── MOCs/                   # 新增：索引頁
├── memory/                     # 現有：Lucy 記憶
│   ├── YYYY-MM-DD.md
│   └── topics/
├── Templates/                  # 新增：Obsidian 模板
├── Excalidraw/                 # 新增：繪圖
├── MEMORY.md
├── TASKS.md
├── USER.md
├── AGENTS.md
├── Home.md                     # 新增：Obsidian 首頁
└── .gitignore
```

### 3.4 Git 同步策略

#### .gitignore 建議

```gitignore
# Obsidian
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/plugins/recent-files-obsidian/data.json
.trash/

# System
.DS_Store
Thumbs.db

# 可選：排除大型附件
*.pdf
*.mp4

# 但保留設定
!.obsidian/app.json
!.obsidian/appearance.json
!.obsidian/core-plugins.json
!.obsidian/community-plugins.json
```

#### 同步工作流

```bash
# 日常同步（自動）
# Obsidian Git 插件設定：每 5 分鐘自動 commit-and-sync

# 手動同步（衝突時）
cd ~/.openclaw/workspace
git stash                    # 暫存本地變更
git pull --rebase            # 拉取遠端
git stash pop                # 恢復本地變更
# 解決衝突後
git add .
git commit -m "resolve conflict"
git push
```

### 3.5 避免衝突的最佳實踐

#### 1. 檔案分工

| 編輯者 | 主要負責檔案 |
|--------|--------------|
| Lucy | `memory/*.md`, `MEMORY.md`, `TASKS.md` |
| 你（Obsidian） | `docs/**/*`, `Templates/*`, MOCs |
| 共同 | `docs/` 下的特定檔案 |

#### 2. 同步時機

- **工作前**：先 Pull 最新版本
- **工作後**：及時 Commit + Push
- **離開電腦前**：確保已 Push

#### 3. 衝突預防

```yaml
# 在 Lucy 的 AGENTS.md 新增提醒
# （如果 Lucy 支援）

同步注意事項：
- 避免同時編輯同一檔案
- 大量變更前先 commit
- 發現衝突先問使用者
```

#### 4. Obsidian Git 設定

```
Settings > Obsidian Git
├── Commit message: {{hostname}} - {{date}}
├── Pull changes before push: ✅
├── Disable notifications: ❌ (keep enabled for awareness)
└── Show status bar: ✅
```

---

## 4. 工作流範例模板

### 4.1 每日筆記模板

```markdown
---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags: [daily]
---

# <% tp.date.now("YYYY-MM-DD dddd") %>

<< [[<% tp.date.now("YYYY-MM-DD", -1) %>|昨天]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>|明天]] >>

## 🎯 今日重點（3 件事）

- [ ] 
- [ ] 
- [ ] 

## 📋 任務

### 待辦
- [ ] 

### 完成
- [x] 

## 📝 筆記

### 學到什麼


### 發生什麼


## 🌙 每日回顧

### 今日亮點


### 明日計畫


---

## 📊 今日連結

```dataview
LIST
FROM [[]]
WHERE file.cday = date("<% tp.date.now("YYYY-MM-DD") %>")
```
```

---

### 4.2 會議記錄模板

```markdown
---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
type: meeting
tags: [meeting]
attendees: 
project: 
---

# 會議：<% tp.file.title %>

**日期**：<% tp.date.now("YYYY-MM-DD") %>
**時間**：
**地點**：
**出席**：

---

## 📋 議程

1. 
2. 
3. 

## 📝 討論內容

### 議題 1

- 

### 議題 2

- 

## ✅ 行動項目

| 項目 | 負責人 | 截止日 | 狀態 |
|------|--------|--------|------|
|      |        |        | ⏳   |
|      |        |        | ⏳   |

## 📌 決議事項

- 

## 🔗 相關連結

- [[相關專案]]
- [[上次會議]]

---

**下次會議**：
```

---

### 4.3 技術學習筆記模板

```markdown
---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
type: tech-note
tags: [tech, learning]
topic: 
source: 
status: draft
---

# <% tp.file.title %>

## 📌 概述

> 一句話說明這是什麼

## 🎯 為什麼學這個？

- 

## 📚 核心概念

### 概念 1

**定義**：

**範例**：
```code
// 程式碼範例
```

### 概念 2

## 💻 實作筆記

### 環境設定

```bash
# 安裝指令
```

### 基本用法

```code
// 範例程式碼
```

### 進階用法

## ⚠️ 常見問題

### 問題 1

**症狀**：
**解法**：

## 🔗 參考資源

- [官方文件]()
- [教學文章]()

## 📝 心得與想法

- 

---

**相關筆記**：
- [[]]
```

---

### 4.4 投資研究模板

```markdown
---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
type: investment-research
tags: [投資]
ticker: 
market: 
sector: 
status: research
last_updated: <% tp.date.now("YYYY-MM-DD") %>
---

# 投資研究：<% tp.file.title %>

## 📊 基本資料

| 項目 | 資料 |
|------|------|
| 股票代碼 | |
| 公司名稱 | |
| 產業 | |
| 市值 | |
| 本益比 (P/E) | |
| 股價淨值比 (P/B) | |
| 殖利率 | |

## 🏢 公司概述

### 業務描述

- 

### 競爭優勢（護城河）

- 

### 產業地位

- 

## 📈 財務分析

### 營收成長

| 年度 | 營收 | YoY |
|------|------|-----|
| 2025 |      |     |
| 2024 |      |     |
| 2023 |      |     |

### 獲利能力

- 毛利率：
- 營業利益率：
- 淨利率：
- ROE：

### 財務健康

- 負債比：
- 流動比率：
- 現金流：

## 🔍 風險評估

### 潛在風險

1. 
2. 
3. 

### 風險等級

- [ ] 低風險
- [ ] 中風險
- [ ] 高風險

## 💡 投資論點

### 看多理由

1. 
2. 

### 看空理由

1. 
2. 

## 📐 估值分析

### 目標價推估

- 保守：
- 中性：
- 樂觀：

### 買入價位

- 理想買點：
- 可接受買點：

## 📌 結論與行動

### 投資建議

- [ ] 買入
- [ ] 觀望
- [ ] 賣出

### 追蹤事項

- [ ] 

---

## 📅 更新紀錄

| 日期 | 更新內容 |
|------|----------|
| <% tp.date.now("YYYY-MM-DD") %> | 初次建立 |

## 🔗 相關連結

- [[產業 MOC]]
- [[投資組合]]
```

---

## 5. 快速開始 Checklist

### Day 1：基礎設定

- [ ] 安裝 Obsidian
- [ ] 選擇 Vault 位置（指向 workspace 或新建）
- [ ] 安裝核心插件
  - [ ] Templater
  - [ ] Dataview
  - [ ] Tasks
  - [ ] QuickAdd
  - [ ] Calendar
- [ ] 建立基本資料夾結構
- [ ] 建立 Home.md 首頁

### Week 1：建立習慣

- [ ] 設定 Daily Note 模板
- [ ] 設定 Templater 自動套用
- [ ] 建立 3 個常用模板
- [ ] 每天寫一則 Daily Note
- [ ] 設定 Obsidian Git 或同步方案

### Month 1：擴展功能

- [ ] 建立 MOC 索引頁（至少 3 個）
- [ ] 設定 Dataview 動態列表
- [ ] 安裝進階插件（Kanban, Excalidraw 等）
- [ ] 累積 50+ 筆記
- [ ] 調整優化工作流

### 持續維護

- [ ] 每週 Review Inbox
- [ ] 每月整理 Archives
- [ ] 定期更新 MOC
- [ ] 探索新插件

---

## 附錄

### A. 常用快捷鍵

| 動作 | Mac | Windows |
|------|-----|---------|
| 快速切換器 | `Cmd+O` | `Ctrl+O` |
| 命令面板 | `Cmd+P` | `Ctrl+P` |
| 新建筆記 | `Cmd+N` | `Ctrl+N` |
| 搜尋 | `Cmd+Shift+F` | `Ctrl+Shift+F` |
| 開啟圖譜 | `Cmd+G` | `Ctrl+G` |
| 分割面板 | `Cmd+\` | `Ctrl+\` |

### B. 推薦學習資源

1. **官方文檔**：https://help.obsidian.md
2. **Obsidian Hub**：https://publish.obsidian.md/hub
3. **Reddit**：r/ObsidianMD
4. **YouTube 頻道**：
   - Linking Your Thinking
   - Nicole van der Hoeven
   - Danny Hatcher

### C. 版本紀錄

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| 1.0 | 2026-01 | 初版建立 |

---

> 💡 **記住**：工具是為了服務思考，不是為了折騰設定。先用起來，再慢慢優化。
