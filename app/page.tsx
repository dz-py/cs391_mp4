'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Navigate to the stock details page
      router.push(`/stock/${symbol}`);
    } catch {
      setError('Failed to navigate to stock page');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Stock Market Tracker</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="text-red-600 font-medium mb-4">{error}</div>
          )}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Popular Stocks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'].map((ticker) => (
              <button
                key={ticker}
                onClick={() => {
                  setSymbol(ticker);
                  router.push(`/stock/${ticker}`);
                }}
                className="p-4 border border-gray-200 rounded-lg text-gray-800 font-medium hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
