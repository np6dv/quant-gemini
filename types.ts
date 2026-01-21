
export interface ChartDataPoint {
  time: string;
  price: number;
}

export interface StockAnalysis {
  ticker: string;
  name: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  technicalSummary: string;
  indicators: {
    rsi: string;
    macd: string;
    movingAverages: string;
    volumeProfile: string;
    shortInterest: string;
  };
  momentum: {
    trend: 'Bullish' | 'Bearish' | 'Neutral';
    strength: string;
    description: string;
  };
  sentiment: {
    score: number; // 0 (Bearish) to 100 (Bullish)
    label: 'Positive' | 'Negative' | 'Neutral';
    headlines: { title: string; source: string; date: string; impact: 'High' | 'Medium' | 'Low' }[];
    shortTermOutlook: string;
  };
  strategy: {
    entryPoint: string;
    takeProfit: string;
    stopLoss: string;
    downsideExit: string;
    rationale: string;
  };
  sources: { title: string; uri: string }[];
  history: ChartDataPoint[];
}
