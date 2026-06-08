'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Summer Collection 2024",
    subtitle: "Up to 50% off on selected items",
    ctaText: "Shop Now",
    ctaLink: "/products",
    bgColor: "from-purple-600 to-pink-600"
  },
  {
    id: 2,
    title: "Premium Electronics",
    subtitle: "Latest gadgets at best prices",
    ctaText: "Explore Deals",
    ctaLink: "/products?category=electronics",
    bgColor: "from-blue-600 to-cyan-600"
  },
  {
    id: 3,
    title: "Fashion Week Special",
    subtitle: "Limited time offers",
    ctaText: "View Collection",
    ctaLink: "/products?category=fashion",
    bgColor: "from-orange-600 to-red-600"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden bg-linear-to-r from-gray-900 to-gray-800">
      {slides.map((slide, idx) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 flex items-center bg-linear-to-r ${slide.bgColor}`}
          style={{ display: idx === currentSlide ? 'flex' : 'none' }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-white mb-4"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white/90 mb-8"
              >
                {slide.subtitle}
              </motion.p>
              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                onClick={() => window.location.href = slide.ctaLink}
              >
                {slide.ctaText}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white rotate-180" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}