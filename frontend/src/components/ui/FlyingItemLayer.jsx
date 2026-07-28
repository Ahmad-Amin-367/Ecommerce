'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/store/animationStore';
import { useEffect, useState } from 'react';

export default function FlyingItemLayer() {
  const flyingItems = useAnimationStore((s) => s.flyingItems);
  const targetRect = useAnimationStore((s) => s.targetRect);
  const removeFlyingItem = useAnimationStore((s) => s.removeFlyingItem);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Default target if tab hasn't rendered yet (bottom center)
  const defaultTarget = {
    x: windowDimensions.width / 2,
    y: windowDimensions.height - 40,
  };

  const destination = targetRect ? {
    x: targetRect.x + targetRect.width / 2,
    y: targetRect.y + targetRect.height / 2,
  } : defaultTarget;

  if (flyingItems.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[500] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => {
          // Fallback if startRect is missing for some reason
          const startX = item.startRect?.x ? item.startRect.x + item.startRect.width / 2 - 24 : windowDimensions.width / 2;
          const startY = item.startRect?.y ? item.startRect.y + item.startRect.height / 2 - 24 : windowDimensions.height / 2;
          
          return (
            <motion.div
              key={item.id}
              initial={{ 
                x: startX, 
                y: startY,
                scale: 1,
                opacity: 1
              }}
              animate={{ 
                x: destination.x - 24, 
                y: destination.y - 24,
                scale: 0.3,
                opacity: 0.5
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.7,
                ease: [0.32, 0.72, 0, 1] // Custom ease out cubic for nice arc feel
              }}
              onAnimationComplete={() => removeFlyingItem(item.id)}
              className="absolute w-12 h-12 rounded-full border-2 border-primary bg-white overflow-hidden shadow-glow z-[500]"
            >
              {item.product?.images?.[0] ? (
                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs">🎁</div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
