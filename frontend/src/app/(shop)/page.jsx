import Link from 'next/link';
import Image from 'next/image';
import { Gift, Truck, Heart, RotateCcw, Star, ArrowRight, Sparkles, Cake, PartyPopper, Moon, Briefcase, HandHeart, Users, Package, MapPin } from 'lucide-react';
import FeaturedProducts from '@/components/product/FeaturedProducts';

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

const trustFeatures = [
  { icon: Gift, title: 'Gift Wrapping', desc: 'Complimentary on all orders' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Across all cities in Pakistan' },
  { icon: Heart, title: 'Personalized Touch', desc: 'Custom messages & styling' },
  { icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle-free return policy' },
];

const socialProofStats = [
  { icon: Star, value: '500+', label: 'Happy Customers', color: 'text-warning' },
  { icon: Package, value: '2,000+', label: 'Gifts Delivered', color: 'text-primary' },
  { icon: MapPin, value: 'All Cities', label: 'Nationwide Delivery', color: 'text-success' },
];

const testimonials = [
  {
    name: 'Ayesha K.',
    location: 'Lahore',
    rating: 5,
    text: 'The edible arrangement was absolutely stunning! My mother loved every bit of it. The packaging was premium and it arrived fresh. Will definitely order again.',
  },
  {
    name: 'Fatima S.',
    location: 'Karachi',
    rating: 5,
    text: 'Ordered a custom birthday hamper for my husband and it exceeded all expectations. The attention to detail was remarkable. Hisna Gifts never disappoints!',
  },
  {
    name: 'Ahmed R.',
    location: 'Islamabad',
    rating: 5,
    text: 'Corporate gifting made easy! We ordered Eid gifts for our entire team and the quality was consistent across every single package. Highly professional service.',
  },
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
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-primary-dark hover:shadow-glow hover:-translate-y-[2px]"
              >
                Shop Gifts
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?category=custom"
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
          SOCIAL PROOF COUNTER STRIP
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-cloud">
        <div className="w-full max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4">
            {socialProofStats.map((stat) => (
              <div key={stat.label} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-primary-glow flex items-center justify-center shrink-0">
                  <stat.icon size={18} className={stat.color} fill={stat.color === 'text-warning' ? 'currentColor' : 'none'} />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-charcoal leading-tight">{stat.value}</p>
                  <p className="text-[11px] sm:text-xs text-warm-gray">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TRUST FEATURES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-cloud">
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-primary-glow flex items-center justify-center shrink-0">
                  <feature.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{feature.title}</p>
                  <p className="text-xs text-warm-gray">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SHOP BY OCCASION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Find the perfect gift
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
              Shop By Occasion
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-cloud transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-primary/20"
              >
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <cat.icon size={28} className={cat.accent} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold text-charcoal text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURED / CURATED SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background-secondary py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                Handpicked for you
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
                Curated Gifts
              </h2>
            </div>
            <Link
              href="/products?isFeatured=true"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* Dynamic Featured Products Grid with Skeleton Loading */}
          <FeaturedProducts />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Loved by hundreds
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-cloud transition-all duration-300 hover:shadow-card"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-warm-gray leading-relaxed mb-5 font-sans">
                  &ldquo;{review.text}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-cloud">
                  <div className="w-9 h-9 rounded-full bg-primary-glow flex items-center justify-center text-sm font-bold text-primary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{review.name}</p>
                    <p className="text-xs text-text-muted">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NEWSLETTER CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background-secondary py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal mb-3">
              Stay In The Loop
            </h2>
            <p className="text-sm text-warm-gray mb-8 max-w-md mx-auto">
              Be the first to know about new gift collections, seasonal specials, and exclusive offers.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              action="/subscribe" // Optional: can be a real action or removed
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-white border border-cloud text-sm text-charcoal placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-glow transition-all duration-200"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-primary text-white rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-primary-dark hover:shadow-glow hover:-translate-y-[1px] shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
