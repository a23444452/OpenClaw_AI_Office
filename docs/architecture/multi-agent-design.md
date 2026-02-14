# Multi-Agent 架構設計

## 概覽

將現有的單一 agent 架構改為 multi-agent，每個 agent 專注特定領域。

## Agent 規劃

| Agent ID | 名稱 | 角色 | Model | 職責 |
|----------|------|------|-------|------|
| `lucy` | Lucy | 主協調者 | Opus | 日常對話、Dashboard 更新、任務委派 |
| `xiaocai` | 小財 | 股市分析師 | Sonnet | 美股/台股報告、盯盤、模擬投資 |
| `yanyan` | 研研 | 夜間研究員 | Sonnet | 夜間探索、Nightly Build、技術研究 |
| `axin` | 阿新 | 資訊編輯 | Sonnet | AI 新聞、GitHub 熱門專案 |

### 暫不獨立的角色
- **螃蟹** (Moltbook) - 任務量少，暫由 Lucy 處理
- **小管** (帳單) - 任務量少，暫由 Lucy 處理

## 架構設計

```
                    ┌─────────────────┐
                    │     lucy        │
                    │  (主協調者)      │
                    │  Opus / Main    │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │   xiaocai   │   │   yanyan    │   │    axin     │
    │  股市分析師  │   │  夜間研究員  │   │  資訊編輯   │
    │   Sonnet    │   │   Sonnet    │   │   Sonnet    │
    └─────────────┘   └─────────────┘   └─────────────┘
```

## Workspace 規劃

所有 agents 共享主 workspace（記憶、文件），但有獨立的 agent 配置：

```
/Users/vincewang/.openclaw/workspace/
├── MEMORY.md           # 共享記憶
├── memory/             # 共享每日記憶
├── docs/               # 共享文件
├── agents/             # Agent 專屬配置
│   ├── lucy/
│   │   └── SOUL.md     # Lucy 的人格
│   ├── xiaocai/
│   │   └── SOUL.md     # 小財的人格
│   ├── yanyan/
│   │   └── SOUL.md     # 研研的人格
│   └── axin/
│       └── SOUL.md     # 阿新的人格
└── projects/           # 共享專案
```

## Cron Jobs 分配

| Cron Job | 原本 | 新 Agent |
|----------|------|----------|
| 美股晨報 | main | xiaocai |
| 台股開盤報告 | main | xiaocai |
| 台股收盤報告 | main | xiaocai |
| 台股盤後摘要 | main | xiaocai |
| 記憶體股盯盤 | main | xiaocai |
| 週末股市回顧 | main | xiaocai |
| 美股模擬投資 | main | xiaocai |
| AI 新聞日報 | main | axin |
| GitHub 熱門專案 | main | axin |
| 夜間自主探索 | main | yanyan |
| Nightly Build | main | yanyan |
| Dashboard 更新 | main | lucy |
| Moltbook 社群 | main | lucy |
| 信用卡帳單 | main | lucy |
| 週報生成 | main | lucy |

## 實作步驟

1. [x] 設計架構文件
2. [x] 創建 agents/ 目錄和各 agent 的 SOUL.md
3. [x] 配置 agents.list (lucy, xiaocai, yanyan, axin)
4. [x] 更新 cron jobs 的 agentId
5. [x] 更新 Dashboard 統計邏輯（根據 agentId 分類）
6. [ ] 測試並驗證

## 已完成配置

### agents.list
```json
[
  { "id": "lucy", "default": true, "model": "anthropic/claude-opus-4-5" },
  { "id": "xiaocai", "model": "anthropic/claude-sonnet-4-20250514" },
  { "id": "yanyan", "model": "anthropic/claude-sonnet-4-20250514" },
  { "id": "axin", "model": "anthropic/claude-sonnet-4-20250514" }
]
```

### Cron Jobs 分配
| Cron Job | agentId |
|----------|---------|
| 美股晨報 | xiaocai |
| 台股開盤報告 | xiaocai |
| 台股收盤報告 | xiaocai |
| 台股盤後摘要 | xiaocai |
| 記憶體股盯盤 | xiaocai |
| 週末股市回顧 | xiaocai |
| 美股模擬投資 | xiaocai |
| AI 新聞日報 | axin |
| GitHub 熱門專案 | axin |
| 夜間自主探索 | yanyan |
| Nightly Build | yanyan |
| Dashboard 更新 | main (lucy) |
| 其他 | main (lucy) |

## 成本效益

- **Opus** (lucy): $15/M input, $75/M output
- **Sonnet** (xiaocai/yanyan/axin): $3/M input, $15/M output

預估節省：將 70% 的任務改用 Sonnet，成本降低約 50-60%。
