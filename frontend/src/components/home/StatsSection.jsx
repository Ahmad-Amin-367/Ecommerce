'use client';
import { Star, Package, MapPin } from 'lucide-react';
import CountUpCard from './CountUpCard';

const socialProofStats = [
  { icon: Star, value: 500, suffix: '+', label: 'Happy Customers', color: 'bg-[#FFF8E6]' },
  { icon: Package, value: 2000, suffix: '+', label: 'Gifts Delivered', color: 'bg-primary-glow' },
  { icon: MapPin, value: 50, suffix: '+', label: 'Cities Covered', color: 'bg-[#E8F0E8]' },
];

/**
 * StatsSection — Client wrapper that holds icon references and renders CountUpCards.
 * Needed because Server Components can't pass function/class props to Client Components.
 */
export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {socialProofStats.map((stat, index) => (
        <CountUpCard
          key={stat.label}
          icon={stat.icon}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          color={stat.color}
          delay={index * 200}
        />
      ))}
    </div>
  );
}
