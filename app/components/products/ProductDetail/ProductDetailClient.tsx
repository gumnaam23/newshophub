'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

import Breadcrumb from '@/app/components/products/ProductDetail/Breadcrumb';
import ProductImages from '@/app/components/products/ProductDetail/ProductImages';
import ProductInfo from '@/app/components/products/ProductDetail/ProductInfo';
import ProductActions from '@/app/components/products/ProductDetail/ProductActions';
import ProductTabs from '@/app/components/products/ProductDetail/ProductTabs';
import RelatedProducts from '@/app/components/products/ProductDetail/RelatedProducts';
import ImageModal from '@/app/components/products/ProductDetail/ImageModal';

import Link from 'next/link';
import { IProduct } from '@/models/Product';
import { IReview } from '@/type';
import { CartNotification } from '../../ui/CartNotification';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [productRes, relatedRes, reviewsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/products/${productId}/related`),
          fetch(`/api/products/${productId}/reviews`)
        ]);

        const productData = await productRes.json();
        const relatedData = await relatedRes.json();
        const reviewsData = await reviewsRes.json();

        if (productData.success) {
          setProduct(productData.data);
        } else {
          router.push('/products');
        }

        if (relatedData.success) {
          setRelatedProducts(relatedData.data);
        }

        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = async (quantity: number, size: string | null, color: string | null) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (product?.stock === 0) {
      showNotification('Product is out of stock', 'error');
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?._id,
          quantity,
          size,
          color
        })
      });

      const data = await response.json();

      if (data.success) {
        showNotification(`${product?.name} added to cart!`, 'success');
      } else {
        showNotification(data.error || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      showNotification('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setAddingToWishlist(true);

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product?._id })
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Added to wishlist!', 'success');
      } else {
        showNotification(data.error || 'Failed to add to wishlist', 'error');
      }
    } catch (error) {
      showNotification('Failed to add to wishlist', 'error');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name}`,
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const refreshReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const handlePrevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
    }
  };

  const handleNextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {`The product you're looking for doesn't exist or has been removed.`}
          </p>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb category={product.category} productName={product.name} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductImages
              images={product.images}
              productName={product.name}
              onImageClick={(index) => {
                setSelectedImageIndex(index);
                setShowImageModal(true);
              }}
            />

            <div>
              <ProductInfo product={product} discount={discount} />
              <ProductActions
                productId={product._id}
                stock={product.stock}
                sizes={product.sizes}
                colors={product.colors}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onShare={handleShare}
                isAddingToCart={addingToCart}
                isAddingToWishlist={addingToWishlist}
              />
            </div>
          </div>

          <ProductTabs
            product={product}
            reviews={reviews}
            productId={product._id}
            onReviewSubmitted={refreshReviews}
          />

          <RelatedProducts products={relatedProducts} />
        </div>
      </div>

      <ImageModal
        isOpen={showImageModal}
        images={product.images}
        selectedIndex={selectedImageIndex}
        productName={product.name}
        onClose={() => setShowImageModal(false)}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />

      <CartNotification show={notification.show} message={notification.message} type={notification.type} />
    </>
  );
}