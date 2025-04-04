import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();

    // Check if we hit the API limit first
    if (data.Note && data.Note.includes('API rate limit')) {
      return NextResponse.json(
        { 
          error: 'Daily API call limit reached (25 requests per day). Please try again tomorrow or use a different API key.',
          isRateLimit: true 
        },
        { status: 429 }
      );
    }

    // Check if the response contains valid data
    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      return NextResponse.json(
        { error: `No data found for symbol "${symbol}". Please check if the symbol is correct.` },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock data. Please try again later.' },
      { status: 500 }
    );
  }
} 