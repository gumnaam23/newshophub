import { Suspense } from 'react';
import { Metadata } from 'next';
import Loader from '@/app/components/ui/Loader';
import { HeroSection } from '@/app/components/home/HeroSection';
import { FeaturesSection } from '@/app/components/home/FeaturesSection';
import { CategoriesSection } from '@/app/components/home/CategoriesSection';
import { PromoBanner } from '@/app/components/home/PromoBanner';
import { FeaturedProductsSection } from '@/app/components/home/FeaturedProductsSection';
import { NewArrivalsSection } from '@/app/components/home/NewArrivalsSection';
import { BestSellersSection } from '@/app/components/home/BestSellersSection';
import { BrandShowcase } from '@/app/components/home/BrandShowcase';
import { TestimonialsSection } from '@/app/components/home/TestimonialsSection';
import { NewsletterSection } from '@/app/components/home/NewsletterSection';
import { CartNotification } from './components/ui/CartNotification';

export const metadata: Metadata = {
  title: 'Home | Your Store',
  description: 'Discover amazing products at great prices',
};

async function getHomeData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const [featuredRes, newRes, bestRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?isFeatured=true&limit=8`, { 
        next: { revalidate: 3600 }
      }),
      fetch(`${baseUrl}/api/products?isNew=true&limit=8`, {
        next: { revalidate: 3600 }
      }),
      fetch(`${baseUrl}/api/products?rating=4.5&limit=8`, {
        next: { revalidate: 3600 }
      }),
      fetch(`${baseUrl}/api/categories?limit=4`, {
        next: { revalidate: 3600 }
      }),
    ]);

    const featuredData = await featuredRes.json();
    const newData = await newRes.json();
    const bestData = await bestRes.json();
    const categoriesData = await categoriesRes.json();

    return {
      featuredProducts: featuredData.success ? featuredData.data : [],
      newArrivals: newData.success ? newData.data : [],
      bestSellers: bestData.success ? bestData.data : [],
      categories: categoriesData.success ? categoriesData.data : [],
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      featuredProducts: [],
      newArrivals: [],
      bestSellers: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { featuredProducts, newArrivals, bestSellers, categories } = await getHomeData();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection initialCategories={categories} />
        <PromoBanner />
        <FeaturedProductsSection initialProducts={featuredProducts} />
        <NewArrivalsSection initialProducts={newArrivals} />
        <BestSellersSection initialProducts={bestSellers} />
        <BrandShowcase />
        <TestimonialsSection />
        <NewsletterSection />
      </Suspense>
      <CartNotification />
    </>
  );
}