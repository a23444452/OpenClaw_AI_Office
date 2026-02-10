# AI ASIC 發展趨勢分析（2025-2026）

> 📅 研究日期：2026-02-11
> 🔬 研究主題：Google TPU、AWS Trainium、Intel Gaudi、Microsoft Maia、Meta MTIA

---

## 📊 市場概況

### 市場規模與成長

| 指標 | 2024 | 2025 | 2026 | 2030 (預測) |
|------|------|------|------|-------------|
| AI 晶片市場 | $529 億 | $1,500+ 億 | 持續成長 | $2,956 億 |
| 整體半導體市場 | - | $7,280 億 | $8,000 億 | - |
| 生成式 AI 晶片佔比 | - | ~50% | 持續上升 | - |
| CAGR (2024-2030) | - | - | - | 33% |

### NVIDIA 統治地位面臨挑戰

- **市佔率**：NVIDIA 佔 AI 加速器市場高達 **95%**
- **挑戰來源**：
  - 超大規模雲端服務商（Hyperscalers）自研 ASIC
  - 目標：降低成本、減少對 NVIDIA 依賴、優化特定工作負載
- **AI Server Compute ASIC 預計 2027 年出貨量增長 3 倍**

### 自研 ASIC 市場分佈（2024）

| 廠商 | 市佔率 |
|------|--------|
| Google TPU | 64% |
| AWS Trainium | 36% |

---

## 🏢 主要玩家深度分析

### 1. Google TPU（Tensor Processing Unit）

#### 發展歷程
- 2015 年開始內部開發，先驅角色
- 目前控制自研雲端 AI 加速器市場 **58-64%**

#### TPU v5 系列（2023）

| 型號 | 定位 | 運算能力 | 記憶體 | 頻寬 | 特色 |
|------|------|----------|--------|------|------|
| **TPU v5e** | 成本優化 | 393 TOPS (INT8) | 32 GB HBM | 900 GB/s | 性價比高 2.5× |
| **TPU v5p** | 效能導向 | 更高 | 更大 | 更快 | 大型基礎模型訓練 |

#### TPU v6 Trillium（2024）

| 規格 | 數值 |
|------|------|
| 運算能力 | 相比 v5e **4.7 倍** |
| 記憶體 | 95 GB HBM（翻倍）|
| 頻寬 | 2,765 GB/s（翻倍）|
| 能效 | 比 v5e **高 67%** |
| Pod 配置 | 最多 256 顆 |
| 時脈 | 1,050 MHz |

**關鍵技術**：
- Systolic Array 架構（大型矩陣乘法單元）
- SparseCore 單元（稀疏運算優化）
- 光學互連（消除 PCIe 瓶頸）
- bfloat16 + INT8/INT4 混合精度

---

### 2. AWS Trainium（Amazon Annapurna Labs）

#### Trainium2（2024）

| 規格 | 數值 |
|------|------|
| 效能提升 | 比第一代 **4 倍** |
| 記憶體 | ~96 GB HBM3 |
| 最大配置 | 64 晶片 / UltraServer |
| 互連技術 | NeuronLink（3D Torus 拓撲）|
| 介面 | PCIe Gen5 |

**重要部署**：Anthropic Project Rainier（~500,000 顆晶片）

#### Trainium3（2025 年 12 月發布）

| 規格 | 數值 | vs Trainium2 |
|------|------|--------------|
| 製程 | **TSMC 3nm** | 升級 |
| FP8 運算 | **2.52 PFLOPS / 晶片** | 2× |
| 記憶體 | **144 GB HBM3e** | 1.5× |
| 頻寬 | **4.9 TB/s** | 1.7× |
| 最大配置 | 144 晶片 / UltraServer | 2.25× |
| UltraServer 總算力 | **362 FP8 PFLOPS** | - |
| 能效 | 4× 效能/瓦特 | 大幅提升 |
| 介面 | **PCIe Gen6** | 升級 |
| 互連 | **NeuronSwitch-v1**（全對全）| 升級 |

**新功能**：
- MXFP8、MXFP4 格式支援
- 結構化稀疏（4×）
- Micro-scaling、Stochastic rounding
- UltraCluster 3.0（支援數十萬顆晶片擴展）

**Trainium4 預覽**：
- FP4 吞吐量 6×
- FP8 效能 3×
- 支援 **NVIDIA NVLink Fusion**（混合 GPU 配置）

---

### 3. Intel Gaudi 3

#### 技術規格

| 規格 | 數值 |
|------|------|
| 製程 | **TSMC 5nm** |
| 運算核心 | 64 TPCs + 8 MMEs |
| FP8/BF16 運算 | **1.8 PFLOPS** |
| 記憶體 | **128 GB HBM2e** |
| 頻寬 | **3.7 TB/s** |
| On-die SRAM | 96 MB |
| 網路 | **24 × 200 GbE RoCE v2** |
| TDP（PCIe 版）| 600W |
| TDP（OAM 版）| 900W+ |

#### vs NVIDIA H100 比較

| 規格 | Intel Gaudi 3 | NVIDIA H100 |
|------|---------------|-------------|
| 製程 | 5nm | 4N |
| 記憶體 | **128 GB** HBM2e | 80 GB HBM3 |
| 頻寬 | **3.7 TB/s** | 3.35 TB/s |
| 峰值運算 | 1.8 PFLOPS | ~4 PFLOPS |
| 互連 | **開放 Ethernet** | NVLink（封閉）|
| TDP | 600W | 700W |
| 擴展性 | 64/機架，開放架構 | NVLink 網域 |

**競爭優勢**：
- 開放標準（避免供應商鎖定）
- 記憶體容量較大
- TCO（總體擁有成本）優勢
- PyTorch、Kubernetes 原生支援

---

### 4. Microsoft Maia 200（2026 年初）

#### 技術規格

| 規格 | 數值 |
|------|------|
| 製程 | **TSMC 3nm (N3P)** |
| 電晶體 | **1,400 億+** |
| **FP4 運算** | **10.14 PFLOPS** |
| FP8 運算 | 5.07 PFLOPS |
| BF16 運算 | 1.27 PFLOPS |
| 記憶體 | **216 GB HBM3e** |
| 頻寬 | **7 TB/s** |
| On-chip SRAM | 272 MB（CSRAM + TSRAM）|
| 雙向頻寬 | 2.8 TB/s |
| TDP | 750W |

**關鍵特色**：
- 推論優化設計
- 支援 Copilot 365、GPT-5.2
- 比 Maia 100 每美元效能提升 **30%**
- 比 NVIDIA Blackwell B300 Ultra 功耗低（750W vs 1,400W）

**vs 競品比較**：

| 規格 | Maia 200 | Trainium3 | 優勢 |
|------|----------|-----------|------|
| FP4 | 10.14 PFLOPS | 2.52 PFLOPS | **4×** |
| 記憶體 | 216 GB | 144 GB | **1.5×** |
| 頻寬 | 7 TB/s | 4.9 TB/s | **1.4×** |

---

### 5. Meta MTIA（Meta Training and Inference Accelerator）

#### MTIA v1（第一代）

| 規格 | 數值 |
|------|------|
| 製程 | TSMC 7nm |
| 時脈 | 800 MHz |
| Die Size | 373 mm² |
| TDP | **25W**（極低功耗）|
| INT8 GEMM | 102.4 TFLOPS |
| FP16/BF16 GEMM | 51.2 TFLOPS |
| 記憶體 | 64 GB LPDDR5 |
| 介面 | PCIe Gen4 |

#### MTIA v2（現行）

| 規格 | 數值 | vs v1 |
|------|------|-------|
| 製程 | **TSMC 5nm** | 升級 |
| 時脈 | **1.35 GHz** | 1.7× |
| Die Size | 421 mm² | +13% |
| TDP | **90W** | 3.6× |
| INT8 GEMM (稀疏) | **708 TFLOPS** | 7× |
| INT8 GEMM (密集) | 354 TFLOPS | 3.5× |
| On-chip SRAM | **256 MB** | 2× |
| SRAM 頻寬 | **2.7 TB/s** | 3× |
| 介面 | **PCIe Gen5** | 升級 |

**架構特色**：
- 64 PEs（8×8 網格）
- RISC-V 四核控制
- 2:4 稀疏權重支援
- 機架級系統：24 晶片/伺服器 ≈ 8 GPU 效能

#### MTIA v3（2026 預計）

- 製程：**TSMC N3**
- 新增：**HBM3e**（首次採用 HBM）
- 預期大幅提升運算能力

#### 未來路線圖（據報導）

| 代號 | 預計時間 | 特色 |
|------|----------|------|
| v3 (Iris) | 2026 | TSMC N3 + HBM3e |
| T-V1.5 | 2026 中 | 面積翻倍 |
| T-V2 | 2027 | CoWoS 封裝、170kW 機架 |
| v4-v6 | 未公開 | - |

---

## 📈 2026 年關鍵趨勢

### 1. 自研晶片加速
- 超大規模雲端服務商減少對 NVIDIA 依賴
- 優化特定工作負載（推論 > 訓練）
- 降低 TCO 和能耗

### 2. 推論優於訓練
- 推論加速器成長速度超越訓練
- Edge AI 需求激增
- 低功耗設計成為關鍵

### 3. 新興架構
- 神經形態運算（Neuromorphic）
- 類比運算（Analog Computing）
- 記憶體內運算（In-memory Processing）
- 光子互連（Photonic Interconnects）

### 4. 製程領先
- TSMC 3nm 成為 AI 晶片主流
- 2nm 開始量產（TSMC 新竹）
- 先進封裝（CoWoS、SoIC）需求爆發

### 5. NVIDIA 反擊
- **Grace Blackwell B200**：推論效能比 H100 高 **30 倍**
- **Rubin 平台**（2026）：6 顆新晶片、AI 成本降 **10 倍**、能效提升 **5 倍**
- 「AI 工廠」策略：靈活性優於專用 ASIC

---

## 🇹🇼 台灣供應鏈受益者

### TSMC（台積電）

| 指標 | 數值 |
|------|------|
| 先進製程市佔 | ~70%（6nm 以下）|
| 2026 資本支出 | $520-560 億 |
| Q1 2026 營收預估 | $346-358 億 |
| 毛利率 | 63-65% |

**關鍵產能**：
- 2nm：新竹量產
- 3nm：多廠區擴產
- Arizona：3nm 2026 年上線（$400+ 億投資）

### 封裝供應鏈

| 公司 | 產品/技術 |
|------|-----------|
| **南電** | 載板 (ABF) |
| **景碩** | 載板 (ABF) |
| **欣興** | 載板 (ABF) |
| **日月光** | CoWoS 封裝服務 |

### 設備供應鏈

| 公司 | 產品 |
|------|------|
| **弘塑** | 濕製程設備 |
| **辛耘** | 化學品輸送 |

---

## 📊 規格比較總表

| 晶片 | 廠商 | 製程 | 記憶體 | 頻寬 | 峰值算力 | TDP |
|------|------|------|--------|------|----------|-----|
| **TPU v6** | Google | - | 95 GB | 2.77 TB/s | 4.7× v5e | - |
| **Trainium3** | AWS | 3nm | 144 GB | 4.9 TB/s | 2.52 PFLOPS (FP8) | - |
| **Gaudi 3** | Intel | 5nm | 128 GB | 3.7 TB/s | 1.8 PFLOPS | 600W |
| **Maia 200** | Microsoft | 3nm | 216 GB | 7 TB/s | 10.14 PFLOPS (FP4) | 750W |
| **MTIA v2** | Meta | 5nm | 128 GB LPDDR5 | 2.7 TB/s | 354 TFLOPS (INT8) | 90W |
| **H100** | NVIDIA | 4N | 80 GB | 3.35 TB/s | ~4 PFLOPS | 700W |

---

## 💡 投資觀點

### 受益股票

1. **TSMC (2330/TSM)**
   - 所有 AI ASIC 都需要台積電代工
   - 先進製程壟斷地位
   - CoWoS 產能瓶頸 = 高毛利

2. **NVIDIA (NVDA)**
   - 仍佔 95% 市場
   - Rubin 平台維持技術領先
   - 生態系優勢難以撼動

3. **載板三雄（南電、景碩、欣興）**
   - ABF 載板需求持續成長
   - AI 晶片面積增大 = 載板需求增加

### 風險因素

- 產能過剩風險（2027 後）
- 美中科技戰升級
- HBM 供給瓶頸
- 電力需求與永續挑戰

---

## 📚 參考資源

### 官方來源
- [Google Cloud TPU](https://cloud.google.com/tpu)
- [AWS Trainium](https://aws.amazon.com/ai/machine-learning/trainium/)
- [Intel Gaudi](https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html)
- [Microsoft Maia Blog](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)
- [Meta MTIA Blog](https://ai.meta.com/blog/next-generation-meta-training-inference-accelerator-AI-MTIA/)

### 研究報告
- Counterpoint Research: AI Server Compute ASIC Shipments
- Deloitte: Semiconductor Industry Outlook
- SemiAnalysis: AWS Trainium3 Deep Dive

### 追蹤建議
- 各廠年度開發者大會（Google I/O、AWS re:Invent）
- 半導體產業季度法說會
- Tom's Hardware、The Next Platform 技術分析

---

*本報告為 AI 研究助理自主探索成果，僅供參考，不構成投資建議。*
