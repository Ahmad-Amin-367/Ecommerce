'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Cake, Heart, Moon, Gift, Pencil, Flower, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/home/ScrollReveal';

const categories = [
  { name: 'Birthday Gifts', slug: 'birthday', icon: Cake, color: 'bg-[#FDF3F0]', accent: 'text-[#C46D52]', description: 'Make birthdays extra special' },
  { name: 'Anniversary', slug: 'anniversary', icon: Heart, color: 'bg-[#FDF3F0]', accent: 'text-[#C46D52]', description: 'Celebrate your beautiful journey' },
  { name: 'Eid Special', slug: 'eid-special', icon: Moon, color: 'bg-[#E4E9E2]', accent: 'text-[#63765A]', description: 'Share sweetness this Eid' },
  { name: 'Thank You', slug: 'thank-you', icon: Gift, color: 'bg-[#FDF3F0]', accent: 'text-[#C46D52]', description: 'Show your gratitude in a delicious way' },
  { name: 'Custom Gifts', slug: 'custom', icon: Pencil, color: 'bg-[#E4E9E2]', accent: 'text-[#63765A]', description: 'Personalize your perfect gift' },
  { name: 'Just Because', slug: 'just-because', icon: Flower, color: 'bg-[#FDF3F0]', accent: 'text-[#C46D52]', description: 'Brighten someone\'s day, any day' },
];

export default function CategorySlider() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Buttons - Hidden on mobile, always visible on desktop when active */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-white border-2 border-cloud text-warm-gray cursor-pointer transition-all duration-300 shadow-sm z-10 
          ${canScrollLeft ? 'opacity-100 hover:bg-primary hover:border-primary hover:text-white hover:scale-105 hover:shadow-glow active:scale-95' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-white border-2 border-cloud text-warm-gray cursor-pointer transition-all duration-300 shadow-sm z-10 
          ${canScrollRight ? 'opacity-100 hover:bg-primary hover:border-primary hover:text-white hover:scale-105 hover:shadow-glow active:scale-95' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll right"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth"
      >
        {categories.map((cat, index) => (
          <ScrollReveal key={cat.slug} delay={index * 50} className="snap-start shrink-0 w-[260px] lg:w-[280px]">
            <Link
              href={`/category/${cat.slug}`}
              className="group/card flex flex-row items-center gap-4 p-4 lg:p-5 rounded-[20px] bg-white border border-cloud transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-primary/30 h-full"
            >
              <div className={`w-[52px] h-[68px] lg:w-[60px] lg:h-[80px] shrink-0 rounded-[26px] lg:rounded-[30px] ${cat.color} flex items-center justify-center transition-transform duration-300 group-hover/card:scale-105`}>
                <cat.icon size={24} className={cat.accent} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <span className="text-[13px] lg:text-[14px] font-bold text-charcoal mb-1 leading-tight">{cat.name}</span>
                <span className="text-[11px] lg:text-[12px] text-warm-gray leading-snug mb-2 line-clamp-2 pr-1">{cat.description}</span>
                <ArrowRight size={14} className="text-warm-gray transition-transform duration-300 group-hover/card:translate-x-1 group-hover/card:text-primary mt-auto" />
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
