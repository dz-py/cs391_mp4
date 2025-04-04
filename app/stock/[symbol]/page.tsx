import StockDisplay from './StockDisplay';

interface PageProps {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <StockDisplay symbol={resolvedParams.symbol} />;
} 