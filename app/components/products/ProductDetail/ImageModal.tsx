'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  selectedIndex: number;
  productName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageModal({
  isOpen,
  images,
  selectedIndex,
  productName,
  onClose,
  onPrev,
  onNext,
}: ImageModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={images[selectedIndex]}
            alt={productName}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}