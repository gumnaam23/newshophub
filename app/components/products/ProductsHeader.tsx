'use client';

interface ProductsHeaderProps {
  title: string;
  totalProducts: number;
}

export default function ProductsHeader({ title, totalProducts }: ProductsHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
        <p className="text-white/90 text-lg">{totalProducts} products found</p>
      </div>
    </div>
  );
}