'use client';
import { motion } from 'framer-motion';

export function BrandShowcase() {
  const brands = [
    { name: "Nike", logo: "/api/placeholder/120/60" },
    { name: "Apple", logo: "/api/placeholder/120/60" },
    { name: "Samsung", logo: "/api/placeholder/120/60" },
    { name: "Sony", logo: "/api/placeholder/120/60" },
    { name: "Adidas", logo: "/api/placeholder/120/60" },
    { name: "LG", logo: "/api/placeholder/120/60" }
  ];

  return (
    <div className="py-16 border-y border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
        >
          {brands.map((brand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 object-contain mx-auto"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}