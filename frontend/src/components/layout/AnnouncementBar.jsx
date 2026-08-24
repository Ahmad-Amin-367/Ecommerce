'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const announcements = [
  '🎁 Free gift wrapping on orders above $100',
  '✨ Customized edible arrangements available — order yours today',
  '🚚 Nationwide delivery across Canada',
  '💝 Personalize every gift — make it truly special',
];

export default function AnnouncementBar() {
  const [mounted, setMounted] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  // Auto-advance announcement
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextAnnouncement = () => setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
  const prevAnnouncement = () => setAnnouncementIdx((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <div className="bg-primary text-text-inverse relative h-9 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-3xl mx-auto relative flex items-center justify-between px-2 sm:px-4 h-full">
        <button
          onClick={prevAnnouncement}
          className="p-1 hover:bg-white/20 rounded-full transition-colors z-20 text-white cursor-pointer shrink-0"
          aria-label="Previous announcement"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 relative h-full flex items-center justify-center overflow-hidden px-4">
          {mounted && (
            <AnimatePresence mode="wait">
              <motion.div
                key={announcementIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap absolute"
              >
                {announcements[announcementIdx]}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <button
          onClick={nextAnnouncement}
          className="p-1 hover:bg-white/20 rounded-full transition-colors z-20 text-white cursor-pointer shrink-0"
          aria-label="Next announcement"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
