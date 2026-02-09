# 半導體產業追蹤工具指南 2026

> 研究日期：2026-02-04  
> 研究員：Lucy ✨  
> 適用對象：半導體製程工程師、產業研究者、投資人

---

## 📋 摘要

本文整理 2026 年追蹤半導體產業動態的主要工具與資源，涵蓋：
- 市場研究報告來源
- 即時新聞追蹤平台
- 台灣本地資源
- 投資追蹤工具
- 自動化追蹤設置

---

## 🔬 一、市場研究機構報告

### 國際研究機構

| 機構 | 報告特色 | 重點追蹤指標 | 連結 |
|------|----------|-------------|------|
| **PwC** | 《Semiconductor and Beyond》全球展望 | AI伺服器、車用IC、量子運算 | pwc.tw |
| **Omdia** | 營收預測、價格追蹤 | 記憶體市場、邏輯IC成長 | omdia.com |
| **IDC** | 市場規模、成長預測 | 資料中心、AI需求 | idc.com |
| **Gartner** | 技術成熟度曲線 | 新興技術評估 | gartner.com |

### 2026 市場關鍵數據
- 全球半導體營收：預計突破 **1兆美元**
- 2025 年成長率：**20.3%**
- AI 運算/儲存成長：**41.4%**
- 3nm 以下製程產能：年增 **>40%**

### 台灣產業研究

| 機構 | 內容重點 | 網址 |
|------|---------|------|
| **資策會 MIC** | 年度科技趨勢、AI伺服器預測 | mic.iii.org.tw |
| **工研院 IEK** | 半導體產業地圖、廠商數據 | iektrends.iek.org.tw |
| **ITIS 智網** | 產業報告、進出口數據庫 | itis.org.tw |
| **台經院** | 景氣動態、製造業數據 | tie.tier.org.tw |

---

## 📰 二、新聞與資訊平台

### 國際半導體新聞

| 平台 | Domain Authority | 內容特色 |
|------|------------------|---------|
| **DIGITIMES** | 87 | 台灣視角的亞洲半導體報導 |
| **EE Times** | 81 | 技術深度報導 |
| **Semiconductor Engineering** | 77 | 製程、設計技術 |
| **Semiconductor Today** | - | 化合物半導體專門 |
| **THE ELEC** | - | 韓國三星、SK 海力士動態 |
| **SemiWiki** | - | 半導體社群討論 |

### 新聞聚合平台

| 平台 | 說明 |
|------|------|
| **Lithos** | 半導體專門新聞聚合器 (lithosgraphein.com) |
| **EIN Newsdesk** | 可訂閱主題/國家 RSS |
| **Feedspot** | 彙整 Top 50 半導體 RSS Feed |

### 台灣資訊來源

- **TSIA 台灣半導體產業協會**：會員名單、產業動態 (tsia.org.tw)
- **TrendForce**：記憶體價格、晶圓代工產能、AI趨勢
- **DIGITIMES 中文版**：科技產業即時新聞

---

## 📊 三、投資追蹤工具

### 半導體股票追蹤

#### 免費工具推薦

| 工具 | 特色 | 適用情境 |
|------|------|---------|
| **PortfoliosLab** | 資產配置、相關係數分析 | 投資組合分析 |
| **Portseido** | 支援 70+ 交易所、股息追蹤 | 全球股票追蹤 |
| **StockAnalysis** | 免費篩選器、即時報價 | 美股研究 |
| **Barchart** | 半導體專題清單 | 市場概覽 |

#### 重點追蹤標的

**美股半導體**
- 晶圓代工：TSM (台積電)
- AI/GPU：NVDA (輝達)、AMD
- 記憶體：MU (美光)、WDC
- 設備：ASML、LRCX、AMAT
- IDM：INTC (英特爾)

**半導體 ETF**
| ETF | 追蹤指數 | 費用率 |
|-----|---------|--------|
| SOXX | ICE Semiconductor | 0.35% |
| SMH | MVIS US Listed Semiconductor | 0.35% |
| XSD | S&P Semiconductor Select | 0.35% |

### 台股半導體追蹤

**重點個股**
- 晶圓代工：2330 台積電、2303 聯電
- IC 設計：2454 聯發科、3034 聯詠
- 封測：2311 日月光投控
- 設備：3443 創意、6488 環球晶

**台股 ETF**
- 00891 中信半導體
- 00927 群益半導體收益

---

## 🤖 四、自動化追蹤設置

### RSS Feed 追蹤

**推薦 RSS 來源**
```
# 國際半導體新聞
https://www.semiconductor-today.com/rss/news.xml
https://semiengineering.com/feed/
https://www.digitimes.com/rss/daily.xml

# 台灣科技新聞  
https://technews.tw/feed/
```

**RSS 閱讀器推薦**
- **Feedly**：免費版支援 100 個來源
- **NetNewsWire**：macOS 原生、免費開源
- **Inoreader**：進階過濾功能

### 自動化腳本範例

```python
# 使用 Python feedparser 追蹤半導體新聞
import feedparser

feeds = [
    'https://semiengineering.com/feed/',
    'https://www.digitimes.com/rss/daily.xml',
]

for url in feeds:
    feed = feedparser.parse(url)
    for entry in feed.entries[:5]:
        print(f"[{feed.feed.title}] {entry.title}")
```

### 關鍵字追蹤建議

設置 Google Alerts 或 RSS 過濾器追蹤：
- `台積電 先進製程`
- `HBM 高頻寬記憶體`
- `NVIDIA GPU shortage`
- `semiconductor supply chain`
- `晶圓代工 產能利用率`

---

## 📅 五、追蹤節奏建議

| 頻率 | 追蹤內容 |
|------|---------|
| **每日** | 重點新聞（RSS 或 Lithos） |
| **每週** | ETF 表現、個股週報 |
| **每月** | TrendForce 記憶體報價、DRAM/NAND 走勢 |
| **每季** | 法說會（台積電、美光等）、研究機構報告 |
| **每年** | 年度展望報告（PwC、Omdia、資策會） |

---

## 🎯 六、Vince 專用追蹤清單

基於 Vince 的 Micron 工作背景，建議優先追蹤：

### 記憶體產業
- TrendForce DRAMeXchange（DRAM/NAND 報價）
- 美光法說會（每季）
- 三星、SK 海力士產能動態（THE ELEC）

### 先進製程
- 台積電技術論壇（年度）
- 先進封裝（CoWoS、HBM 整合）新聞
- EUV 設備（ASML）產能更新

### AI 半導體
- NVIDIA GTC 大會
- AI 伺服器出貨預測（資策會）
- 資料中心資本支出追蹤

---

## 📚 參考資源

### 研究報告
- [PwC 2026 全球半導體展望](https://www.pwc.tw/zh/publications/topic-report/semiconductor-and-beyond.html)
- [資策會 2026 十大科技趨勢](https://geneonline.news/mic-2026-tech-trend/)
- [ITIS 智網產業報告](https://www.itis.org.tw)

### 即時追蹤
- [Feedspot Top 50 Semiconductor RSS](https://rss.feedspot.com/semiconductor_rss_feeds/)
- [Lithos 半導體新聞聚合](https://lithosgraphein.com)
- [TSIA 台灣半導體產業協會](https://www.tsia.org.tw)

### 投資工具
- [PortfoliosLab 半導體投資組合](https://portfolioslab.com/portfolio/semiconductor-stocks)
- [StockAnalysis 半導體篩選器](https://stockanalysis.com/stocks/industry/semiconductors/)

---

*本文件會定期更新，歡迎補充新的追蹤工具或資源。*
