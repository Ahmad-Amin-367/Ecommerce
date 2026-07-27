import Link from 'next/link';
import { Gift, Truck, Heart, RotateCcw, Star, ArrowRight, Sparkles, Cake, PartyPopper, Moon, Briefcase, HandHeart } from 'lucide-react';
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
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-24 lg:py-28 min-h-[calc(100vh-108px)] lg:min-h-0">
          {/* Copy */}
          <div className="animate-fade-in z-10 max-w-xl">
            <p className="inline-flex items-center gap-2 bg-primary-glow border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} />
              Handcrafted with Love
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-tight mb-6 text-charcoal">
              Gifts That Speak{' '}
              <span className="relative inline-block">
                <span className="relative z-10">From The Heart</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blush/50 -z-0 rounded-sm" aria-hidden="true" />
              </span>
            </h1>
            <p className="text-lg text-warm-gray leading-relaxed mb-8 max-w-md font-sans">
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
          </div>

          {/* Decorative Visual */}
          <div className="hidden lg:flex relative h-[460px] items-center justify-center">
            {/* Warm abstract shapes */}
            <div className="absolute w-[320px] h-[320px] bg-blush/40 rounded-full blur-[60px] animate-pulse" />
            <div className="absolute w-[200px] h-[200px] bg-primary/15 rounded-full top-[15%] right-[15%] animate-float" />
            <div className="absolute w-[140px] h-[140px] bg-cream rounded-full bottom-[20%] left-[15%] animate-float" style={{ animationDelay: '2s' }} />
            {/* Center gift icon */}
            <div className="relative z-10 w-36 h-36 bg-white rounded-3xl shadow-lifted flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <Gift size={56} className="text-primary" strokeWidth={1.5} />
            </div>
            {/* Floating accent elements */}
            <div className="absolute top-[25%] left-[25%] w-12 h-12 bg-white rounded-2xl shadow-card flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
              <Heart size={20} className="text-blush" fill="currentColor" />
            </div>
            <div className="absolute bottom-[30%] right-[20%] w-14 h-14 bg-white rounded-2xl shadow-card flex items-center justify-center animate-float" style={{ animationDelay: '4s' }}>
              <Sparkles size={22} className="text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TRUST FEATURES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-cloud">
        <div className="container mx-auto px-6 py-8">
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
        <div className="container mx-auto px-6">
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
                href={`/products?category=${cat.slug}`}
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
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
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
