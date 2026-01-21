
import React, { useState, useCallback } from 'react';
import TickerSearch from './components/TickerSearch';
import PriceChart from './components/PriceChart';
import AnalysisReport from './components/AnalysisReport';
import SentimentAnalysis from './components/SentimentAnalysis';
import { analyzeStock, generateMockChartData } from './services/geminiService';
import { StockAnalysis, ChartDataPoint } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeStock(ticker);
      setAnalysis(result);
      setChartData(generateMockChartData(result.currentPrice));
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch analysis. Please ensure your ticker is correct and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 11 18-5v12L3 11Z"/><path d="M11.68 4v8"/><path d="M17.86 11v8"/><path d="M3 11v-1"/><path d="M21 11v1"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">QUANT<span className="text-blue-500">GEMINI</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">AI Market Intelligence</p>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
            <a href="#" className="text-blue-500">Analyzer</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Portfolio</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Insights</a>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Market Active
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Alpha</span> Signals
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Next-generation stock analysis combining real-time search grounding with institutional-grade reasoning.
          </p>
        </div>

        <TickerSearch onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-medium">
            {error}
          </div>
        )}

        {loading && !analysis && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Quantizing Market Data...</p>
            <p className="text-xs text-slate-600">Searching global news feeds and technical indicators</p>
          </div>
        )}

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Left Column: Price & Chart & Sentiment */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex items-end justify-between shadow-2xl backdrop-blur-sm">
                <div>
                  <h2 className="text-4xl font-black text-white">{analysis.ticker}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-wider">{analysis.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-mono font-bold text-white tracking-tighter">{analysis.currentPrice}</p>
                  <p className={`text-lg font-bold ${analysis.priceChange.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {analysis.priceChange} ({analysis.priceChangePercent})
                  </p>
                </div>
              </div>

              <PriceChart data={chartData} ticker={analysis.ticker} />

              <SentimentAnalysis sentiment={analysis.sentiment} />
              
              <div className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Executive Technical Summary</h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  {analysis.technicalSummary}
                </p>
              </div>
            </div>

            {/* Right Column: AI Strategy */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <AnalysisReport analysis={analysis} />
              </div>
            </div>
          </div>
        )}

        {!analysis && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 opacity-50">
            {[
              { title: "Technical Indicators", desc: "RSI, MACD, and Volume profile analysis with trend forecasting." },
              { title: "Sentiment Analysis", desc: "Real-time news processing to gauge institutional and retail buzz." },
              { title: "Entry/Exit Strategy", desc: "Calculated support/resistance zones for optimal trade execution." }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-slate-800 rounded-3xl bg-slate-900/20">
                <h4 className="font-bold text-slate-100 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 mt-32 py-12 text-center text-slate-600 text-sm font-medium">
        <p>&copy; 2024 QuantGemini Market Intelligence. For educational purposes only.</p>
        <p className="mt-2 px-8 max-w-3xl mx-auto text-xs leading-tight">
          Trading stocks involves significant risk. The AI-generated analysis is based on available public data and should not be considered financial advice. Always perform your own due diligence.
        </p>
      </footer>
    </div>
  );
};

export default App;
