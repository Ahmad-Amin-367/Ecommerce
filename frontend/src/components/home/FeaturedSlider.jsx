'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';

export default function FeaturedSlider() {
  const { data: productsData, isLoading, isError } = useProducts({ isFeatured: true, limit: 12 });
  const products = productsData?.data || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, pauseOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (isError) {
    return (
      <div className="text-center py-8 text-error">
        <p>Failed to load featured products. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Handpicked for you
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
              Featured Products
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="relative w-full">
      <style jsx global>{`
        .featured-slider {
          display: flex;
          gap: 1rem; /* 16px */
        }
        .featured-slide {
          flex: 0 0 45%; /* mobile 2 cards + peek */
          min-width: 0;
        }
        @media (min-width: 640px) {
          .featured-slider {
            gap: 1.5rem; /* 24px */
          }
          .featured-slide {
            flex: 0 0 40%;
          }
        }
        @media (min-width: 768px) {
          .featured-slide {
            flex: 0 0 33.333%;
          }
        }
        @media (min-width: 1024px) {
          .featured-slide {
            flex: 0 0 25%;
          }
        }
      `}</style>

      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
            Handpicked for you
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
            Featured Products
          </h2>
        </div>

        <div className="flex items-center gap-6 self-start md:self-end">
          <Link
            href="/products?isFeatured=true"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
          >
            View All <ArrowRight size={16} />
          </Link>
          
          {/* Navigation Arrows (Desktop mostly) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-white border-2 border-cloud text-charcoal hover:border-primary hover:text-primary transition-all hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            <button
              onClick={scrollNext}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-primary border-2 border-primary text-white hover:bg-primary-dark hover:border-primary-dark transition-all hover:scale-105 active:scale-95 shadow-glow"
              aria-label="Next slide"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Embla Viewport */}
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing w-full pb-8 pt-2 -mt-2">
        <div className="featured-slider">
          {products.map((product) => (
            <div key={product.id} className="featured-slide">
              <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rectangular Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6">
        {scrollSnaps.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              type="button"
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                isActive ? 'w-12 bg-primary' : 'w-3 bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
