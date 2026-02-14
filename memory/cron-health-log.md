## 2026-02-14 08:01 - Gmail OAuth 過期

**問題：** 信用卡帳單提醒 cron 執行失敗，Gmail OAuth token 過期
**狀態：** 已通知 Vince (Telegram)
**需要動作：** 執行 `gog auth add` 重新授權

---

## 2026-02-14 09:01 - OpenRouter Credits 不足

**問題：** Perplexity API 額度不足，影響：
- AI 新聞日報 (Telegram + Webchat)
- 美股晨報 (Webchat)

**錯誤訊息：** You requested up to 8000 tokens, but can only afford 2609
**狀態：** 已通知 Vince (Telegram)
**需要動作：** 前往 OpenRouter 加值 credits

---

## 2026-02-14 09:01 - Moltbook API 再次失效

**問題：** /api/feed 回傳 404
**狀態：** 已自動記錄，暫不通知（非緊急）
**建議：** 等待 API 恢復

---

## 2026-02-14 11:01 - Webchat 頻道配置問題

**問題：** 多個 Webchat 任務失敗
**錯誤：** bot is not a member of the supergroup chat
**影響任務：**
- AI 新聞日報 - Webchat 完整版
- 每日美股晨報 - Webchat 完整版
- 週末股市回顧 - Webchat 完整版

**狀態：** 已記錄，Telegram 版本正常
**建議：** 檢查 webchat 頻道的 Telegram bot 配置

---

