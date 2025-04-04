'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ErrorResponse {
  error: string;
  isRateLimit?: boolean;
}

interface StockData {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

interface PageProps {
  params: {
    symbol: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function StockPage({ params, searchParams }: PageProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`/api/stock?symbol=${params.symbol}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data);
          return;
        }
        
        setStockData(data);
      } catch {
        setError({ error: 'Failed to fetch stock data. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [params.symbol]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-red-600 font-medium mb-6 text-xl">{error.error}</div>
            {error.isRateLimit ? (
              <div className="text-gray-600 mb-6">
                <p className="mb-2">The free API tier is limited to 25 requests per day.</p>
                <p className="mb-4">Options:</p>
                <ul className="list-disc list-inside mb-4">
                  <li>Try again tomorrow when the limit resets</li>
                  <li>Get a new API key from <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Alpha Vantage</a></li>
                  <li>Upgrade to a premium plan to remove the limit</li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                Please check if the symbol is correct and try again.
              </p>
            )}
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Search
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">{params.symbol} Stock Information</h1>
        
        {stockData && stockData['Global Quote'] && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Current Quote</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-lg font-semibold text-gray-900">${parseFloat(stockData['Global Quote']['05. price']).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Change:</span>
                  <span className={`text-lg font-semibold ${parseFloat(stockData['Global Quote']['09. change']) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${parseFloat(stockData['Global Quote']['09. change']).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Change Percent:</span>
                  <span className={`text-lg font-semibold ${parseFloat(stockData['Global Quote']['10. change percent'].replace('%', '')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockData['Global Quote']['10. change percent']}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Volume:</span>
                  <span className="text-lg font-semibold text-gray-900">{parseInt(stockData['Global Quote']['06. volume']).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Latest Trading Day:</span>
                  <span className="text-lg font-semibold text-gray-900">{stockData['Global Quote']['07. latest trading day']}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Trading Range</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Open:</span>
                  <span className="text-lg font-semibold text-gray-900">${parseFloat(stockData['Global Quote']['02. open']).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">High:</span>
                  <span className="text-lg font-semibold text-gray-900">${parseFloat(stockData['Global Quote']['03. high']).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Low:</span>
                  <span className="text-lg font-semibold text-gray-900">${parseFloat(stockData['Global Quote']['04. low']).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Previous Close:</span>
                  <span className="text-lg font-semibold text-gray-900">${parseFloat(stockData['Global Quote']['08. previous close']).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 