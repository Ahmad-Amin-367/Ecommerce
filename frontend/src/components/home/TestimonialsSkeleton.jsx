'use client';
import React from 'react';

export default function TestimonialsSkeleton() {
  return (
    <div className="relative w-full animate-pulse">
      {/* Slider Container Placeholder */}
      <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[440px] pb-6">
        
        {/* Navigation Arrows Skeleton */}
        <div className="absolute left-0 md:left-4 lg:left-12 z-30">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cloud/60 border-2 border-cloud" />
        </div>
        <div className="absolute right-0 md:right-4 lg:right-12 z-30">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cloud/60 border-2 border-cloud" />
        </div>

        {/* Cards Track Skeleton */}
        <div className="relative flex items-center justify-center w-full h-[340px] md:h-[380px] overflow-hidden">
          
          {/* Left card skeleton (near/semi-visible) */}
          <div className="hidden sm:block absolute -translate-x-[260px] md:-translate-x-[360px] scale-85 opacity-40 w-[280px] sm:w-[320px] md:w-[360px] h-full rounded-2xl p-6 sm:p-8 bg-white border border-cloud">
            <div className="w-10 h-10 rounded-xl bg-cloud/60 mb-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-cloud/60" />
              ))}
            </div>
            <div className="space-y-2 mb-6">
              <div className="h-3 bg-cloud/60 rounded w-full" />
              <div className="h-3 bg-cloud/60 rounded w-5/6" />
              <div className="h-3 bg-cloud/60 rounded w-4/6" />
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-cloud mt-auto">
              <div className="w-10 h-10 rounded-full bg-cloud/60 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-cloud/60 rounded w-24" />
                <div className="h-2.5 bg-cloud/50 rounded w-16" />
              </div>
            </div>
          </div>

          {/* Active Center Card Skeleton */}
          <div className="absolute z-20 w-[280px] sm:w-[320px] md:w-[360px] h-full rounded-2xl p-6 sm:p-8 flex flex-col bg-white border-2 border-primary/20 shadow-lifted">
            {/* Quote Icon Skeleton */}
            <div className="w-10 h-10 rounded-xl bg-primary-glow flex items-center justify-center mb-4 shrink-0">
              <div className="w-5 h-5 bg-primary/20 rounded" />
            </div>

            {/* Stars Skeleton */}
            <div className="flex items-center gap-1.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-warning/30" />
              ))}
            </div>

            {/* Quote Text Skeleton */}
            <div className="space-y-2.5 mb-6 flex-1">
              <div className="h-3.5 bg-cloud/70 rounded w-full" />
              <div className="h-3.5 bg-cloud/70 rounded w-11/12" />
              <div className="h-3.5 bg-cloud/70 rounded w-4/5" />
              <div className="h-3.5 bg-cloud/70 rounded w-2/3" />
            </div>

            {/* Author Skeleton */}
            <div className="flex items-center gap-3 pt-4 border-t border-cloud mt-auto">
              <div className="w-10 h-10 rounded-full bg-primary/20 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-cloud/80 rounded w-28" />
                <div className="h-2.5 bg-cloud/60 rounded w-20" />
              </div>
            </div>
          </div>

          {/* Right card skeleton (near/semi-visible) */}
          <div className="hidden sm:block absolute translate-x-[260px] md:translate-x-[360px] scale-85 opacity-40 w-[280px] sm:w-[320px] md:w-[360px] h-full rounded-2xl p-6 sm:p-8 bg-white border border-cloud">
            <div className="w-10 h-10 rounded-xl bg-cloud/60 mb-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-cloud/60" />
              ))}
            </div>
            <div className="space-y-2 mb-6">
              <div className="h-3 bg-cloud/60 rounded w-full" />
              <div className="h-3 bg-cloud/60 rounded w-5/6" />
              <div className="h-3 bg-cloud/60 rounded w-4/6" />
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-cloud mt-auto">
              <div className="w-10 h-10 rounded-full bg-cloud/60 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-cloud/60 rounded w-24" />
                <div className="h-2.5 bg-cloud/50 rounded w-16" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Pagination Dots Skeleton */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <div className="w-12 h-2 bg-primary/30 rounded-full" />
        <div className="w-3 h-2 bg-cloud/60 rounded-full" />
        <div className="w-3 h-2 bg-cloud/60 rounded-full" />
      </div>
    </div>
  );
}
