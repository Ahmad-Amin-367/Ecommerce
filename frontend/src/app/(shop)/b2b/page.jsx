import Image from 'next/image';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Users,
  UtensilsCrossed,
  Gift,
  HeartHandshake,
  ArrowRight,
  Heart,
  Star,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import B2BQuoteFormWrapper from '@/components/b2b/B2BQuoteFormWrapper';
import WhyChooseUsSlider from '@/components/b2b/WhyChooseUsSlider';
import B2BTestimonialsSlider from '@/components/b2b/B2BTestimonialsSlider';

export const metadata = {
  title: 'B2B & Corporate Gifting | Hisna Gifts — Bulk Orders & Event Displays',
  description: 'Luxury corporate gifting, wedding fruit tables, live chocolate dipping stations, and custom logo edible plaques across Toronto, GTA, and Canada.',
  keywords: 'B2B corporate gifts Toronto, bulk edible arrangements GTA, wedding fruit tables, live chocolate dipping station, corporate fruit platters',
};

const services = [
  {
    title: 'Weddings',
    desc: 'Romantic, elegant arrangements for your special day.',
    image: '/products/prod-1.jpg',
    icon: Heart,
  },
  {
    title: 'Corporate Gifting',
    desc: 'Impress clients and appreciate teams with thoughtful gifts.',
    image: '/products/prod-6.jpg',
    icon: Briefcase,
  },
  {
    title: 'Fruit Tables',
    desc: 'Stunning spreads that bring freshness and color to any event.',
    image: '/products/prod-2.jpg',
    icon: UtensilsCrossed,
  },
  {
    title: 'Dessert Cups',
    desc: 'Individual desserts that are as beautiful as they are delicious.',
    image: '/products/prod-3.jpg',
    icon: Sparkles,
  },
  {
    title: 'Chocolate Fountain',
    desc: 'A crowd favorite that adds wow to any celebration.',
    image: '/products/prod-4.jpg',
    icon: Sparkles,
  },
  {
    title: 'Custom Displays',
    desc: 'Tailored designs crafted to match your vision.',
    image: '/products/prod-5.jpg',
    icon: Gift,
  },
];

const features = [
  {
    title: 'Freshly Prepared',
    desc: 'We use premium, fresh ingredients for every order.',
    icon: UtensilsCrossed,
  },
  {
    title: 'Elegant Presentation',
    desc: 'Designed with attention to detail for a premium look.',
    icon: Sparkles,
  },
  {
    title: 'Customizable Menus',
    desc: 'Tailored arrangements to suit your theme and preferences.',
    icon: HeartHandshake,
  },
  {
    title: 'Halal-Friendly Options',
    desc: 'A wide selection of halal-friendly ingredients and treats.',
    icon: CheckCircle2,
  },
  {
    title: 'Reliable Delivery & Setup',
    desc: 'On-time delivery and professional setup across the GTA.',
    icon: Truck,
  },
];

export default function B2BPage() {
  return (
    <div className="bg-[#f4f7f5] min-h-screen text-[#2c3e35] pt-0">
      {/* ═══════════════════════════════════════════════════════════════════════
          B2B HERO SECTION — Clean Green & White Layout
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative bg-white border-b border-[#e2ece5] min-h-[480px] lg:h-[500px] flex flex-col lg:flex-row lg:items-center overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute w-[400px] h-[400px] bg-[#325247]/5 rounded-full blur-[100px] top-[-10%] right-[30%] pointer-events-none animate-pulse" />

        {/* Left Content Container */}
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left py-12 lg:py-0">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4e7350] block">
              Weddings, Events & Corporate
            </span>
            
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-[#325247] tracking-tight">
              Elevate Every <br className="hidden sm:inline" /> Celebration
            </h1>

            {/* Heart Separator */}
            {/* <div className="py-2 text-center lg:text-left">
              <Heart size={16} className="text-[#325247] fill-[#325247] opacity-85 inline-block" />
            </div> */}

            <p className="text-sm sm:text-base text-[#4e6358] leading-relaxed max-w-xl font-sans mx-auto lg:mx-0">
              From romantic weddings to corporate milestones, we create stunning fruit tables, dessert displays, and custom edible arrangements that impress your guests and leave a lasting impression.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-2 w-full max-w-md mx-auto lg:mx-0">
              <a
                href="#quote-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#325247] text-white hover:bg-[#253e35] rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <span>Request a Quote</span>
                <ArrowRight size={15} className="shrink-0" />
              </a>
              <a
                href="#services-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#f4f7f5] text-[#325247] border-2 border-[#325247] rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-sm text-center"
              >
                <span>Explore Services</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-6 border-t border-[#e2ece5] text-xs font-semibold text-[#4e7350]">
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-[#325247]" /> Delivery & Setup GTA
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#325247]" /> Trusted by 500+ Clients
              </span>
            </div>
          </div>
        </div>

        {/* Right side background image (Absolute on desktop, full height, fade mask on the left) */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[50%] z-10 overflow-hidden">
          {/* Left Gradient Fade Mask (fades from white to transparent) */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/70 to-transparent z-20 pointer-events-none" />
          
          <Image
            src="/products/prod-2.jpg"
            alt="Hisna Gifts Corporate Fruit Display & Event Catering"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />

          {/* Floating Badge (inside image) */}
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm shadow-soft border border-[#e2ece5] rounded-2xl p-3 flex items-center gap-3 z-30 max-w-[200px]">
            <div className="w-8 h-8 rounded-full bg-[#e9f0eb] flex items-center justify-center text-[#325247] shrink-0">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] text-[#2c3e35] font-bold leading-tight">
                Trusted by Couples & Businesses Across GTA
              </p>
            </div>
          </div>
        </div>

        {/* Mobile image fallback rendering below the content */}
        <div className="lg:hidden w-full relative h-[280px] z-10 border-t border-[#e2ece5]">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
          <Image
            src="/products/prod-2.jpg"
            alt="Hisna Gifts Corporate Fruit Display & Event Catering"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Floating Badge on mobile */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm shadow-soft border border-[#e2ece5] rounded-2xl p-2.5 flex items-center gap-2.5 z-30 max-w-[180px]">
            <div className="w-6 h-6 rounded-full bg-[#e9f0eb] flex items-center justify-center text-[#325247] shrink-0">
              <Users size={12} />
            </div>
            <div>
              <p className="text-[9px] text-[#2c3e35] font-bold leading-tight">
                Trusted Across GTA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SERVICES SECTION — Grid of 6 Themed Service Cards
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="services-section" className="py-16 lg:py-20 bg-white border-b border-[#e2ece5]">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#325247]">
              Our Event & Corporate Services
            </h2>
            
            {/* Heart Separator */}
            <div className="flex items-center justify-center gap-2 mt-3 mb-6">
              <div className="h-[1px] w-12 bg-[#325247]/20" />
              <Heart size={14} className="text-[#325247] fill-[#325247] opacity-80 shrink-0" />
              <div className="h-[1px] w-12 bg-[#325247]/20" />
            </div>
          </div>

          {/* Grid of 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-row items-stretch bg-[#f4f7f5] border border-[#e2ece5] rounded-3xl overflow-hidden shadow-soft hover:shadow-card hover:border-[#325247]/30 transition-all duration-300 p-4 min-h-[160px] group"
                >
                  {/* Left content */}
                  <div className="flex-1 flex flex-col justify-between pr-3 py-1">
                    <div>
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-full bg-[#e9f0eb] flex items-center justify-center text-[#325247] mb-2.5">
                        <Icon size={16} />
                      </div>
                      {/* Title */}
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#325247] mb-1">
                        {svc.title}
                      </h3>
                      {/* Description */}
                      <p className="text-[11px] text-[#4e6358] leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right image */}
                  <div className="w-[100px] sm:w-[120px] shrink-0 relative rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      sizes="(max-width: 640px) 100px, 120px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Horizontal Features Bar */}
          <div className="flex flex-wrap items-stretch justify-center gap-6 lg:gap-10 py-6 px-6 bg-[#f4f7f5] rounded-2xl border border-[#e2ece5] mt-12 max-w-6xl mx-auto">
            {features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              return (
                <div key={idx} className="flex gap-3 max-w-[210px] items-start">
                  <div className="p-1.5 rounded-lg bg-[#e9f0eb] text-[#325247] shrink-0">
                    <FeatIcon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#325247]">
                      {feat.title}
                    </h4>
                    <p className="text-[10px] text-[#4e6358] mt-0.5 leading-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CREATIONS & TESTIMONIALS SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#e2ece5]">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Glimpse of Creations */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#325247]">
                A Glimpse of Our Creations
              </h2>
              {/* Heart Separator */}
              <div className="flex items-center gap-2 mt-3 mb-6">
                <div className="h-[1px] w-12 bg-[#325247]/20" />
                <Heart size={14} className="text-[#325247] fill-[#325247] opacity-80 shrink-0" />
                <div className="h-[1px] w-12 bg-[#325247]/20" />
              </div>
            </div>

            {/* 5 rounded portrait images */}
            <div className="grid grid-cols-5 gap-2.5">
              {[
                '/products/prod-1.jpg',
                '/products/prod-2.jpg',
                '/products/prod-3.jpg',
                '/products/prod-4.jpg',
                '/products/prod-5.jpg',
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#d0ded5] shadow-sm hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src={img}
                    alt={`Creation display ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* View More link */}
            <div className="text-center lg:text-left pt-2">
              <a
                href="#why-us"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#325247] hover:underline"
              >
                <span>View More Inspiration</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Testimonial Slider */}
          <div className="lg:col-span-5 relative">
            <B2BTestimonialsSlider />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROCESS SECTION — Simple 3-step timeline
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#e2ece5]">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#325247]">
              Our Simple Process
            </h2>
            
            {/* Heart Separator */}
            <div className="flex items-center justify-center gap-2 mt-3 mb-6">
              <div className="h-[1px] w-12 bg-[#325247]/20" />
              <Heart size={14} className="text-[#325247] fill-[#325247] opacity-80 shrink-0" />
              <div className="h-[1px] w-12 bg-[#325247]/20" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 w-full bg-[#f4f7f5] border border-[#e2ece5] rounded-3xl p-6 flex items-center gap-4 hover:shadow-soft transition-all duration-300">
              <span className="text-sm font-bold text-[#325247] bg-white px-3 py-1.5 rounded-full border border-[#d0ded5]">
                01
              </span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#325247] shrink-0 shadow-sm">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#325247]">Share Your Vision</h4>
                <p className="text-[11px] text-[#4e6358] leading-normal mt-0.5">
                  Tell us about your event, theme, guest count, and preferences.
                </p>
              </div>
            </div>

            <ChevronRight className="hidden lg:block text-[#325247]/30 shrink-0" size={24} />

            {/* Step 2 */}
            <div className="flex-1 w-full bg-[#f4f7f5] border border-[#e2ece5] rounded-3xl p-6 flex items-center gap-4 hover:shadow-soft transition-all duration-300">
              <span className="text-sm font-bold text-[#325247] bg-white px-3 py-1.5 rounded-full border border-[#d0ded5]">
                02
              </span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#325247] shrink-0 shadow-sm">
                <Gift size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#325247]">We Curate Your Experience</h4>
                <p className="text-[11px] text-[#4e6358] leading-normal mt-0.5">
                  We design a custom proposal and menu just for your event.
                </p>
              </div>
            </div>

            <ChevronRight className="hidden lg:block text-[#325247]/30 shrink-0" size={24} />

            {/* Step 3 */}
            <div className="flex-1 w-full bg-[#f4f7f5] border border-[#e2ece5] rounded-3xl p-6 flex items-center gap-4 hover:shadow-soft transition-all duration-300">
              <span className="text-sm font-bold text-[#325247] bg-white px-3 py-1.5 rounded-full border border-[#d0ded5]">
                03
              </span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#325247] shrink-0 shadow-sm">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#325247]">We Deliver & Set Up</h4>
                <p className="text-[11px] text-[#4e6358] leading-normal mt-0.5">
                  We handle delivery, setup, and ensure everything is perfect for your big day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHY CHOOSE HISNA GIFTS (EMBLA SLIDER) — Dark Green Brand Section
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="py-16 lg:py-20 bg-[#325247] text-white border-b border-[#e2ece5]">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 mb-1.5 block">
              Established 2018
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Why Choose Hisna Gifts
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-serif mt-3 max-w-2xl mx-auto">
              Hisna Gifts began its operations in 2018 with a passion for transforming fresh fruit and premium chocolate into memorable gifts and impressive event displays. Every creation is made to order, carefully handcrafted and customized for your occasion.
            </p>
          </div>

          {/* Smooth Embla Image Slider */}
          <WhyChooseUsSlider />

          {/* Bottom 2-Column Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto pt-10 border-t border-white/15">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                Made Fresh to Order
              </h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Every creation is handcrafted using fresh fruit, premium chocolate and careful attention to detail.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                Customized for You
              </h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Colours, flavours, presentation and scale are tailored to your occasion, theme and guest count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INTERACTIVE CALCULATOR & QUOTE FORM SECTION — Intact
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="quote-section" className="py-16 lg:py-20 bg-white">
        <div className="w-full max-w-5xl mx-auto px-6">
          <B2BQuoteFormWrapper />
        </div>
      </section>
    </div>
  );
}
