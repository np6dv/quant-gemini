
import React from 'react';
import { StockAnalysis } from '../types';

const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
);

interface SentimentAnalysisProps {
  sentiment: StockAnalysis['sentiment'];
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'Positive': return 'text-emerald-400';
      case 'Negative': return 'text-rose-400';
      default: return 'text-amber-400';
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <NewsIcon />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-100">News Sentiment</h4>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Market Buzz & Headlines</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className={`text-2xl font-black ${getSentimentColor(sentiment.label)}`}>{sentiment.label}</p>
            <div className="w-32 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  sentiment.score > 60 ? 'bg-emerald-500' : sentiment.score < 40 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${sentiment.score}%` }}
              ></div>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase">AI Score</p>
            <p className="text-xl font-mono font-bold text-slate-100">{sentiment.score}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h5 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Recent Headlines</h5>
          <div className="space-y-4">
            {sentiment.headlines.map((item, idx) => (
              <div key={idx} className="group p-4 bg-slate-950/40 border border-slate-800/40 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.source}</span>
                    <span className="text-[9px] text-slate-600 font-medium">{item.date}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${getImpactColor(item.impact)}`}>
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl">
          <h5 className="text-xs font-bold text-indigo-400 uppercase mb-4 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Short-Term Outlook
          </h5>
          <p className="text-slate-300 leading-relaxed italic">
            "{sentiment.shortTermOutlook}"
          </p>
          <div className="mt-6 pt-6 border-t border-indigo-500/10">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Sentiment Analysis Logic</p>
            <p className="text-xs text-slate-400">
              Our AI evaluates volume of mentions, choice of terminology, publication dates, and historical price correlation of similar news events to derive this outlook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
