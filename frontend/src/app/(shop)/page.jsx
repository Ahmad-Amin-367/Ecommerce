import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Sparkles, Cake, Heart, Moon, Briefcase, HandHeart } from 'lucide-react';
import FeaturedSlider from '@/components/home/FeaturedSlider';
import TestimonialsSlider from '@/components/home/TestimonialsSlider';
import StatsSection from '@/components/home/StatsSection';
import ScrollReveal from '@/components/home/ScrollReveal';
import GallerySection from '@/components/home/GallerySection';

export const metadata = {
  title: 'Hisna Gifts — Perfect Gifts for Every Occasion',
  description: 'Customize your edible fruit arrangements or personalize your gift the way you want. Delivering across Pakistan.',
};

const categories = [
  { name: 'Birthday Gifts', slug: 'birthday', icon: Cake, color: 'bg-[#FFF0E6]', accent: 'text-[#E88A4D]' },
  { name: 'Anniversary', slug: 'anniversary', icon: Heart, color: 'bg-[#FDE8EC]', accent: 'text-[#D4596A]' },
  { name: 'Eid Special', slug: 'eid-special', icon: Moon, color: 'bg-[#E8F0E8]', accent: 'text-[#3D5A3E]' },
  { name: 'Custom Gifts', slug: 'custom', icon: Sparkles, color: 'bg-[#F0E8F5]', accent: 'text-[#8B5CA8]' },
  { name: 'Corporate', slug: 'corporate', icon: Briefcase, color: 'bg-[#E8EDF5]', accent: 'text-[#5A6B8C]' },
  { name: 'Thank You', slug: 'thank-you', icon: HandHeart, color: 'bg-[#FBF0E4]', accent: 'text-[#C67D5C]' },
];



export default function HomePage() {
  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-10 md:py-10 lg:py-12 min-h-[calc(100vh-108px)] md:min-h-0">
          {/* Copy */}
          <div className="animate-fade-in z-10 max-w-xl">
            <h1 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight mb-6 text-charcoal">
              Gifts That Speak{' '}
              <span className="relative inline-block">
                <span className="relative z-10">From The Heart</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blush/50 -z-0 rounded-sm" aria-hidden="true" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-warm-gray leading-relaxed mb-8 max-w-md font-sans">
              A perfect gift for your perfect occasion. Customize your edible fruit arrangements 
              or personalize your gift the way you want.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/all"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-primary-dark hover:shadow-glow hover:-translate-y-[2px]"
              >
                Shop Gifts
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/category/custom"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-charcoal border-2 border-cloud rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:border-primary hover:bg-primary-glow hover:-translate-y-[1px]"
              >
                Custom Orders
              </Link>
            </div>

            {/* Inline Social Proof */}
            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-cloud/60">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-warning fill-warning" />
                ))}
              </div>
              <span className="text-sm font-semibold text-charcoal">500+</span>
              <span className="text-sm text-warm-gray">happy customers across Pakistan</span>
            </div>
          </div>

          {/* Product Image Gallery */}
          <div className="hidden md:flex relative h-[480px] items-center justify-center">
            {/* Background blur shapes */}
            <div className="absolute w-[360px] h-[360px] bg-blush/30 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute w-[200px] h-[200px] bg-primary/10 rounded-full top-[10%] right-[10%]" />

            {/* Main Product Image */}
            <div className="relative z-10 w-[280px] lg:w-[320px] h-[340px] lg:h-[380px] rounded-3xl overflow-hidden shadow-lifted border-4 border-white/80 animate-float" style={{ animationDelay: '0.5s' }}>
              <Image
                src="/products/prod-1.jpg"
                alt="Beautiful anniversary fruit arrangement by Hisna Gifts"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 280px, 320px"
                priority
              />
            </div>

            {/* Secondary Image - Top Right */}
            <div className="hidden lg:block absolute top-[5%] right-[5%] z-20 w-[160px] h-[160px] rounded-2xl overflow-hidden shadow-card border-3 border-white/80 animate-float" style={{ animationDelay: '2s' }}>
              <Image
                src="/products/prod-3.jpg"
                alt="Birthday fruit platter by Hisna Gifts"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>

            {/* Tertiary Image - Bottom Left */}
            <div className="hidden lg:block absolute bottom-[8%] left-[2%] z-20 w-[140px] h-[140px] rounded-2xl overflow-hidden shadow-card border-3 border-white/80 animate-float" style={{ animationDelay: '3.5s' }}>
              <Image
                src="/products/prod-6.jpg"
                alt="Exotic fruit arrangement by Hisna Gifts"
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>

            {/* Floating accent card */}
            <div className="hidden lg:flex absolute top-[30%] left-[8%] z-30 bg-white rounded-2xl shadow-card px-4 py-3 items-center gap-2 animate-float" style={{ animationDelay: '4s' }}>
              <div className="w-8 h-8 rounded-full bg-primary-glow flex items-center justify-center">
                <Heart size={14} className="text-primary fill-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Made with Love</p>
                <p className="text-[10px] text-warm-gray">Fresh & Handcrafted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ANIMATED STATS COUNTER CARDS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-6">
          <StatsSection />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SHOP BY OCCASION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background-secondary py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                Find the perfect gift
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
                Shop By Occasion
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat, index) => (
              <ScrollReveal key={cat.slug} delay={index * 80}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-cloud transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-primary/20"
                >
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <cat.icon size={28} className={cat.accent} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-charcoal text-center">{cat.name}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          GALLERY SHOWCASE — Bento Grid with 0 to 100% Reveal
      ═══════════════════════════════════════════════════════════════════════ */}
      <GallerySection />
    </div>
  );
}
