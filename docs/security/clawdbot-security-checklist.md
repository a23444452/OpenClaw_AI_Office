# 🛡️ Clawdbot 安全檢測清單

**來源：** https://securemyclawdbot.com/security/
**整理日期：** 2025-02-01
**最後檢測：** 2025-02-01
**總項目數：** 24 項

---

## 📊 檢測結果總覽

| 類別 | 通過 | 警告 | 失敗 | 總數 |
|------|:----:|:----:|:----:|:----:|
| Network Security | 2 | 3 | 0 | 5 |
| Auth & Secrets | 3 | 0 | 2 | 5 |
| Remote Access | 1 | 2 | 1 | 4 |
| Prompt Injection Defense | 0 | 5 | 0 | 5 |
| Operational Security | 1 | 3 | 1 | 5 |
| **總計** | **7** | **13** | **4** | **24** |

**安全評分：29% (7/24 通過)**

---

## 一、Network Security（網路安全）— 5 項

| # | 檢測項目 | 說明 | 狀態 | 備註 |
|---|----------|------|:----:|------|
| 1 | Gateway 只綁定 127.0.0.1 | 不可在不信任的網路上綁定 0.0.0.0 | ✅ | `bind: "loopback"` |
| 2 | 防火牆阻擋 18789 端口外部存取 | 防止未授權網路存取 | ⚠️ | 需手動確認 |
| 3 | 路由器沒有設定 18789 端口轉發 | 檢查路由器管理介面 | ⚠️ | 需手動確認 |
| 4 | 使用 VPN/SSH 通道進行遠端存取 | 永不直接暴露 gateway 端口到網際網路 | ⚠️ | Tailscale 未安裝 |
| 5 | 用 netstat/lsof 驗證綁定介面 | 確認 gateway 監聽的是哪個介面 | ✅ | 已確認 loopback |

---

## 二、Auth & Secrets（認證與機密）— 5 項

| # | 檢測項目 | 說明 | 狀態 | 備註 |
|---|----------|------|:----:|------|
| 1 | API key 檔案權限為 600 | 僅擁有者可讀寫 | ✅ | `-rw-------` 正確 |
| 2 | Gateway 認證 token 足夠強 | 由安裝精靈自動產生 | ✅ | 48 字元 hex |
| 3 | 設定檔中無硬編碼憑證 | 使用環境變數或安全金鑰儲存庫 | ❌ | **發現多個 API key 寫死在 config** |
| 4 | OAuth 憑證檔有限制權限 | 檢查 credentials 目錄 | ✅ | `-rw-------` 正確 |
| 5 | 敏感檔案已加入 .gitignore | 防止意外提交 | ❌ | **workspace 無 .gitignore** |

### ⚠️ 發現的硬編碼憑證

```
- channels.telegram.botToken
- tools.web.search.perplexity.apiKey
- skills.entries.nano-banana-pro.apiKey
```

**建議：** 改用環境變數或 1Password CLI

---

## 三、Remote Access（遠端存取）— 4 項

| # | 檢測項目 | 說明 | 狀態 | 備註 |
|---|----------|------|:----:|------|
| 1 | 使用 SSH 通道（非直接暴露） | 需加密連線 | ⚠️ | 需確認使用方式 |
| 2 | 已設定 Tailscale/WireGuard | 私有網狀網路 | ❌ | **未安裝** |
| 3 | Gateway 無公開 IP 暴露 | 用外部端口掃描器驗證 | ✅ | bind: loopback |
| 4 | SSH 使用金鑰認證（非密碼） | 比密碼認證更安全 | ⚠️ | 預設設定未明確 |

---

## 四、Prompt Injection Defense（提示注入防禦）— 5 項

| # | 檢測項目 | 說明 | 狀態 | 備註 |
|---|----------|------|:----:|------|
| 1 | 系統提示使用 `<security_boundary>` 標籤 | 防止用戶輸入覆蓋系統指令 | ⚠️ | 需檢查 AGENTS.md |
| 2 | 用戶輸入在送給 LLM 前已淨化 | 過濾危險字元 | ⚠️ | 依賴 OpenClaw 內建 |
| 3 | 破壞性工具需要確認 | 防止意外或惡意操作 | ⚠️ | 需確認 exec 設定 |
| 4 | 已設定速率限制 | 防止濫用與成本超支 | ⚠️ | 需確認設定 |
| 5 | 已測試對抗提示注入攻擊 | 對自己的 bot 進行紅隊測試 | ⚠️ | 需手動測試 |

---

## 五、Operational Security（營運安全）— 5 項

| # | 檢測項目 | 說明 | 狀態 | 備註 |
|---|----------|------|:----:|------|
| 1 | 已設定日誌監控 | 監看可疑模式 | ✅ | 有日誌目錄 |
| 2 | 已排程定期安全稽核 | 每週執行 security audit | ⚠️ | 未設定排程 |
| 3 | 已有更新策略 | 檢查新版本 | ⚠️ | 需確認 |
| 4 | 已有 agent 資料備份策略 | 別弄丟你的設定！ | ❌ | **無備份目錄** |
| 5 | 已記錄事件應變計畫 | 知道被入侵時該怎麼做 | ⚠️ | 未記錄 |

---

## 🔧 建議修復項目

### 🔴 高優先級（安全風險）

1. **建立 .gitignore**
   ```bash
   cd ~/.openclaw/workspace
   cat > .gitignore << 'EOF'
   # Secrets
   *.key
   *.pem
   credentials/
   **/secrets/
   
   # Config with sensitive data
   openclaw.json
   config.yaml
   
   # Logs
   *.log
   logs/
   EOF
   ```

2. **移除設定檔中的硬編碼憑證**
   - 改用環境變數：`TELEGRAM_BOT_TOKEN`, `PERPLEXITY_API_KEY`
   - 或使用 1Password CLI / macOS Keychain

3. **建立備份策略**
   ```bash
   mkdir -p ~/Backups/openclaw
   cp -r ~/.openclaw/workspace ~/Backups/openclaw/workspace-$(date +%Y%m%d)
   cp ~/.openclaw/openclaw.json ~/Backups/openclaw/config-$(date +%Y%m%d).json
   ```

### 🟡 中優先級（建議改善）

4. **安裝 Tailscale** 用於安全遠端存取
   ```bash
   brew install tailscale
   ```

5. **設定定期安全稽核排程**（可用 cron job）

6. **測試 Prompt Injection 防禦**

---

## 更新紀錄

| 日期 | 更新內容 |
|------|----------|
| 2025-02-01 | 初始建立，執行完整安全檢測 |
