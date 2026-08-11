import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, Sparkles, CheckCircle2, ShieldCheck, Truck, Users, Award, Clock, ArrowDown, UtensilsCrossed, Gift, HeartHandshake, ArrowRight } from 'lucide-react';
import B2BQuoteFormWrapper from '@/components/b2b/B2BQuoteFormWrapper';
import WhyChooseUsSlider from '@/components/b2b/WhyChooseUsSlider';

export const metadata = {
  title: 'B2B & Corporate Gifting | Hisna Gifts — Bulk Orders & Event Displays',
  description: 'Luxury corporate gifting, wedding fruit tables, live chocolate dipping stations, and custom logo edible plaques across Toronto, GTA, and Canada.',
  keywords: 'B2B corporate gifts Toronto, bulk edible arrangements GTA, wedding fruit tables, live chocolate dipping station, corporate fruit platters',
};

const b2bServices = [
  {
    title: 'Corporate Gift Boxes & Bundles',
    badge: 'Employee & Client Gifting',
    image: '/products/prod-1.jpg',
    description: 'Custom chocolate-dipped strawberries, fruit bouquets, and gourmet hampers branded with your corporate logo plaque and custom ribbon colors.',
    features: ['Custom Logo Plaques', 'Bulk Quantity Tier Discounts', 'Individual Recipient Delivery Available'],
  },
  {
    title: 'Wedding & Event Fruit Tables',
    badge: '4ft — 6ft Displays',
    image: '/products/prod-2.jpg',
    description: 'Show-stopping fruit arrangements carved and assembled live for weddings, galas, anniversaries, and grand corporate launches across the GTA.',
    features: ['Custom Height & Theme Colors', 'On-site Professional Setup', 'Fresh Season Fruit Towers'],
  },
  {
    title: 'Live Dipping & Chocolate Station',
    badge: 'Interactive Guest Experience',
    image: '/products/prod-3.jpg',
    description: 'Add an unforgettable interactive station with warm melted chocolate, freshly sliced fruits, and custom toppings served live to your event guests.',
    features: ['Professional Uniformed Attendant', 'Warm Melted Chocolate Fountains', 'Interactive Custom Toppings Bar'],
  },
  {
    title: 'Gourmet Platters & Fruit Trees',
    badge: 'Catering & Buffets',
    image: '/products/prod-4.jpg',
    description: 'Artisanal charcuterie fruit trays, candy trees, and edible fruit sculptures crafted for office meetings, boardrooms, and private VIP events.',
    features: ['Ready-to-serve Eco Platters', 'Dietary Restrictions Accommodated', 'Scheduled GTA Delivery'],
  },
];

const b2bStats = [
  { label: 'Corporate Events & Galas', value: '500+' },
  { label: 'Satisfaction Rating', value: '99.8%' },
  { label: 'Freshness Guarantee', value: '100%' },
  { label: 'Lead Time Required', value: '24-48 hrs' },
];

export default function B2BPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════
          B2B HERO SECTION — Matches Hisna Gifts B2C Warm Gradient Hero
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative bg-gradient-hero text-charcoal overflow-hidden py-10 sm:py-14 border-b border-cloud">
        {/* Background Decorative Blur Shapes */}
        <div className="absolute w-[400px] h-[400px] bg-blush/40 rounded-full blur-[100px] top-[-10%] right-[-5%] pointer-events-none animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full bottom-[-10%] left-[-5%] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight text-charcoal">
              Luxury Corporate Gifting & <br className="hidden sm:inline" />
              <span className="relative inline-block text-primary">
                <span>Unforgettable Event Catering</span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 sm:h-3 bg-blush/50 -z-10 rounded-sm" aria-hidden="true" />
              </span>
            </h1>

            <p className="text-xs sm:text-base text-warm-gray leading-relaxed max-w-2xl font-sans">
              From elegant employee appreciation gifts to 6-foot centerpiece fruit tables and interactive live chocolate dipping stations — we create handcrafted, fresh edible experiences tailored for your business across Toronto & nationwide.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1 w-full max-w-md mx-auto lg:mx-0">
              <a
                href="#quote-section"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-primary text-white hover:bg-primary-dark rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-glow hover:shadow-lifted transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <span>Request a Corporate Quote</span>
                <ArrowDown size={15} className="shrink-0" />
              </a>
              <a
                href="#b2b-offerings"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-white hover:bg-background-hover text-charcoal border-2 border-cloud rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-sm text-center"
              >
                <span>Explore Offerings</span>
              </a>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-cloud">
              {b2bStats.map((stat, idx) => (
                <div key={idx} className="text-center lg:text-left">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-warm-gray mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Feature Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-lifted border-4 border-white bg-white">
              <div className="relative h-64 sm:h-72">
                <Image
                  src="/products/prod-2.jpg"
                  alt="Hisna Gifts Corporate Fruit Display & Event Catering"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              </div>
              <div className="p-5 text-white bg-charcoal space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blush">Featured B2B Experience</span>
                  <span className="text-[11px] bg-primary/20 text-blush px-2.5 py-0.5 rounded-full border border-primary/30">GTA & Canada</span>
                </div>
                <h3 className="font-serif text-lg font-bold">Custom Branded Fruit Tables & Displays</h3>
                <p className="text-xs text-cloud-light/80 leading-relaxed">
                  Tailored colors, custom carved initials/logos, and premium Belgian chocolate dipping stations for your high-profile event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INTRO & BRAND STORY SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 bg-background-secondary border-b border-cloud">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block">
              Handcrafted Corporate Experiences
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal leading-snug">
              From thoughtful corporate gifts to show-stopping fruit tables, Hisna Gifts creates fresh, handcrafted experiences for every celebration across Toronto and the GTA.
            </h2>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary pt-1">
              Fresh Fruit • Premium Chocolate • Made to Order
            </p>
            <p className="text-sm text-warm-gray leading-relaxed font-sans">
              Every Hisna Gifts creation is made to order using fresh fruit, premium chocolate and careful attention to detail. From corporate gifting and fruit bouquets to four-to-six-foot fruit tables and live chocolate-dipped fruit experiences, we customize every creation for your occasion.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Oval Tower Showcase Slider */}
            <div className="relative w-64 sm:w-72 h-80 sm:h-96 rounded-[120px] overflow-hidden border-4 border-white shadow-lifted">
              <Image
                src="/products/prod-1.jpg"
                alt="Strawberry & Chocolate Tower Display"
                fill
                sizes="300px"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center text-white p-4">
                <p className="font-serif text-sm font-bold">Handcrafted Strawberry Towers</p>
                <p className="text-[10px] text-blush">Made Fresh for Corporate & Weddings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PLATTER & CHARCUTERIE SHOWCASE GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 bg-white border-b border-cloud">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block">Gourmet Catering</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                Charcuterie Trays • Fruit Platters • Veggie Platters • Gourmet Baskets
              </h2>
            </div>
            <p className="text-sm text-warm-gray leading-relaxed">
              Elevate your boardroom meetings, office celebrations, and private receptions with ready-to-serve artisanal platters overflowing with fresh seasonal berries, exotic fruits, imported cheeses, and chocolate treats.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="relative h-40 overflow-hidden shadow-card border border-cloud">
                <Image src="/products/prod-4.jpg" alt="Fruit Platter Tray" fill sizes="(max-width: 768px) 50vw, 250px" className="object-cover" />
              </div>
              <div className="relative h-40 overflow-hidden shadow-card border border-cloud">
                <Image src="/products/prod-6.jpg" alt="Veggie & Gourmet Basket" fill sizes="(max-width: 768px) 50vw, 250px" className="object-cover" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-80 sm:h-96 overflow-hidden shadow-lifted border-4 border-white">
              <Image src="/products/prod-3.jpg" alt="Rich Charcuterie Board & Fruit Display" fill sizes="(max-width: 1024px) 100vw, 650px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-blush bg-primary/80 px-3 py-1 rounded-full">
                  Artisanal Catering
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mt-2">Executive Office Platters & Charcuterie Trays</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          B2B OFFERINGS SHOWCASE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="b2b-offerings" className="py-10 sm:py-14 bg-background-secondary">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
                Tailored Services
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                Our Signature B2B Solutions
              </h2>
            </div>
            <p className="text-sm text-warm-gray max-w-md">
              Whether you need 25 employee gift boxes or a 6-foot fruit table for 300 guests, we scale perfectly to your requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {b2bServices.map((service, idx) => (
              <div key={idx} className="bg-white overflow-hidden border border-cloud shadow-card flex flex-col sm:flex-row group hover:shadow-lifted transition-all duration-300">
                <div className="relative w-full sm:w-2/5 h-56 sm:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {service.badge}
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal mb-2">{service.title}</h3>
                    <p className="text-xs text-warm-gray leading-relaxed mb-3">{service.description}</p>
                    <ul className="space-y-1.5 mb-4">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-charcoal">
                          <CheckCircle2 size={14} className="text-primary shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="#quote-section"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors whitespace-nowrap"
                  >
                    Request Quote for this Offering →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHY CHOOSE HISNA GIFTS (EXACT REFERENCE DESIGN WITH EMBLA SLIDER)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="py-10 sm:py-14 bg-[#325247] text-white border-b border-cloud">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 mb-1 block">
              Established 2018
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Why Choose Hisna Gifts
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-serif mt-3">
              Hisna Gifts began its operations in 2018 with a passion for transforming fresh fruit and premium chocolate into memorable gifts and impressive event displays. Every creation is made to order, carefully handcrafted and customized for your occasion. From thoughtful personal gifts to large celebrations, we bring creativity, freshness and beautiful presentation to every detail, making each moment feel truly special.
            </p>
          </div>

          {/* Smooth Embla Image Slider */}
          <WhyChooseUsSlider />

          {/* Bottom 2-Column Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-5xl mx-auto pt-8 border-t border-white/15">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                Made Fresh to Order
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed font-serif">
                Every creation is handcrafted using fresh fruit, premium chocolate and careful attention to detail.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                Customized for You
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed font-serif">
                Colours, flavours, presentation and scale are tailored to your occasion, theme and guest count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INTERACTIVE CALCULATOR & QUOTE FORM SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="quote-section" className="py-10 sm:py-14 bg-background-secondary">
        <div className="w-full max-w-7xl mx-auto px-6">
          <B2BQuoteFormWrapper />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CTA BANNER: LET'S CREATE SOMETHING UNFORGETTABLE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 bg-white border-t border-cloud">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block">
              Get Started Today
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal leading-tight">
              Let's Create Something Unforgettable
            </h2>
            <p className="text-base text-warm-gray leading-relaxed max-w-xl">
              Tell us about your occasion, guest count and vision. We'll create a fresh, customized experience for your celebration.
            </p>
            <div>
              <a
                href="#b2b-quote-form"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-primary text-white hover:bg-primary-dark rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-glow hover:shadow-lifted transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Request a Quote
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md h-80 sm:h-96 overflow-hidden shadow-lifted border-4 border-white">
              <Image
                src="/products/prod-2.jpg"
                alt="Unforgettable Event Fruit Display"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                <p className="font-serif text-lg font-bold">Hisna Gifts Corporate & Event Catering</p>
                <p className="text-xs text-blush">Toronto • Milton • Mississauga • GTA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
