
import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';

// Using local SVG icons as Lucide might not be available
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

interface TickerSearchProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

const TickerSearch: React.FC<TickerSearchProps> = ({ onSearch, isLoading }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className={`${isLoading ? 'animate-spin' : ''} text-slate-400 group-focus-within:text-blue-500 transition-colors`}>
            <SearchIcon />
          </span>
        </div>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter ticker (e.g. NVDA, TSLA, BTC)..."
          disabled={isLoading}
          className="block w-full pl-12 pr-24 py-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-xl font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 text-slate-100 backdrop-blur-xl shadow-2xl"
        />
        <button
          type="submit"
          disabled={isLoading || !ticker.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      <div className="mt-4 flex gap-3 justify-center">
        {['NVDA', 'AAPL', 'MSFT', 'BTC'].map((t) => (
          <button
            key={t}
            onClick={() => { setTicker(t); onSearch(t); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 transition-all text-slate-400 hover:text-slate-200"
          >
            ${t}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TickerSearch;
