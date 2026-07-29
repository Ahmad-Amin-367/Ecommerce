'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
// Category metadata for the custom hero sections
const categoryData = {
  'birthday': {
    title: 'Birthday Gifts',
    label: 'birthday',
    description: 'Make their special day unforgettable with our handcrafted fruit arrangements and premium gift baskets. Handcrafted with love and delivered fresh to their door.',
    image: '/products/prod-3.jpg',
    colors: {
      bg: 'bg-[#FDF6F0]',
      text: 'text-[#E82B32]', // Red like EA
    }
  },
  'anniversary': {
    title: 'Anniversary Gifts',
    label: 'anniversary',
    description: 'Celebrate love and milestones with romantic chocolate-dipped strawberries and elegant floral fruit bouquets.',
    image: '/products/prod-1.jpg',
    colors: {
      bg: 'bg-[#FDE8EC]',
      text: 'text-[#D4596A]',
    }
  },
  'eid-special': {
    title: 'Eid Special',
    label: 'eid',
    description: 'Share the joy of Eid with premium dates, exotic fruits, and luxurious sharing platters for the whole family.',
    image: '/products/prod-6.jpg',
    colors: {
      bg: 'bg-[#E8F0E8]',
      text: 'text-[#3D5A3E]',
    }
  },
  'custom': {
    title: 'Custom Gifts',
    label: 'custom',
    description: 'Create something truly unique. Personalize your gift basket with their favorite fruits and custom chocolate messages.',
    image: '/products/prod-2.jpg',
    colors: {
      bg: 'bg-[#F0E8F5]',
      text: 'text-[#8B5CA8]',
    }
  },
  'corporate': {
    title: 'Corporate Gifts',
    label: 'corporate',
    description: 'Leave a lasting impression on clients and employees with our professional, premium gifting solutions.',
    image: '/products/prod-4.jpg',
    colors: {
      bg: 'bg-[#E8EDF5]',
      text: 'text-[#5A6B8C]',
    }
  },
  'thank-you': {
    title: 'Thank You Gifts',
    label: 'thank you',
    description: 'Show your appreciation the sweetest way possible with our hand-crafted fruit arrangements.',
    image: '/products/prod-5.jpg',
    colors: {
      bg: 'bg-[#FBF0E4]',
      text: 'text-[#C67D5C]',
    }
  },
  'default': {
    title: 'Gifts & Treats',
    label: 'gifts',
    description: 'Browse our curated collection of premium gifts for any occasion.',
    image: '/products/prod-3.jpg',
    colors: {
      bg: 'bg-primary-glow',
      text: 'text-primary',
    }
  }
};

function CategoryContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const [showDetails, setShowDetails] = useState(false);
  
  // Format slug for title fallback
  const formattedSlugTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const currentCategory = categoryData[slug] || {
    ...categoryData['default'],
    title: `${formattedSlugTitle} Gifts`
  };

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const { data, isLoading } = useProducts({
    category: slug,
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder })
  });

  return (
    <div className="bg-background min-h-screen pb-20">
      
      {/* ─── EA-Style Full Width Banner ───────────────────────────────────────── */}
      <div className={`w-full relative h-[120px] md:h-[160px] lg:h-[200px] overflow-hidden ${currentCategory.colors.bg} flex items-center justify-center`}>
        <div className="w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative z-10">
          <h2 className={`font-serif text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight opacity-90 ${currentCategory.colors.text}`}>
            {currentCategory.label}
          </h2>
          <div className="relative h-full w-[50%] md:w-[40%]">
            <Image 
              src={currentCategory.image} 
              alt={currentCategory.title} 
              fill
              className="object-cover object-center"
              priority
            />
            {/* Soft gradient fade on the left side of the image so it blends with background */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[${currentCategory.colors.bg.replace('bg-[', '').replace(']', '')}] via-transparent to-transparent opacity-50`}></div>
          </div>
        </div>
      </div>

      {/* ─── Clean White Header (Title & SEO Text) ────────────────────────────── */}
      <div className="bg-white border-b border-cloud py-6 mb-8 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="text-xs font-medium text-text-muted mb-2">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link> / 
                <span className="text-charcoal ml-1">{currentCategory.title}</span>
              </nav>
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
                {currentCategory.title}
              </h1>
            </div>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-semibold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors self-start md:self-auto"
            >
              {showDetails ? 'Hide Details' : 'View Details'}
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-cloud animate-fade-in">
              <p className="text-text-secondary leading-relaxed max-w-3xl">
                {currentCategory.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Main Content Grid (Filters + Products) ─────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-text-secondary">
            {isLoading ? 'Loading...' : `${data?.data?.length || 0} Results`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Filters */}
          <ProductFilters activeCategoryName={currentCategory.title} />

          {/* Product Grid */}
          <div>
            <ProductGrid 
              products={data?.data} 
              isLoading={isLoading} 
              emptyMessage={`No products found in the ${currentCategory.title} category with these filters.`} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default function CategoryPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center pb-20">
        <p className="text-text-secondary">Loading category...</p>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="bg-background min-h-screen flex items-center justify-center pb-20">
          <p className="text-text-secondary">Loading category...</p>
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
