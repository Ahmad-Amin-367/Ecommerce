'use client';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/store/animationStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';

export default function FloatingQueueTab() {
  const tabVisible = useAnimationStore((s) => s.tabVisible);
  const setTargetRect = useAnimationStore((s) => s.setTargetRect);
  const hideTab = useAnimationStore((s) => s.hideTab);
  const items = useCartStore((s) => s.items) || [];
  const openCart = useCartStore((s) => s.openCart);
  const tabRef = useRef(null);

  // Update target rect for flying items
  useEffect(() => {
    if (tabVisible && tabRef.current) {
      const timeout = setTimeout(() => {
        setTargetRect(tabRef.current.getBoundingClientRect());
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [tabVisible, items.length, setTargetRect]);

  const displayItems = items.slice(-4); // Last 4 items
  const extraCount = Math.max(0, items.length - 4);

  return (
    <AnimatePresence>
      {tabVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] rounded-full p-2 border border-cloud pointer-events-auto"
        >
          {/* Cart Icon / Open Trigger */}
          <button 
            className="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center text-primary shrink-0 mr-3 ml-1 hover:bg-primary hover:text-white transition-colors cursor-pointer"
            onClick={() => {
              openCart();
              hideTab();
            }}
            aria-label="Open Cart"
          >
            <ShoppingCart size={18} />
          </button>

          {/* Queue of Icons */}
          <div className="flex items-center -space-x-3 mr-3" ref={tabRef}>
            <AnimatePresence mode="popLayout">
              {displayItems.map((item, idx) => (
                <motion.div
                  key={item.product?.id || item.id || idx}
                  layout
                  initial={{ scale: 0, opacity: 0, x: -20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="w-10 h-10 rounded-full border-2 border-white bg-cream overflow-hidden shadow-sm relative z-10"
                >
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">🎁</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {extraCount > 0 && (
              <motion.div 
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full border-2 border-white bg-cloud flex items-center justify-center text-xs font-bold text-charcoal shadow-sm relative z-20"
              >
                +{extraCount}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
