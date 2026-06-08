'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  Shield,
  Heart,
  Star,
  Award,
  Headphones,
  Package,
  CreditCard,
  ArrowRight,
  Smile,
  Zap,
  Leaf
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export default function AboutPage() {
  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: Smile },
    { value: '10K+', label: 'Products Sold', icon: Package },
    { value: '4.8', label: 'Customer Rating', icon: Star },
    { value: '24/7', label: 'Support', icon: Headphones }
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We never compromise on quality. Every product is thoroughly vetted.',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Customer Centric',
      description: 'Your satisfaction is our top priority. We\'re here for you 24/7.',
      icon: Heart,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Innovation',
      description: 'Constantly evolving to bring you the latest and greatest products.',
      icon: Zap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sustainable products.',
      icon: Leaf,
      color: 'from-green-500 to-green-600'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/api/placeholder/200/200',
      bio: '15+ years in ecommerce industry'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: '/api/placeholder/200/200',
      bio: 'Supply chain expert'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience',
      image: '/api/placeholder/200/200',
      bio: 'Passionate about customer service'
    },
    {
      name: 'David Kim',
      role: 'Tech Lead',
      image: '/api/placeholder/200/200',
      bio: 'Full-stack developer'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize online shopping' },
    { year: '2021', title: 'First Million Sales', description: 'Reached 1M in sales within first year' },
    { year: '2022', title: 'Expanded Globally', description: 'Started shipping to 50+ countries' },
    { year: '2023', title: '10K+ Products', description: 'Curated collection of premium products' },
    { year: '2024', title: 'Sustainable Future', description: 'Committed to eco-friendly practices' }
  ];

  return (
    <>
      
      <div className="bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-6">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  About ShopHub
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  {`We're on a mission to revolutionize online shopping by bringing you the best products at unbeatable prices.`}
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Our Story */}
        <div className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Story
                </h2>
                <div className="w-20 h-1 bg-blue-600 rounded mb-6" />
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {`Founded in 2020, ShopHub started with a simple idea: to create an online shopping experience that's 
                  convenient, reliable, and enjoyable for everyone. What began as a small team of passionate individuals 
                  has grown into a thriving ecommerce platform serving thousands of customers worldwide.`}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {`We believe that shopping should be more than just a transaction. It should be an experience that brings 
                  joy and satisfaction. That's why we carefully curate our product selection, ensuring that every item 
                  meets our high standards for quality and value.`}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {`Today, we're proud to offer over 10,000 products across multiple categories, serving customers in 
                  50+ countries. But we're just getting started. We're constantly innovating and expanding to bring 
                  you even better products and services.`}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Our Story"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <p className="text-white font-semibold">Our headquarters in New York</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose ShopHub?
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                {`We're committed to providing the best shopping experience possible`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
                { icon: Shield, title: 'Secure Payment', description: '100% secure transactions' },
                { icon: Heart, title: '30-Day Returns', description: 'Hassle-free returns' },
                { icon: Headphones, title: '24/7 Support', description: 'Dedicated support team' },
                { icon: Package, title: 'Quality Guarantee', description: 'All products vetted' },
                { icon: CreditCard, title: 'Best Prices', description: 'Price match guarantee' }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Milestones Timeline */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Key milestones in our journey so far
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200 dark:bg-blue-900" />
            
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 md:text-right px-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {milestone.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center my-4 md:my-0">
                    <span className="text-white font-bold">{milestone.year.slice(-2)}</span>
                  </div>
                  
                  <div className="flex-1 px-6">
                    <span className="text-sm text-blue-600 font-semibold">{milestone.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The passionate people behind ShopHub
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers and experience the best online shopping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}