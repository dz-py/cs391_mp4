import StockDisplay from './StockDisplay';

export default function Page({ params }: { params: { symbol: string } }) {
  return <StockDisplay symbol={params.symbol} />;
} 