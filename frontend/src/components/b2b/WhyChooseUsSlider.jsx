'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const sliderImages = [
  {
    src: '/products/prod-2.jpg',
    alt: 'Luxury Gold & Emerald Wedding Fruit Table Display',
    title: '4ft-6ft Fruit Table Setup',
  },
  {
    src: '/products/prod-1.jpg',
    alt: 'Handcrafted Chocolate Covered Strawberry Tower',
    title: 'Strawberry & Chocolate Towers',
  },
  {
    src: '/products/prod-3.jpg',
    alt: 'Live Dip Chocolate Station & Fresh Fruit Platter',
    title: 'Live Dipping Stations',
  },
  {
    src: '/products/prod-4.jpg',
    alt: 'Gourmet Charcuterie & Artisanal Fruit Basket',
    title: 'Gourmet Platter Trays',
  },
  {
    src: '/products/prod-6.jpg',
    alt: 'Custom Corporate Logo Plaques & Dipped Arrangement',
    title: 'Corporate Logo Plaques',
  },
];

export default function WhyChooseUsSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'center',
      loop: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: 3500, stopOnInteraction: false, pauseOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full py-4">
      {/* Embla Carousel Viewport with Centered Slides */}
      <div className="relative max-w-6xl mx-auto px-2 sm:px-10">
        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl">
          <div className="flex -ml-4 sm:-ml-6 items-center py-4">
            {sliderImages.map((item, idx) => (
              <div
                key={idx}
                className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_52%] lg:flex-[0_0_46%] min-w-0 pl-4 sm:pl-6"
              >
                <div className="relative h-64 sm:h-80 md:h-[380px] w-full rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 group">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 550px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="font-serif text-xs sm:text-sm font-semibold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist White Chevron Arrows (Exact like reference image) */}
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 text-white hover:text-emerald-200 transition-all duration-200 flex items-center justify-center cursor-pointer z-20 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={42} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 text-white hover:text-emerald-200 transition-all duration-200 flex items-center justify-center cursor-pointer z-20 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={42} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
