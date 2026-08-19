import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ArrowRight, ShoppingBag, Leaf, Truck, Shield } from 'lucide-react';
import FeaturedSlider from '@/components/home/FeaturedSlider';
import CategorySlider from '@/components/home/CategorySlider';
import TestimonialsSlider from '@/components/home/TestimonialsSlider';
import ScrollReveal from '@/components/home/ScrollReveal';

export const metadata = {
  title: 'Hisna Gifts — Perfect Gifts for Every Occasion',
  description: 'Customize your edible fruit arrangements or personalize your gift the way you want. Delivering across Pakistan.',
};


export default function HomePage() {
  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-background">
        {/* Desktop: Image dictates the height of the section exactly */}
        <div className="hidden lg:block w-full">
          <img
            src="/hero/hero_bg.png"
            alt="Hisna Gifts Hero Background"
            className="w-full h-auto block"
          />
        </div>

        {/* Mobile: Absolute image so tall text can stretch the container naturally */}
        <div className="block lg:hidden absolute inset-0 z-0">
          <Image
            src="/hero/hero_bg_v5.png"
            alt="Hisna Gifts Hero Background"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Subtle gradient overlay to ensure text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent" />
        </div>

        {/* Content Container - Absolute on desktop to fit inside the image, Relative on mobile */}
        <div className="relative lg:absolute inset-0 z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center lg:items-start py-12 lg:py-10 xl:py-16">
          {/* Left Column - Copy */}
          <div className="animate-fade-in z-10 flex flex-col pt-4 lg:pt-0 sm:max-w-[60%] md:max-w-[70%] lg:max-w-none">
            {/* Top subtitle */}
            <div className="flex flex-col items-start mb-3 lg:mb-4">
              <span className="text-primary font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase ml-1">
                PERSONAL GIFTING
              </span>
              <div className="flex items-center gap-2 text-primary/40 mt-1 sm:mt-2">
                <div className="w-8 h-[1px] bg-primary/30"></div>
                <Heart size={10} className="text-primary/60" />
                <div className="w-8 h-[1px] bg-primary/30"></div>
              </div>
            </div>

            <h1 className="font-serif text-[clamp(2rem,4vw,3.75rem)] font-bold leading-[1.05] tracking-tight mb-3 lg:mb-4">
              <span className="block text-charcoal">Personal Gifts</span>
              <span className="block text-primary">Made Beautiful</span>
            </h1>

            <p className="text-sm sm:text-base text-warm-gray leading-snug mb-5 lg:mb-6 max-w-[90%] lg:max-w-[480px] font-sans">
              Celebrate life's special moments with handcrafted edible arrangements. Perfect for birthdays, anniversaries, Eid, thank-you gifts, and every little moment in between.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 lg:mb-8">
              <Link
                href="/category/all"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-primary text-white rounded-full font-semibold text-sm transition-all hover:bg-primary-dark hover:shadow-glow hover:-translate-y-[2px]"
              >
                Shop Gifts
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/category/custom"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-transparent text-primary border border-primary rounded-full font-semibold text-sm transition-all hover:bg-primary-glow hover:-translate-y-[1px]"
              >
                <ShoppingBag size={16} />
                Customize Your Order
              </Link>
            </div>

            {/* Bottom Feature List */}
            <div className="flex flex-wrap lg:flex-nowrap gap-x-6 gap-y-4 pt-4 lg:pt-5 border-t border-cloud/50">
              <div className="flex items-start gap-2.5">
                <Leaf size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal leading-tight">Made Fresh</span>
                  <span className="text-[10px] text-warm-gray leading-tight mt-0.5">Every arrangement<br />made to order</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Heart size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal leading-tight">Handcrafted<br />With Love</span>
                  <span className="text-[10px] text-warm-gray leading-tight mt-0.5">Made with care<br />and perfection</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal leading-tight">Local Delivery</span>
                  <span className="text-[10px] text-warm-gray leading-tight mt-0.5">Across GTA<br />and surrounding areas</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal leading-tight">Secure Checkout</span>
                  <span className="text-[10px] text-warm-gray leading-tight mt-0.5">Safe and secure<br />payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Empty to maintain grid spacing */}
          <div className="hidden lg:block pointer-events-none"></div>
        </div>

        {/* Right Side Polaroid Images - Absolutely positioned on the entire section for perfect Y-axis centering */}
        <div className="hidden sm:flex absolute right-4 lg:right-8 xl:right-12 top-1/2 -translate-y-1/2 flex-col gap-4 z-20 pointer-events-auto">
          {/* Top Image - Chocolate Hearts */}
          <div className="relative w-[140px] lg:w-[160px] aspect-square rounded-2xl overflow-hidden shadow-lifted border-4 lg:border-[6px] border-white animate-float" style={{ animationDelay: '2s' }}>
            <Image
              src="/products/prod-3.jpg"
              alt="Chocolate covered strawberries and hearts"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>

          {/* Bottom Image - Fruit Platter */}
          <div className="relative w-[140px] lg:w-[160px] aspect-square rounded-2xl overflow-hidden shadow-lifted border-4 lg:border-[6px] border-white animate-float" style={{ animationDelay: '3.5s' }}>
            <Image
              src="/products/prod-6.jpg"
              alt="Beautiful fruit platter"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SHOP BY OCCASION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background-secondary py-10 sm:py-12 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-2">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
                Shop by Occasion
              </h2>
              <div className="flex items-center justify-center gap-2 text-primary/40 mt-3">
                <div className="w-12 h-[1px] bg-primary/30"></div>
                <Heart size={12} className="text-primary/60" />
                <div className="w-12 h-[1px] bg-primary/30"></div>
              </div>
            </div>
          </ScrollReveal>

          <CategorySlider />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURED PRODUCTS SLIDER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-20 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-6">
          <ScrollReveal>
            {/* Dynamic Featured Products Slider (includes Header & Nav) */}
            <FeaturedSlider />
          </ScrollReveal>

          <div className="sm:hidden text-center mt-8">
            <Link
              href="/category/all?isFeatured=true"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
            >
              View All Gifts <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIALS SLIDER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background-secondary py-16 sm:py-20 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                Loved by hundreds
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
                What Our Customers Say
              </h2>
            </div>
          </ScrollReveal>

          <TestimonialsSlider />
        </div>
      </section>
    </div>
  );
}
