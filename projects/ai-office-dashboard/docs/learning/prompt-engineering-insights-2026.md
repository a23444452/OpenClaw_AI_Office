# 🎯 Prompt Engineering 設計精華筆記

> 從 Cursor、Claude Code、Devin AI、Windsurf、Manus、Lovable 等頂尖 AI 工具的系統提示詞中萃取的設計模式與最佳實踐。
> 
> 整理日期：2026-02-05
> 資料來源：`docs/learning/system-prompts/system-prompts-and-models-of-ai-tools/`

---

## 📋 目錄

1. [回應風格設計](#1-回應風格設計)
2. [工具使用策略](#2-工具使用策略)
3. [任務管理模式](#3-任務管理模式)
4. [安全與邊界設定](#4-安全與邊界設定)
5. [上下文管理](#5-上下文管理)
6. [錯誤處理與除錯](#6-錯誤處理與除錯)
7. [程式碼撰寫規範](#7-程式碼撰寫規範)
8. [範例驅動設計](#8-範例驅動設計)
9. [進階技巧](#9-進階技巧)

---

## 1. 回應風格設計

### 🎯 極簡主義原則 (Claude Code)

```
IMPORTANT: You should minimize output tokens as much as possible while 
maintaining helpfulness, quality, and accuracy.
```

**核心要點：**
- 簡潔回應通常少於 4 行（不含程式碼）
- 不加不必要的前言/後語（preamble/postamble）
- 不解釋程式碼，除非使用者要求
- 完成任務後簡短確認，不做額外說明

**範例對比：**

| 問題 | ❌ 冗長回應 | ✅ 精簡回應 |
|------|-----------|-----------|
| 2 + 2 | "根據數學運算，2加2等於4" | 4 |
| 11是質數嗎？ | "讓我檢查一下...11只能被1和11整除..." | Yes |
| 列出檔案的指令？ | "你可以使用 ls 指令來列出..." | ls |

### 🎭 語調設定 (Windsurf)

```
You are Cascade, a powerful agentic AI coding assistant...
You are pair programming with a USER to solve their coding task.
```

**設計模式：**
1. **角色定義** — 明確說明 AI 的身份和能力
2. **協作關係** — 定義與使用者的互動模式（如：pair programming）
3. **任務範圍** — 說明可處理的任務類型

### 📝 多語言支援 (Lovable)

```
Always reply in the same language as the user's message.
```

**實作建議：** 在系統提示中明確要求使用相同語言回應。

---

## 2. 工具使用策略

### 🔧 工具選擇層級 (Cursor)

```markdown
### When to Use This Tool

Use `codebase_search` when you need to:
- Explore unfamiliar codebases
- Ask "how / where / what" questions

### When NOT to Use

Skip `codebase_search` for:
1. Exact text matches (use `grep`)
2. Reading known files (use `read_file`)
```

**設計模式：正面+負面指引**
- ✅ 何時使用（When to Use）
- ❌ 何時不使用（When NOT to Use）
- 📝 具體範例說明

### 🚫 工具限制宣告 (Claude Code)

```
- Avoid using Bash with `find`, `grep`, `cat`, `head`, `tail`, `sed`, `awk`
- Instead, always prefer using the dedicated tools:
  - File search: Use Glob (NOT find or ls)
  - Content search: Use Grep (NOT grep or rg)
  - Read files: Use Read (NOT cat/head/tail)
```

**設計原則：**
1. 明確禁止使用通用工具做特定任務
2. 提供專用替代方案
3. 解釋原因（更好的使用者體驗）

### ⚡ 平行執行策略 (Claude Code)

```
When multiple independent pieces of information are requested, 
batch your tool calls together for optimal performance.

When making multiple bash tool calls, you MUST send a single message 
with multiple tools calls to run the calls in parallel.
```

**效率最佳化：**
- 獨立操作應同時執行
- 減少來回次數
- 明確告知使用者「平行執行」的指令格式

---

## 3. 任務管理模式

### 📋 Todo 追蹤系統 (Claude Code)

```
Use TodoWrite tools VERY frequently to ensure that you are tracking 
your tasks and giving the user visibility into your progress.

It is critical that you mark todos as completed as soon as you are 
done with a task. Do not batch up multiple tasks before marking them 
as completed.
```

**實作流程：**
1. 接收任務 → 建立 todo list
2. 大任務 → 拆解成小步驟
3. 開始工作 → 標記 `in_progress`
4. 完成 → 立即標記 `completed`
5. 持續給使用者進度可見性

### 🧠 思考工具 (Devin AI)

```xml
<think>Freely describe and reflect on what you know so far, things 
that you tried, and how that aligns with your objective...</think>
```

**必須使用 `<think>` 的時機：**
1. Git/GitHub 關鍵決策前
2. 從探索轉向實作前
3. 回報完成前（自我檢查）

**建議使用的時機：**
- 沒有明確下一步
- 遇到非預期困難
- 需要做關鍵決策
- 測試/CI 失敗時

### 📊 規劃模式 (Devin AI)

```
You are always either in "planning" or "standard" mode.

While in "planning" mode:
- Gather all information needed
- Search and understand the codebase
- Use browser to find missing information
- If missing crucial context, ask the user

Once confident, call <suggest_plan />
```

**雙模式設計：**
- **Planning 模式**：蒐集資訊、理解需求、建立計畫
- **Standard 模式**：執行計畫、產出結果

---

## 4. 安全與邊界設定

### 🛡️ 安全紅線 (Claude Code)

```
IMPORTANT: Assist with defensive security tasks only. 
Refuse to create, modify, or improve code that may be used maliciously.

Do not assist with:
- Credential discovery or harvesting
- Bulk crawling for SSH keys, browser cookies, cryptocurrency wallets

Allow:
- Security analysis, detection rules
- Vulnerability explanations
- Defensive tools and documentation
```

**設計原則：**
- 明確列出禁止項目
- 明確列出允許項目
- 使用 `IMPORTANT:` 標記強調

### 🔐 資料安全 (Devin AI)

```
Data Security:
- Treat code and customer data as sensitive information
- Never share sensitive data with third parties
- Obtain explicit user permission before external communications
- Never introduce code that exposes or logs secrets
- Never commit secrets or keys to the repository
```

### 🚫 拒絕策略 (Claude Code)

```
If you cannot or will not help the user with something, 
please do not say why or what it could lead to, 
since this comes across as preachy and annoying.

Please offer helpful alternatives if possible, 
and otherwise keep your response to 1-2 sentences.
```

**優雅拒絕：**
- 不要說教式解釋
- 提供替代方案
- 保持簡短（1-2 句）

---

## 5. 上下文管理

### 📚 上下文檢查優先 (Lovable)

```
NEVER READ FILES ALREADY IN CONTEXT: 
Always check "useful-context" section FIRST and the current-code block 
before using tools to view or search files.
```

**效率原則：**
1. 先檢查已有的上下文
2. 避免重複讀取相同檔案
3. 減少不必要的工具呼叫

### 🔍 搜尋策略 (Cursor)

```markdown
### Search Strategy

1. Start with exploratory queries - begin broad with [] if unsure
2. Review results; if a directory stands out, rerun with that as target
3. Break large questions into smaller ones
4. For big files (>1K lines), run scoped search instead of reading entire file
```

**漸進式搜尋：**
```
Step 1: { "query": "How does authentication work?", "target": [] }
Step 2: Results point to backend/auth/ → rerun with specific target
Step 3: { "query": "Where are roles checked?", "target": ["backend/auth/"] }
```

### 🎯 查詢品質 (Cursor)

**好的查詢：**
```
"Where is interface MyInterface implemented in the frontend?"
"Where do we encrypt user passwords before saving?"
```

**壞的查詢：**
```
"MyInterface frontend" — 太模糊
"AuthService" — 單字搜尋應用 grep
"What is X? How does X work?" — 一次問太多問題
```

---

## 6. 錯誤處理與除錯

### 🐛 除錯優先原則 (Lovable)

```
For debugging, ALWAYS use debugging tools FIRST before examining 
or modifying code.
```

### 🔄 測試處理 (Devin AI)

```
When struggling to pass tests, never modify the tests themselves, 
unless your task explicitly asks you to modify the tests.

Always first consider that the root cause might be in the code 
you are testing rather than the test itself.
```

**除錯心法：**
- 先用工具診斷
- 不要輕易改測試
- 根因可能在程式碼而非測試

### 🌐 環境問題處理 (Devin AI)

```
When encountering environment issues:
1. Report them to the user using <report_environment_issue>
2. Find a way to continue work without fixing environment issues
3. Usually by testing using CI rather than local environment
4. Do not try to fix environment issues on your own
```

---

## 7. 程式碼撰寫規範

### ✨ 程式碼品質 (Devin AI)

```markdown
Coding Best Practices:
- Do not add comments unless asked or code is complex
- Mimic existing code style, use existing libraries
- NEVER assume a library is available - check first
- When creating new components, look at existing ones first
- When editing code, look at surrounding context first
```

### 🏗️ 立即可執行 (Windsurf)

```
Your generated code must be immediately runnable:
1. Add all necessary import statements and dependencies
2. If creating from scratch, create dependency file with versions
3. If building web app from scratch, give it beautiful modern UI
4. If making large edit (>300 lines), break into smaller edits
5. NEVER generate extremely long hash or binary content
```

### 📁 檔案操作原則 (Claude Code)

```
NEVER create files unless absolutely necessary.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files.
```

---

## 8. 範例驅動設計

### 📖 XML 範例格式

```xml
<example>
user: What command should I run to list files?
assistant: ls
</example>

<example>
user: Help me write a new feature for tracking metrics
assistant: I'll help you implement this. Let me first use TodoWrite...
[詳細步驟展示]
</example>
```

### 🎯 範例設計原則

1. **簡單到複雜** — 從最簡單的案例開始
2. **正面+負面** — 展示好的和壞的做法
3. **完整流程** — 展示從開始到結束的完整互動
4. **推理過程** — 包含 `<reasoning>` 說明為什麼

---

## 9. 進階技巧

### 🔄 主動性平衡 (Claude Code)

```
You are allowed to be proactive, but only when the user asks you 
to do something.

Strike a balance between:
- Doing the right thing when asked, including follow-up actions
- Not surprising the user with actions you take without asking

If user asks how to approach something, answer their question first, 
don't immediately jump into taking actions.
```

### 🎓 專業客觀性 (Claude Code)

```
Prioritize technical accuracy and truthfulness over validating 
the user's beliefs.

Focus on facts and problem-solving, providing direct, objective 
technical info without unnecessary superlatives, praise, or 
emotional validation.

Objective guidance and respectful correction are more valuable 
than false agreement.
```

### 🔗 程式碼引用格式 (Claude Code)

```
When referencing specific functions include the pattern:
file_path:line_number

Example:
user: Where are errors handled?
assistant: Clients are marked as failed in `connectToServer` 
in src/services/process.ts:712
```

### 📱 使用者資訊注入 (Windsurf)

```xml
<user_information>
The USER's OS version is windows.
The USER has 1 active workspace...
</user_information>
```

**動態上下文：** 在系統提示中注入使用者環境資訊。

---

## 🎓 設計模式總結

### 1. 結構化指令

```
## Section Title
Description of the section

### Subsection
- Point 1
- Point 2

IMPORTANT: Critical instruction here
```

### 2. 層級關鍵字

| 關鍵字 | 用途 |
|--------|------|
| `IMPORTANT:` | 最高優先級指令 |
| `NEVER` | 絕對禁止 |
| `ALWAYS` | 必須執行 |
| `MUST` | 強制要求 |
| `should` | 建議但非強制 |

### 3. XML 標籤用途

| 標籤 | 用途 |
|------|------|
| `<example>` | 展示互動範例 |
| `<thinking>` | 思考過程 |
| `<reasoning>` | 推理說明 |
| `<user_information>` | 使用者上下文 |
| `<system-reminder>` | 系統提醒 |

### 4. 工具文件格式

```typescript
// Tool description
// 
// ### When to Use This Tool
// Use when you need to:
// - Scenario 1
// - Scenario 2
//
// ### When NOT to Use
// Skip for:
// - Anti-pattern 1
// - Anti-pattern 2
//
// ### Examples
// <example>...</example>

type tool_name = (_: {
  // Parameter description (required/optional)
  param1: string,
  param2?: number,
}) => any;
```

---

## 📚 延伸閱讀

- **原始資料位置：** `docs/learning/system-prompts/system-prompts-and-models-of-ai-tools/`
- **推薦深讀：**
  - `Anthropic/Claude Code 2.0.txt` — 最完整的回應風格指南
  - `Cursor Prompts/Agent Prompt 2.0.txt` — 工具設計典範
  - `Devin AI/Prompt.txt` — 任務規劃模式
  - `Windsurf/Prompt Wave 11.txt` — 程式碼生成規範

---

## 💡 實戰應用建議

### 為自己的 AI 助理設計 Prompt 時：

1. **明確角色定義** — 你是誰？能做什麼？
2. **設定回應風格** — 簡潔 vs 詳細？正式 vs 輕鬆？
3. **定義工具使用** — 何時用、何時不用
4. **建立安全邊界** — 明確禁止項目
5. **使用範例說明** — 展示期望的互動模式
6. **預設錯誤處理** — 遇到問題時的行為

### Prompt 測試清單：

- [ ] 角色清楚嗎？
- [ ] 有沒有自相矛盾的指令？
- [ ] 邊界案例有處理嗎？
- [ ] 範例夠清楚嗎？
- [ ] 安全限制完整嗎？

---

*Made with ✨ by Lucy | 2026-02-05*
