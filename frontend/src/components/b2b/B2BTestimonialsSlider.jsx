'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const b2bTestimonials = [
  {
    quote: "Hisna Gifts made our wedding reception absolutely unforgettable! The fruit table was beyond beautiful, and our guests are still talking about it. The team was professional, on time, and so easy to work with. Highly recommend!",
    author: "Sarah & Ahmed",
    context: "Married April 2024 • Toronto, ON",
    rating: 5,
  },
  {
    quote: "The custom logo fruit platters and live dipping station were the highlights of our annual corporate gala. Extremely professional service, fresh and delicious presentation. Our clients were thoroughly impressed!",
    author: "Marcus Vance",
    context: "VP of Events, Techcorp • Mississauga, ON",
    rating: 5,
  },
  {
    quote: "We ordered 150 custom-branded chocolate strawberry boxes for our holiday client gifts. The team handled the individual GTA deliveries flawlessly, and the feedback from our clients was outstanding. A perfect corporate partner!",
    author: "Jessica L.",
    context: "Operations Manager, Apex Legal • Toronto, ON",
    rating: 5,
  },
];

export default function B2BTestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? b2bTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === b2bTestimonials.length - 1 ? 0 : prev + 1));
  };

  const current = b2bTestimonials[index];

  // Framer Motion animation variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative bg-[#f4f7f5] border border-[#e2ece5] rounded-[32px] p-8 sm:p-10 shadow-soft overflow-hidden h-[300px] sm:h-[280px] lg:h-[320px] flex flex-col justify-between group">
      {/* Background Quotes Symbol */}
      <div className="absolute top-4 left-6 text-7xl text-[#325247]/10 font-serif leading-none select-none z-0">
        “
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col justify-center overflow-hidden z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full text-center flex flex-col justify-center items-center"
          >
            <p className="text-xs sm:text-sm text-[#2c3e35] leading-relaxed italic max-w-lg">
              "{current.quote}"
            </p>

            {/* Heart Separator */}
            <div className="flex items-center justify-center gap-1.5 my-3">
              <div className="h-[1px] w-6 bg-[#325247]/10" />
              <Heart size={10} className="text-[#325247]/60 fill-[#325247]/60 shrink-0" />
              <div className="h-[1px] w-6 bg-[#325247]/10" />
            </div>

            <div className="text-center space-y-0.5">
              <h4 className="text-xs font-bold text-[#325247]">{current.author}</h4>
              <p className="text-[9px] text-warm-gray">{current.context}</p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-0.5 pt-1.5">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} size={12} className="text-[#c5a059] fill-[#c5a059]" />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow Controls (visible on hover) */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-[#e2ece5] flex items-center justify-center text-[#325247] opacity-0 group-hover:opacity-100 transition-all hover:bg-white cursor-pointer z-20"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-[#e2ece5] flex items-center justify-center text-[#325247] opacity-0 group-hover:opacity-100 transition-all hover:bg-white cursor-pointer z-20"
        aria-label="Next testimonial"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-2 z-10">
        {b2bTestimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              i === index ? 'bg-[#325247] scale-125' : 'bg-[#325247]/20 hover:bg-[#325247]/40'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
