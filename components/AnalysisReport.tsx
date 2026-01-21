
import React from 'react';
import { StockAnalysis } from '../types';

const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);

interface AnalysisReportProps {
  analysis: StockAnalysis;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis }) => {
  const isBullish = analysis.momentum.trend === 'Bullish';

  return (
    <div className="space-y-6">
      {/* Momentum Banner */}
      <div className={`p-6 rounded-3xl border ${isBullish ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Current Sentiment</h3>
          <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${isBullish ? 'bg-emerald-500 text-emerald-950' : 'bg-rose-500 text-rose-950'}`}>
            {analysis.momentum.trend}
          </span>
        </div>
        <p className="text-lg font-medium text-slate-200 leading-relaxed">
          {analysis.momentum.description}
        </p>
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ArrowUpIcon />
            </div>
            <h4 className="font-bold text-slate-100">Optimal Entry & Targets</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Entry Point</p>
              <p className="text-2xl font-mono font-bold text-blue-400">{analysis.strategy.entryPoint}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Profit Target</p>
              <p className="text-2xl font-mono font-bold text-emerald-400">{analysis.strategy.takeProfit}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <ArrowDownIcon />
            </div>
            <h4 className="font-bold text-slate-100">Risk Management</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Stop Loss</p>
              <p className="text-2xl font-mono font-bold text-rose-500">{analysis.strategy.stopLoss}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Exit Rationale</p>
              <p className="text-sm text-slate-400 italic line-clamp-2">{analysis.strategy.downsideExit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators Section */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl">
        <h4 className="text-lg font-bold mb-6 text-slate-100 flex items-center gap-2">
          Technical Deep Dive
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { label: 'RSI (Relative Strength)', value: analysis.indicators.rsi },
            { label: 'MACD Momentum', value: analysis.indicators.macd },
            { label: 'Moving Averages', value: analysis.indicators.movingAverages },
            { label: 'Volume Profile', value: analysis.indicators.volumeProfile },
            { label: 'Short Interest', value: analysis.indicators.shortInterest },
            { label: 'Strategic Rationale', value: analysis.strategy.rationale }
          ].map((item, idx) => (
            <div key={idx} className="border-l-2 border-slate-800 pl-4">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      {analysis.sources && analysis.sources.length > 0 && (
        <div className="pt-4">
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Grounding Sources</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.sources.map((src, i) => (
              <a
                key={i}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 px-3 py-1 rounded-full text-slate-400 hover:text-blue-400 transition-colors"
              >
                {src.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
