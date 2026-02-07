# Python 量化投資回測框架學習筆記

> 目標讀者：有 Python 基礎、想入門量化投資的工程師
> 更新日期：2026-02

---

## 目錄

1. [主流回測框架比較](#1-主流回測框架比較)
2. [台股 & 美股資料來源](#2-台股--美股資料來源)
3. [基礎回測流程](#3-基礎回測流程)
4. [範例策略（附 code）](#4-範例策略附-code)
5. [進階主題概覽](#5-進階主題概覽)

---

## 1. 主流回測框架比較

### 快速比較表

| 框架 | 架構類型 | 速度 | 學習曲線 | 適用場景 | GitHub Stars | 維護狀態 |
|------|----------|------|----------|----------|--------------|----------|
| **Backtrader** | 事件驅動 | ⭐⭐⭐ | 中等 | 完整回測、實盤對接 | 14k+ | 維護中 |
| **Zipline** | 事件驅動 | ⭐⭐⭐ | 較陡 | 學術研究、ML 整合 | 17k+ | zipline-reloaded 活躍 |
| **VectorBT** | 向量化 | ⭐⭐⭐⭐⭐ | 中等 | 快速研究、大規模優化 | 5k+ | 活躍 |
| **QuantStats** | 分析工具 | N/A | 簡單 | 績效分析、報表產出 | 5k+ | 活躍 |
| **PyAlgoTrade** | 事件驅動 | ⭐⭐⭐ | 簡單 | 入門學習 | 4k+ | 較少更新 |

### 詳細分析

#### Backtrader
```
優點：
✅ 文件完整、社群活躍
✅ 內建 IB、Oanda 等券商整合
✅ 支援多時間軸、多資產
✅ 靈活的 Cerebro 引擎
✅ 豐富的技術指標庫

缺點：
❌ 大數據集時速度較慢
❌ 視覺化功能較陽春
❌ 參數優化效率不高

適用場景：完整的策略開發、需要實盤交易整合
```

**安裝：**
```bash
pip install backtrader
```

#### VectorBT
```
優點：
✅ 極快速度（向量化運算）
✅ 處理百萬筆資料毫秒級
✅ 優秀的參數優化能力
✅ 內建豐富績效指標
✅ 支援 1000+ 策略組合同時測試

缺點：
❌ 不支援即時交易
❌ 訂單模擬較簡化（無排隊機制）
❌ 需注意 look-ahead bias

適用場景：快速研究、策略篩選、大規模回測
```

**安裝：**
```bash
pip install vectorbt
```

#### Zipline (zipline-reloaded)
```
優點：
✅ Quantopian 遺產，功能完整
✅ 內建 Pipeline 資料處理
✅ 與 scikit-learn 整合良好
✅ 完整的風險分析

缺點：
❌ 學習曲線較陡
❌ 資料格式要求嚴格（需 bundle）
❌ 對台股支援較弱

適用場景：學術研究、機器學習策略
```

**安裝：**
```bash
pip install zipline-reloaded
```

#### QuantStats
```
特色：
📊 不是回測框架，是「績效分析」工具
📊 一行程式碼產出完整報表
📊 支援 Sharpe、Sortino、Max Drawdown 等指標
📊 可產出 HTML 報表

常與 Backtrader、VectorBT 搭配使用
```

**安裝：**
```bash
pip install quantstats
```

#### PyAlgoTrade
```
優點：
✅ 入門友善
✅ 程式碼簡潔
✅ 適合學習回測概念

缺點：
❌ 功能相對基礎
❌ 維護較不活躍
❌ 社群較小

適用場景：初學者學習、簡單策略測試
```

### 框架選擇建議

```
📌 入門學習 → Backtrader（文件齊全）
📌 快速研究 → VectorBT（速度優先）
📌 學術/ML → Zipline-reloaded
📌 績效報表 → QuantStats
📌 生產環境 → Backtrader + 券商 API
```

---

## 2. 台股 & 美股資料來源

### 免費資料來源

#### 🇹🇼 台股

| 來源 | 資料類型 | 限制 | 特色 |
|------|----------|------|------|
| **yfinance** | 日K、技術指標 | 無註冊 | 股票代碼加 `.TW` 或 `.TWO` |
| **FinMind** | 日K、月營收、法人籌碼 | 600次/小時 | 台股最完整的免費 API |
| **證交所 OpenData** | 每日成交資訊 | 無 | 官方資料，需自行累積歷史 |
| **twstock** | 即時報價、歷史資料 | 無 | 輕量化套件 |

#### 🇺🇸 美股

| 來源 | 資料類型 | 限制 | 特色 |
|------|----------|------|------|
| **yfinance** | 日K、財報、選擇權 | 無註冊 | 最簡單的方式 |
| **Alpha Vantage** | 股價、技術指標 | 5次/分鐘、500次/日 | 需 API Key |
| **Polygon.io** | 即時、歷史 | 免費版限制多 | 專業級資料品質 |
| **Alpaca** | 即時、歷史 | 免費版延遲 15 分鐘 | 可直接交易 |

### 免費 API 使用範例

#### yfinance（台股 & 美股通用）

```python
import yfinance as yf
import pandas as pd

# 下載台積電 (台股)
tsmc = yf.download('2330.TW', start='2023-01-01', end='2024-12-31')
print(tsmc.tail())

# 下載 Apple (美股)
aapl = yf.download('AAPL', start='2023-01-01', end='2024-12-31')
print(aapl.tail())

# 下載多檔股票
tickers = ['AAPL', 'GOOGL', 'MSFT']
data = yf.download(tickers, start='2023-01-01', end='2024-12-31')
print(data['Close'].tail())
```

#### FinMind（台股專用）

```python
from FinMind.data import DataLoader

dl = DataLoader()
# 免費用戶可不登入，但有限制
# dl.login_by_token(api_token='你的API金鑰')

# 取得台積電日K資料
df = dl.taiwan_stock_daily(
    stock_id='2330', 
    start_date='2023-01-01', 
    end_date='2024-12-31'
)
print(df.head())

# 取得月營收
revenue = dl.taiwan_stock_month_revenue(
    stock_id='2330', 
    start_date='2023-01-01'
)
print(revenue.head())

# 取得三大法人買賣超
institutional = dl.taiwan_stock_institutional_investors(
    stock_id='2330',
    start_date='2023-01-01'
)
print(institutional.head())
```

#### 證交所 OpenData（台股官方）

```python
import requests
import pandas as pd

# 取得當日所有股票成交資訊
url = 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL'
response = requests.get(url)
data = response.json()

df = pd.DataFrame(data)
df.set_index('Code', inplace=True)
print(df.head())

# CSV 格式直接下載
csv_url = 'https://www.twse.com.tw/exchangeReport/STOCK_DAY_ALL?response=open_data'
df_csv = pd.read_csv(csv_url)
print(df_csv.head())
```

### 付費資料方案比較

| 供應商 | 月費 (USD) | 特色 | 適合對象 |
|--------|------------|------|----------|
| **TEJ** | $100+ | 台股最完整、還原價、財報 | 專業研究 |
| **Polygon.io** | $29+ | 美股即時、歷史完整 | 美股交易者 |
| **Alpha Vantage** | $50+ | 技術指標 API 完整 | 技術分析 |
| **Quandl (Nasdaq)** | 依資料集 | 另類資料 | 量化基金 |
| **Bloomberg Terminal** | $2000+/月 | 專業級全面資料 | 機構投資人 |

---

## 3. 基礎回測流程

### 流程圖

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  資料獲取   │ -> │  策略撰寫   │ -> │  回測執行   │ -> │  績效分析   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                   │                   │                   │
   yfinance          定義買賣邏輯        設定初始資金          Sharpe Ratio
   FinMind           技術指標           手續費/滑價          Max Drawdown
   CSV檔案           進出場條件          執行回測             Win Rate
```

### Step 1: 資料獲取與前處理

```python
import yfinance as yf
import pandas as pd

def get_stock_data(symbol, start, end):
    """下載股票資料並做基本清理"""
    df = yf.download(symbol, start=start, end=end)
    
    # 移除空值
    df.dropna(inplace=True)
    
    # 確保欄位名稱一致（小寫）
    df.columns = [col.lower() for col in df.columns]
    
    return df

# 使用範例
data = get_stock_data('AAPL', '2020-01-01', '2024-12-31')
print(f"資料筆數: {len(data)}")
print(data.head())
```

### Step 2: 策略撰寫框架

```python
import numpy as np

def calculate_signals(df, short_window=20, long_window=50):
    """計算交易訊號"""
    signals = pd.DataFrame(index=df.index)
    
    # 計算均線
    signals['short_ma'] = df['close'].rolling(window=short_window).mean()
    signals['long_ma'] = df['close'].rolling(window=long_window).mean()
    
    # 產生訊號: 1=買入, -1=賣出, 0=持有
    signals['signal'] = 0
    signals.loc[signals['short_ma'] > signals['long_ma'], 'signal'] = 1
    signals.loc[signals['short_ma'] < signals['long_ma'], 'signal'] = -1
    
    # 只在訊號變化時交易
    signals['position'] = signals['signal'].diff()
    
    return signals
```

### Step 3: 回測執行

```python
def backtest(df, signals, initial_capital=100000, commission=0.001):
    """執行回測"""
    positions = pd.DataFrame(index=signals.index)
    positions['holdings'] = signals['signal'] * df['close']
    
    # 計算資產價值
    portfolio = pd.DataFrame(index=signals.index)
    portfolio['cash'] = initial_capital - (signals['position'].abs() * df['close'] * (1 + commission)).cumsum()
    portfolio['holdings'] = positions['holdings']
    portfolio['total'] = portfolio['cash'] + portfolio['holdings']
    portfolio['returns'] = portfolio['total'].pct_change()
    
    return portfolio
```

### Step 4: 績效分析

```python
def analyze_performance(portfolio):
    """計算績效指標"""
    returns = portfolio['returns'].dropna()
    
    # 年化報酬率
    total_return = (portfolio['total'].iloc[-1] / portfolio['total'].iloc[0]) - 1
    years = len(portfolio) / 252
    annual_return = (1 + total_return) ** (1/years) - 1
    
    # Sharpe Ratio (假設無風險利率 2%)
    risk_free_rate = 0.02
    sharpe = (returns.mean() * 252 - risk_free_rate) / (returns.std() * np.sqrt(252))
    
    # Max Drawdown
    cummax = portfolio['total'].cummax()
    drawdown = (portfolio['total'] - cummax) / cummax
    max_drawdown = drawdown.min()
    
    # 勝率
    trades = portfolio[portfolio['holdings'].diff() != 0]
    winning_trades = len(trades[trades['returns'] > 0])
    total_trades = len(trades)
    win_rate = winning_trades / total_trades if total_trades > 0 else 0
    
    return {
        'Total Return': f"{total_return:.2%}",
        'Annual Return': f"{annual_return:.2%}",
        'Sharpe Ratio': f"{sharpe:.2f}",
        'Max Drawdown': f"{max_drawdown:.2%}",
        'Win Rate': f"{win_rate:.2%}",
        'Total Trades': total_trades
    }

# 使用 QuantStats 更簡單
import quantstats as qs

def quick_analysis(returns, benchmark='SPY'):
    """使用 QuantStats 快速分析"""
    # 產出完整 HTML 報表
    qs.reports.html(returns, benchmark, output='backtest_report.html')
    
    # 或只看基本指標
    print(f"Sharpe: {qs.stats.sharpe(returns):.2f}")
    print(f"Max Drawdown: {qs.stats.max_drawdown(returns):.2%}")
    print(f"CAGR: {qs.stats.cagr(returns):.2%}")
```

---

## 4. 範例策略（附 code）

### 策略一：均線交叉策略 (MA Crossover)

> 經典入門策略：短均線上穿長均線買入，下穿賣出

#### 使用 Backtrader 實作

```python
import backtrader as bt
import yfinance as yf
from datetime import datetime

class MACrossStrategy(bt.Strategy):
    """均線交叉策略"""
    params = (
        ('fast_period', 10),   # 短均線週期
        ('slow_period', 30),   # 長均線週期
    )

    def __init__(self):
        # 計算均線
        self.fast_ma = bt.indicators.SMA(
            self.data.close, 
            period=self.params.fast_period
        )
        self.slow_ma = bt.indicators.SMA(
            self.data.close, 
            period=self.params.slow_period
        )
        # 交叉訊號
        self.crossover = bt.indicators.CrossOver(self.fast_ma, self.slow_ma)

    def next(self):
        if not self.position:  # 沒有持倉
            if self.crossover > 0:  # 黃金交叉
                self.buy()
                print(f'BUY at {self.data.close[0]:.2f}')
        else:  # 有持倉
            if self.crossover < 0:  # 死亡交叉
                self.sell()
                print(f'SELL at {self.data.close[0]:.2f}')


def run_ma_backtest():
    """執行均線策略回測"""
    # 初始化 Cerebro 引擎
    cerebro = bt.Cerebro()
    
    # 下載資料
    df = yf.download('AAPL', '2020-01-01', '2024-12-31')
    data = bt.feeds.PandasData(dataname=df)
    cerebro.adddata(data)
    
    # 加入策略
    cerebro.addstrategy(MACrossStrategy)
    
    # 設定初始資金和手續費
    cerebro.broker.setcash(100000.0)
    cerebro.broker.setcommission(commission=0.001)  # 0.1%
    
    # 加入分析器
    cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
    cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
    cerebro.addanalyzer(bt.analyzers.DrawDown, _name='drawdown')
    cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name='trades')
    
    # 執行
    print(f'起始資金: {cerebro.broker.getvalue():,.2f}')
    results = cerebro.run()
    print(f'最終資金: {cerebro.broker.getvalue():,.2f}')
    
    # 輸出績效
    strat = results[0]
    print(f"\n=== 績效報告 ===")
    print(f"Sharpe Ratio: {strat.analyzers.sharpe.get_analysis().get('sharperatio', 'N/A')}")
    print(f"Total Return: {strat.analyzers.returns.get_analysis()['rtot']:.2%}")
    print(f"Max Drawdown: {strat.analyzers.drawdown.get_analysis()['max']['drawdown']:.2%}")
    
    # 繪圖
    cerebro.plot(style='candlestick')


if __name__ == '__main__':
    run_ma_backtest()
```

#### 使用 VectorBT 實作（速度更快）

```python
import vectorbt as vbt
import yfinance as yf

# 下載資料
data = yf.download('AAPL', '2020-01-01', '2024-12-31')
price = data['Close']

# 計算均線
fast_ma = vbt.MA.run(price, window=10)
slow_ma = vbt.MA.run(price, window=30)

# 產生訊號
entries = fast_ma.ma_crossed_above(slow_ma)
exits = fast_ma.ma_crossed_below(slow_ma)

# 執行回測
portfolio = vbt.Portfolio.from_signals(
    price, 
    entries, 
    exits,
    init_cash=100000,
    fees=0.001
)

# 輸出績效
print(portfolio.stats())

# 繪圖
portfolio.plot().show()
```

### 策略二：RSI 超買超賣策略

> RSI < 30 買入（超賣），RSI > 70 賣出（超買）

#### 使用 Backtrader 實作

```python
import backtrader as bt
import yfinance as yf

class RSIStrategy(bt.Strategy):
    """RSI 超買超賣策略"""
    params = (
        ('rsi_period', 14),
        ('rsi_oversold', 30),    # 超賣閾值
        ('rsi_overbought', 70),  # 超買閾值
    )

    def __init__(self):
        self.rsi = bt.indicators.RSI(
            self.data.close, 
            period=self.params.rsi_period
        )
        self.order = None

    def next(self):
        if self.order:
            return

        if not self.position:
            # RSI 超賣 → 買入
            if self.rsi < self.params.rsi_oversold:
                self.order = self.buy()
                print(f'BUY at {self.data.close[0]:.2f}, RSI: {self.rsi[0]:.2f}')
        else:
            # RSI 超買 → 賣出
            if self.rsi > self.params.rsi_overbought:
                self.order = self.sell()
                print(f'SELL at {self.data.close[0]:.2f}, RSI: {self.rsi[0]:.2f}')

    def notify_order(self, order):
        if order.status in [order.Completed]:
            if order.isbuy():
                print(f'BUY EXECUTED at {order.executed.price:.2f}')
            else:
                print(f'SELL EXECUTED at {order.executed.price:.2f}')
        self.order = None


def run_rsi_backtest():
    """執行 RSI 策略回測"""
    cerebro = bt.Cerebro()
    
    # 下載資料
    df = yf.download('AAPL', '2020-01-01', '2024-12-31')
    data = bt.feeds.PandasData(dataname=df)
    cerebro.adddata(data)
    
    # 加入策略
    cerebro.addstrategy(RSIStrategy)
    
    # 設定
    cerebro.broker.setcash(100000.0)
    cerebro.broker.setcommission(commission=0.001)
    
    # 加入分析器
    cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
    cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
    cerebro.addanalyzer(bt.analyzers.DrawDown, _name='drawdown')
    
    print(f'起始資金: {cerebro.broker.getvalue():,.2f}')
    results = cerebro.run()
    print(f'最終資金: {cerebro.broker.getvalue():,.2f}')
    
    # 輸出績效
    strat = results[0]
    print(f"\n=== 績效報告 ===")
    sharpe = strat.analyzers.sharpe.get_analysis().get('sharperatio')
    print(f"Sharpe Ratio: {sharpe if sharpe else 'N/A'}")
    print(f"Total Return: {strat.analyzers.returns.get_analysis()['rtot']:.2%}")
    print(f"Max Drawdown: {strat.analyzers.drawdown.get_analysis()['max']['drawdown']:.2%}")
    
    cerebro.plot(style='candlestick')


if __name__ == '__main__':
    run_rsi_backtest()
```

#### 使用 VectorBT 實作

```python
import vectorbt as vbt
import yfinance as yf

# 下載資料
data = yf.download('AAPL', '2020-01-01', '2024-12-31')
price = data['Close']

# 計算 RSI
rsi = vbt.RSI.run(price, window=14)

# 產生訊號
entries = rsi.rsi_below(30)  # RSI < 30 買入
exits = rsi.rsi_above(70)    # RSI > 70 賣出

# 執行回測
portfolio = vbt.Portfolio.from_signals(
    price, 
    entries, 
    exits,
    init_cash=100000,
    fees=0.001
)

# 輸出績效
print(portfolio.stats())

# 繪製 RSI 和價格
fig = vbt.make_subplots(rows=2, cols=1, shared_xaxes=True)
price.vbt.plot(add_trace_kwargs=dict(row=1, col=1), fig=fig)
rsi.rsi.vbt.plot(add_trace_kwargs=dict(row=2, col=1), fig=fig)
fig.show()
```

### 策略三：台股範例（使用 FinMind）

```python
import backtrader as bt
from FinMind.data import DataLoader
import pandas as pd

class TaiwanMAStrategy(bt.Strategy):
    """台股均線策略"""
    params = (
        ('fast_period', 5),
        ('slow_period', 20),
    )

    def __init__(self):
        self.fast_ma = bt.indicators.SMA(self.data.close, period=self.params.fast_period)
        self.slow_ma = bt.indicators.SMA(self.data.close, period=self.params.slow_period)
        self.crossover = bt.indicators.CrossOver(self.fast_ma, self.slow_ma)

    def next(self):
        if not self.position:
            if self.crossover > 0:
                self.buy()
        else:
            if self.crossover < 0:
                self.sell()


def get_taiwan_stock_data(stock_id, start_date, end_date):
    """從 FinMind 取得台股資料"""
    dl = DataLoader()
    df = dl.taiwan_stock_daily(
        stock_id=stock_id,
        start_date=start_date,
        end_date=end_date
    )
    
    # 轉換為 Backtrader 格式
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df = df.rename(columns={
        'open': 'Open',
        'high': 'High', 
        'low': 'Low',
        'close': 'Close',
        'Trading_Volume': 'Volume'
    })
    
    return df[['Open', 'High', 'Low', 'Close', 'Volume']]


def run_taiwan_backtest():
    """執行台股回測"""
    cerebro = bt.Cerebro()
    
    # 取得台積電資料
    df = get_taiwan_stock_data('2330', '2020-01-01', '2024-12-31')
    data = bt.feeds.PandasData(dataname=df)
    cerebro.adddata(data)
    
    cerebro.addstrategy(TaiwanMAStrategy)
    
    # 台股手續費: 買賣各 0.1425%，賣出另加 0.3% 證交稅
    # 這裡簡化為 0.5%
    cerebro.broker.setcash(1000000.0)  # 台幣 100 萬
    cerebro.broker.setcommission(commission=0.005)
    
    cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
    cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
    
    print(f'起始資金: {cerebro.broker.getvalue():,.0f} TWD')
    results = cerebro.run()
    print(f'最終資金: {cerebro.broker.getvalue():,.0f} TWD')
    
    cerebro.plot()


if __name__ == '__main__':
    run_taiwan_backtest()
```

---

## 5. 進階主題概覽

### 5.1 滑價與手續費模擬

> 回測不考慮成本 = 假績效！真實交易一定有摩擦成本。

#### Backtrader 滑價設定

```python
import backtrader as bt

cerebro = bt.Cerebro()

# 設定手續費
cerebro.broker.setcommission(commission=0.001)  # 0.1%

# 設定滑價 - 固定點數
cerebro.broker.set_slippage_fixed(fixed=0.05)  # 每筆交易滑價 $0.05

# 或設定滑價 - 百分比
cerebro.broker.set_slippage_perc(perc=0.001)  # 0.1% 滑價

# 台股完整成本設定
class TaiwanCommission(bt.CommInfoBase):
    """台股手續費模型"""
    params = (
        ('commission', 0.001425),  # 券商手續費 0.1425%
        ('tax', 0.003),            # 證交稅 0.3%
        ('mult', 1.0),
        ('margin', None),
        ('commtype', bt.CommInfoBase.COMM_PERC),
        ('stocklike', True),
    )

    def _getcommission(self, size, price, pseudoexec):
        # 買入: 手續費
        # 賣出: 手續費 + 證交稅
        commission = abs(size) * price * self.p.commission
        if size < 0:  # 賣出
            commission += abs(size) * price * self.p.tax
        return commission

# 使用
cerebro.broker.addcommissioninfo(TaiwanCommission())
```

#### VectorBT 成本設定

```python
import vectorbt as vbt

portfolio = vbt.Portfolio.from_signals(
    price,
    entries,
    exits,
    init_cash=100000,
    fees=0.001,           # 手續費 0.1%
    slippage=0.001,       # 滑價 0.1%
    freq='1D',            # 日頻
    direction='both'      # 多空都可
)
```

### 5.2 Walk-Forward Optimization

> 避免過度擬合的關鍵技術：在歷史資料上滾動優化

```
時間軸：
|-------- 2020 --------|-------- 2021 --------|-------- 2022 --------|

Walk-Forward 流程：
|=== 訓練 (優化) ===|-- 測試 --|
                    |=== 訓練 (優化) ===|-- 測試 --|
                                        |=== 訓練 (優化) ===|-- 測試 --|
```

#### 實作範例

```python
import backtrader as bt
import pandas as pd
from itertools import product

def walk_forward_optimization(
    data, 
    strategy_class,
    param_grid,
    train_period_months=12,
    test_period_months=3
):
    """Walk-Forward 優化"""
    results = []
    
    # 切割時間窗口
    start = data.index[0]
    end = data.index[-1]
    
    train_delta = pd.DateOffset(months=train_period_months)
    test_delta = pd.DateOffset(months=test_period_months)
    
    current = start
    
    while current + train_delta + test_delta <= end:
        train_end = current + train_delta
        test_end = train_end + test_delta
        
        # 訓練資料
        train_data = data[current:train_end]
        # 測試資料
        test_data = data[train_end:test_end]
        
        # 在訓練集上找最佳參數
        best_params = None
        best_sharpe = -float('inf')
        
        for params in product(*param_grid.values()):
            param_dict = dict(zip(param_grid.keys(), params))
            
            cerebro = bt.Cerebro()
            cerebro.adddata(bt.feeds.PandasData(dataname=train_data))
            cerebro.addstrategy(strategy_class, **param_dict)
            cerebro.broker.setcash(100000)
            cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
            
            result = cerebro.run()
            sharpe = result[0].analyzers.sharpe.get_analysis().get('sharperatio', 0) or 0
            
            if sharpe > best_sharpe:
                best_sharpe = sharpe
                best_params = param_dict
        
        # 用最佳參數在測試集上驗證
        cerebro = bt.Cerebro()
        cerebro.adddata(bt.feeds.PandasData(dataname=test_data))
        cerebro.addstrategy(strategy_class, **best_params)
        cerebro.broker.setcash(100000)
        cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
        cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
        
        result = cerebro.run()
        
        results.append({
            'period': f"{train_end.strftime('%Y-%m')} to {test_end.strftime('%Y-%m')}",
            'best_params': best_params,
            'train_sharpe': best_sharpe,
            'test_sharpe': result[0].analyzers.sharpe.get_analysis().get('sharperatio', 0),
            'test_return': result[0].analyzers.returns.get_analysis()['rtot']
        })
        
        # 往前滾動
        current += test_delta
    
    return pd.DataFrame(results)


# 使用範例
param_grid = {
    'fast_period': [5, 10, 15],
    'slow_period': [20, 30, 40]
}

wf_results = walk_forward_optimization(
    data=df,
    strategy_class=MACrossStrategy,
    param_grid=param_grid,
    train_period_months=12,
    test_period_months=3
)

print(wf_results)
```

### 5.3 多資產組合回測

> 不要把雞蛋放在同一個籃子：多資產分散風險

#### Backtrader 多資產

```python
import backtrader as bt
import yfinance as yf

class MultiAssetStrategy(bt.Strategy):
    """多資產配置策略"""
    params = (
        ('rebalance_days', 20),  # 每 20 天再平衡
    )

    def __init__(self):
        self.day_count = 0
        # 目標權重
        self.target_weights = {
            'AAPL': 0.3,
            'GOOGL': 0.3,
            'MSFT': 0.2,
            'SPY': 0.2,
        }

    def next(self):
        self.day_count += 1
        
        if self.day_count % self.params.rebalance_days != 0:
            return
        
        # 計算目標部位
        total_value = self.broker.getvalue()
        
        for i, data in enumerate(self.datas):
            symbol = data._name
            target_weight = self.target_weights.get(symbol, 0)
            target_value = total_value * target_weight
            
            current_position = self.getposition(data).size
            current_value = current_position * data.close[0]
            
            diff_value = target_value - current_value
            diff_shares = int(diff_value / data.close[0])
            
            if diff_shares > 0:
                self.buy(data=data, size=diff_shares)
            elif diff_shares < 0:
                self.sell(data=data, size=abs(diff_shares))


def run_multi_asset_backtest():
    """執行多資產回測"""
    cerebro = bt.Cerebro()
    
    # 下載多檔股票
    symbols = ['AAPL', 'GOOGL', 'MSFT', 'SPY']
    for symbol in symbols:
        df = yf.download(symbol, '2020-01-01', '2024-12-31')
        data = bt.feeds.PandasData(dataname=df, name=symbol)
        cerebro.adddata(data)
    
    cerebro.addstrategy(MultiAssetStrategy)
    cerebro.broker.setcash(100000)
    cerebro.broker.setcommission(commission=0.001)
    
    print(f'起始資金: {cerebro.broker.getvalue():,.2f}')
    cerebro.run()
    print(f'最終資金: {cerebro.broker.getvalue():,.2f}')
    
    cerebro.plot()


if __name__ == '__main__':
    run_multi_asset_backtest()
```

#### VectorBT 多資產

```python
import vectorbt as vbt
import yfinance as yf
import numpy as np

# 下載多檔股票
symbols = ['AAPL', 'GOOGL', 'MSFT', 'SPY']
data = yf.download(symbols, '2020-01-01', '2024-12-31')['Close']

# 等權重配置
weights = np.array([0.25, 0.25, 0.25, 0.25])

# 計算投組報酬
returns = data.pct_change().dropna()
portfolio_returns = (returns * weights).sum(axis=1)

# 使用 QuantStats 分析
import quantstats as qs
qs.reports.html(portfolio_returns, output='multi_asset_report.html')
```

---

## 總結 Checklist

### 入門者學習路徑

```
Week 1-2: 
□ 安裝 Python 環境 (推薦 Anaconda)
□ 熟悉 pandas、numpy 基本操作
□ 用 yfinance 下載股價資料

Week 3-4:
□ 學習 Backtrader 基本架構
□ 實作 MA Crossover 策略
□ 理解回測報表指標

Week 5-6:
□ 實作 RSI 策略
□ 加入手續費、滑價
□ 用 QuantStats 產出報表

Week 7-8:
□ 嘗試 VectorBT 提高效率
□ 學習 Walk-Forward 驗證
□ 多資產組合回測
```

### 常見陷阱

```
❌ 不考慮手續費和滑價 → 績效虛高
❌ 過度優化參數 → 過擬合
❌ 只看報酬率 → 忽略風險
❌ 用未來資料 → Look-ahead bias
❌ 樣本太少 → 統計不顯著
```

### 推薦資源

**書籍：**
- 《Python for Finance》by Yves Hilpisch
- 《Advances in Financial Machine Learning》by Marcos López de Prado

**網站：**
- [Backtrader 官方文件](https://www.backtrader.com/docu/)
- [VectorBT 官方文件](https://vectorbt.dev/)
- [QuantStats GitHub](https://github.com/ranaroussi/quantstats)

**社群：**
- Reddit: r/algotrading
- Discord: Algo Trading 相關群組

---

> 💡 **最後提醒**：回測績效再好，都不代表未來獲利。市場永遠在變化，保持謙虛、持續學習！
