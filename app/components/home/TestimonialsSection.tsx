'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
    const testimonials = [
        {
            id: 1,
            name: "John Doe",
            role: "Verified Buyer",
            content: "Amazing products and excellent customer service! Highly recommended!",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces"
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "Regular Customer",
            content: "Fast shipping and great quality. Will definitely shop again!",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces"
        },
        {
            id: 3,
            name: "Mike Johnson",
            role: "Tech Enthusiast",
            content: "Best prices I've found online. The products are genuine and well-packaged.",
            rating: 4,
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces"
        }
    ];
    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust us for their shopping needs
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < testimonial.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                {`"${testimonial.content}"`}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}