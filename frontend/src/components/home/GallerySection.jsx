'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/home/ScrollReveal';

const galleryItems = [
  // Row 1: 3-col + 5-col + 4-col = 12 cols
  {
    src: '/products/prod-1.jpg',
    alt: 'Handcrafted anniversary fruit arrangement',
    title: 'Anniversary Fruit Arrangements',
    spanClass: 'col-span-1 sm:col-span-1 lg:col-span-3',
    heightClass: 'h-[220px] sm:h-[260px] lg:h-[295px]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 320px',
    delay: 0.1,
  },
  {
    src: '/products/prod-2.jpg',
    alt: 'Premium chocolate dipped strawberries',
    title: 'Chocolate Dipped Strawberries',
    spanClass: 'col-span-1 sm:col-span-1 lg:col-span-5',
    heightClass: 'h-[220px] sm:h-[260px] lg:h-[295px]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 42vw, 530px',
    delay: 0.2,
  },
  {
    src: '/products/prod-3.jpg',
    alt: 'Birthday celebration fruit platter',
    title: 'Birthday Celebration Platters',
    spanClass: 'col-span-1 sm:col-span-2 lg:col-span-4',
    heightClass: 'h-[220px] sm:h-[260px] lg:h-[295px]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 33vw, 420px',
    delay: 0.3,
  },
  // Row 2: 5-col + 4-col + 3-col = 12 cols
  {
    src: '/products/prod-4.jpg',
    alt: 'Exotic fruit gift basket',
    title: 'Exotic Gift Baskets',
    spanClass: 'col-span-1 sm:col-span-1 lg:col-span-5',
    heightClass: 'h-[220px] sm:h-[260px] lg:h-[295px]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 42vw, 530px',
    delay: 0.4,
  },
  {
    src: '/products/prod-5.jpg',
    alt: 'Corporate event fruit arrangement',
    title: 'Custom Gift Boxes',
    spanClass: 'col-span-1 sm:col-span-1 lg:col-span-4',
    heightClass: 'h-[220px] sm:h-[260px] lg:h-[295px]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 420px',
    delay: 0.5,
  },
  {
    src: '/products/prod-6.jpg',
    alt: 'Seasonal special gift box',
    title: 'Seasonal Specials',
    spanClass: 'col-span-1 sm:col-span-2 lg:col-span-3',
    heightClass: 'h-[220px] sm:h-[260px] lg:h-[295px]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 25vw, 320px',
    delay: 0.6,
  },
];

export default function GallerySection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="w-full max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Our Creations
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal mb-3">
              Crafted With Love
            </h2>
            <p className="text-sm text-warm-gray max-w-md mx-auto">
              Every arrangement is handcrafted to perfection — a feast for the eyes before it becomes a feast for the soul.
            </p>
          </div>
        </ScrollReveal>

        {/* 6-Card Grid matching exact reference layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
          {galleryItems.map((item) => (
            <div key={item.src} className={`${item.spanClass}`}>
              <div className={`group relative overflow-hidden rounded-none ${item.heightClass} shadow-md hover:shadow-xl transition-shadow duration-300 bg-cloud/40`}>
                
                {/* 0-to-Full Width Curtain Reveal Overlay */}
                <motion.div
                  initial={{ width: '100%' }}
                  whileInView={{ width: '0%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1], delay: item.delay }}
                  className="absolute inset-0 bg-[#FAF7F2] z-20 pointer-events-none origin-right"
                />

                {/* Inner Image with Scale Reveal */}
                <motion.div
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, ease: 'easeOut', delay: item.delay }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes={item.sizes}
                  />
                </motion.div>

                {/* Gradient Hover Overlay — appears on hover with smaller text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-5 z-10">
                  <p className="text-white font-sans text-xs sm:text-sm font-medium tracking-wide drop-shadow-sm">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={450}>
          <div className="text-center mt-10">
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-primary-dark hover:shadow-glow hover:-translate-y-[2px]"
            >
              Explore All Gifts
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
