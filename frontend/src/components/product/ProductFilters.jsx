'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

const PRICE_RANGES = [
  { label: 'Under $50', min: '', max: '50' },
  { label: '$50 - $100', min: '50', max: '100' },
  { label: 'Over $100', min: '100', max: '' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', sortBy: '', sortOrder: '' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Newest Arrivals', sortBy: 'createdAt', sortOrder: 'desc' },
];

export default function ProductFilters({ activeCategoryName }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSortBy = searchParams.get('sortBy') || '';
  const currentSortOrder = searchParams.get('sortOrder') || '';

  const createQueryString = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([name, value]) => {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const applyPriceFilter = (min, max) => {
    if (min === currentMinPrice && max === currentMaxPrice) {
      router.push(pathname + '?' + createQueryString({ minPrice: '', maxPrice: '' }), { scroll: false });
    } else {
      router.push(pathname + '?' + createQueryString({ minPrice: min, maxPrice: max }), { scroll: false });
    }
  };

  const applySort = (sortBy, sortOrder) => {
    router.push(pathname + '?' + createQueryString({ sortBy, sortOrder }), { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentSortBy || activeCategoryName;

  const FilterContent = () => (
    <div className="w-full">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          {activeCategoryName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background-hover rounded-full text-xs font-medium border border-border">
              {activeCategoryName}
            </div>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-glow text-primary-dark rounded-full text-xs font-medium">
              Price Filter
              <button onClick={() => applyPriceFilter('', '')} className="hover:text-primary transition-colors">
                <X size={14} />
              </button>
            </div>
          )}
          {(currentMinPrice || currentMaxPrice || currentSortBy) && (
            <button 
              onClick={clearAllFilters}
              className="text-xs font-semibold text-error hover:text-red-700 underline underline-offset-2 ml-2"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Sort Accordion */}
      <div className="border-b border-cloud mb-4 pb-4">
        <button 
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex w-full items-center justify-between py-2 text-charcoal font-serif font-semibold text-lg hover:text-primary transition-colors"
        >
          <span>Sort By</span>
          {isSortOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isSortOpen && (
          <div className="pt-2 flex flex-col gap-3">
            {SORT_OPTIONS.map((option) => {
              const isActive = currentSortBy === option.sortBy && currentSortOrder === option.sortOrder;
              return (
                <button
                  key={option.label}
                  onClick={() => applySort(option.sortBy, option.sortOrder)}
                  className="flex items-center gap-3 text-left group"
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isActive ? 'border-primary bg-primary' : 'border-warm-gray group-hover:border-primary'}`}>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm ${isActive ? 'font-semibold text-charcoal' : 'text-text-secondary group-hover:text-charcoal'}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Accordion */}
      <div className="border-b border-cloud mb-4 pb-4">
        <button 
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="flex w-full items-center justify-between py-2 text-charcoal font-serif font-semibold text-lg hover:text-primary transition-colors"
        >
          <span>Price</span>
          {isPriceOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isPriceOpen && (
          <div className="pt-2 flex flex-col gap-3">
            {PRICE_RANGES.map((range) => {
              const isActive = currentMinPrice === range.min && currentMaxPrice === range.max;
              return (
                <button
                  key={range.label}
                  onClick={() => applyPriceFilter(range.min, range.max)}
                  className="flex items-center gap-3 text-left group"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary text-white' : 'border border-warm-gray group-hover:border-primary text-transparent'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className={`text-sm ${isActive ? 'font-semibold text-charcoal' : 'text-text-secondary group-hover:text-charcoal'}`}>
                    {range.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block sticky top-24 pr-8 border-r border-cloud h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
        <FilterContent />
      </aside>

      <div className="lg:hidden mb-6">
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-cloud rounded-lg font-medium text-charcoal hover:bg-background-hover transition-colors shadow-sm"
        >
          <Filter size={18} />
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters & Sort'}
        </button>
        
        {isMobileFiltersOpen && (
          <div className="mt-4 p-4 bg-white border border-cloud rounded-xl shadow-soft animate-fade-in">
            <FilterContent />
          </div>
        )}
      </div>
    </>
  );
}
