'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import TestimonialsSkeleton from './TestimonialsSkeleton';

export default function TestimonialsSlider() {
  const { data: testimonials = [], isLoading, isError } = useTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);
  const [xOffset, setXOffset] = useState(360); // Default for SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setXOffset(window.innerWidth < 768 ? 240 : 360);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, testimonials.length]);

  if (!isMounted || isLoading) {
    return <TestimonialsSkeleton />;
  }

  if (isError || testimonials.length === 0) {
    return (
      <div className="text-center py-12 text-warm-gray">
        <p className="text-sm font-medium">No customer reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Slider Container */}
      <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[440px] pb-6">
        
        {/* Navigation Arrows */}
        {testimonials.length > 1 && (
          <>
            <div className="absolute left-0 md:left-4 lg:left-12 z-30">
              <button
                type="button"
                onClick={prevSlide}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-cloud flex items-center justify-center bg-white text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md group"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="absolute right-0 md:right-4 lg:right-12 z-30">
              <button
                type="button"
                onClick={nextSlide}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-cloud flex items-center justify-center bg-white text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md group"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </>
        )}

        {/* Cards Track */}
        <div className="relative flex items-center justify-center w-full h-[340px] md:h-[380px] overflow-visible">
          {testimonials.map((review, index) => {
            let position = index - activeIndex;
            if (position > 2) position -= testimonials.length;
            if (position < -2) position += testimonials.length;

            const isActive = position === 0;
            const isFar = Math.abs(position) === 2;
            const isNear = Math.abs(position) === 1;

            let opacity = 0;
            if (isActive) opacity = 1;
            else if (isNear) opacity = 0.6;
            else if (isFar) opacity = 0; // Hide completely if too far to keep it clean

            let scale = 0.7;
            if (isActive) scale = 1;
            else if (isNear) scale = 0.85;

            let zIndex = 5;
            if (isActive) zIndex = 20;
            else if (isNear) zIndex = 10;

            return (
              <motion.div
                key={review.id || review.name + index}
                initial={false}
                animate={{
                  scale,
                  x: position * xOffset,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 25,
                }}
                className={`absolute w-[280px] sm:w-[320px] md:w-[360px] h-full rounded-2xl p-6 sm:p-8 flex flex-col shadow-2xl ${
                  isActive ? 'bg-white border-2 border-primary shadow-glow' : 'bg-white/95 border border-cloud shadow-card pointer-events-none'
                }`}
              >
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl bg-primary-glow flex items-center justify-center mb-4 shrink-0">
                  <Quote size={18} className="text-primary" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-xs sm:text-sm text-warm-gray leading-relaxed mb-6 font-sans flex-1 overflow-hidden">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-cloud mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md">
                    {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-charcoal">{review.name}</p>
                    <p className="text-[10px] sm:text-xs text-text-muted">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 ${
                activeIndex === index 
                  ? 'w-12 h-2 bg-primary rounded-full' 
                  : 'w-3 h-2 bg-primary/30 rounded-full hover:bg-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
