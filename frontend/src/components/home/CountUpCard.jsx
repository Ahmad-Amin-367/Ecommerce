'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * CountUpCard — Animated stat card that counts from 0 to the target number
 * when scrolled into view. Uses IntersectionObserver + requestAnimationFrame.
 */
export default function CountUpCard({ icon: Icon, value, suffix = '', label, color, delay = 0 }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse the numeric part from the value (e.g. "2,000" → 2000)
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;

  const animate = useCallback(() => {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numericValue);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [numericValue]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Delay start for staggered effect
          setTimeout(() => animate(), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, delay, hasAnimated]);

  // Format number with commas
  const formattedValue = displayValue.toLocaleString();

  return (
    <div
      ref={ref}
      className="stat-card group bg-white rounded-2xl border border-cloud p-6 sm:p-8 flex flex-col items-center text-center gap-3 transition-all duration-500 hover:shadow-lifted hover:-translate-y-1 hover:border-primary/20"
      style={{
        opacity: hasAnimated ? 1 : 0,
        transform: hasAnimated ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${color || 'bg-primary-glow'}`}>
        <Icon size={24} className="text-primary" strokeWidth={1.5} />
      </div>

      {/* Animated Number */}
      <div className="flex items-baseline gap-0.5">
        <span className="text-3xl sm:text-4xl font-bold text-charcoal font-serif tabular-nums">
          {formattedValue}
        </span>
        {suffix && (
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm text-warm-gray font-medium">{label}</p>
    </div>
  );
}
