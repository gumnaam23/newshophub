'use client';

import { useState } from 'react';

interface ProductImagesProps {
  images: string[];
  productName: string;
  onImageClick: (index: number) => void;
}

export default function ProductImages({ images, productName, onImageClick }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <div>
      <div className="relative">
        {/* Main Image */}
        <div 
          className="aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
          onClick={() => onImageClick(selectedImage)}
        >
          <img
            src={images[selectedImage] || '/api/placeholder/600/600'}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => handleImageSelect(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImage === idx
                    ? 'border-blue-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}