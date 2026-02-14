# HEARTBEAT.md

## 🔍 定期檢查項目

### 1. Telegram 連線健康檢查 ⚠️ 優先
Telegram 使用 long-polling 模式，連線偶爾會斷掉。每次 heartbeat 必須檢查：

```bash
# 檢查是否有 pending updates（正常應該是 0，因為 OpenClaw 在消費）
curl -s "https://api.telegram.org/bot8244971663:AAEaAk-0y9_MycTZz5_n_5vvmcFtvVBqa2w/getUpdates?limit=1&timeout=1"
```

- 如果 `pending_update_count > 0` 且持續超過 5 分鐘 → Telegram polling 可能斷線
- 修復方式：使用 `gateway restart` 重啟 Gateway
- 重啟後等待 5 秒，再次確認 Telegram 已連線

### 2. Cron 任務健康監控
每次 heartbeat 時，快速檢查是否有 cron job 發生 error：
- 使用 `cron list` 檢查 `lastStatus: "error"` 的任務
- 如果發現異常任務：
  1. 嘗試自動修復（缺少 to 欄位、model 名稱錯誤等常見問題）
  2. 如果無法自動修復，立即通知 Vince（Telegram + Webchat）
  3. 記錄到 `memory/cron-health-log.md`

### 3. Gmail OAuth 狀態
小管的帳單檢查需要 Gmail 授權，定期確認 gog 認證狀態。

---

## 📋 檢查頻率建議
- **Telegram 健康：每次 heartbeat（最優先）**
- Cron 健康：每次 heartbeat
- Gmail OAuth：每天一次
