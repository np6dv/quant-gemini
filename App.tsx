
import React, { useState, useCallback, useEffect } from 'react';
import TickerSearch from './components/TickerSearch';
import PriceChart from './components/PriceChart';
import AnalysisReport from './components/AnalysisReport';
import SentimentAnalysis from './components/SentimentAnalysis';
import { analyzeStock } from './services/geminiService';
import { StockAnalysis } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_tickers');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const handleSearch = useCallback(async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeStock(ticker);
      setAnalysis(result);
      
      // Update recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(t => t !== ticker.toUpperCase());
        const updated = [ticker.toUpperCase(), ...filtered].slice(0, 5);
        localStorage.setItem('recent_tickers', JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. This can happen if the ticker is invalid or API limits are reached.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 11 18-5v12L3 11Z"/><path d="M11.68 4v8"/><path d="M17.86 11v8"/><path d="M3 11v-1"/><path d="M21 11v1"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">QUANT<span className="text-blue-500">GEMINI</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">AI Market Intelligence</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
            {recentSearches.map(t => (
              <button 
                key={t}
                onClick={() => handleSearch(t)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
              >
                ${t}
              </button>
            ))}
          </div>

          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Live Engine
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
            Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Alpha</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Professional-grade equity analysis powered by Gemini 3 Reasoning.
          </p>
        </div>

        <TickerSearch onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-medium animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500/10 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-8 text-slate-400 font-bold uppercase tracking-widest text-sm">Quantizing {analysis?.ticker || 'Market Data'}...</p>
            <p className="mt-2 text-xs text-slate-600">Cross-referencing technical indicators and search grounding</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-5xl font-black text-white">{analysis.ticker}</h2>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-700">Stock</span>
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">{analysis.name}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-5xl font-mono font-bold text-white tracking-tighter">{analysis.currentPrice}</p>
                  <p className={`text-lg font-bold flex items-center md:justify-end gap-1 ${analysis.priceChange.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {analysis.priceChange.startsWith('-') ? '▼' : '▲'} {analysis.priceChange} ({analysis.priceChangePercent})
                  </p>
                </div>
              </div>

              <PriceChart data={analysis.history} ticker={analysis.ticker} />

              <SentimentAnalysis sentiment={analysis.sentiment} />
              
              <div className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-3xl group">
                <h3 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-4">Analyst Summary</h3>
                <p className="text-slate-300 leading-relaxed text-xl font-medium">
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
      </main>

      <footer className="border-t border-slate-900 mt-32 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex items-center justify-center gap-2 mb-6 opacity-40 grayscale">
             <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
             <div className="w-24 h-4 bg-slate-800 rounded-full"></div>
           </div>
           <p className="text-slate-600 text-sm font-medium">&copy; 2024 QuantGemini Intelligence. For research purposes only.</p>
           <p className="mt-4 px-8 max-w-3xl mx-auto text-[10px] text-slate-700 leading-relaxed uppercase tracking-widest">
             Data is sourced via Google Search and processed by AI. Significant financial risk is involved in trading. 
             This tool does not constitute financial advice or investment recommendations.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
