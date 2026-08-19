import Link from 'next/link';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Gift, Heart, Building2, Headphones, Leaf, Truck, ShieldCheck } from 'lucide-react';

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-inter">
      <AnnouncementBar />

      <main className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="pt-16 pb-12 text-center px-4">
          <div className="flex justify-center items-center gap-2 mb-2 text-primary font-serif">
            <Gift size={28} />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hisna Gifts</h1>
          </div>
          <p className="text-warm-gray text-xs sm:text-sm tracking-widest uppercase mb-10">Crafted With Love, Made To Impress</p>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal mb-4">
            Welcome to <span className="text-[#C67D5C]">Hisna Gifts</span>
          </h2>

          <div className="flex items-center justify-center gap-4 text-[#C67D5C]">
            <div className="h-px bg-[#F5E6E1] w-16"></div>
            <Heart size={16} />
            <div className="h-px bg-[#F5E6E1] w-16"></div>
          </div>

          <p className="mt-4 text-warm-gray text-sm">Choose your gifting experience</p>
        </div>

        {/* Cards Section */}
        <div className="max-w-5xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">

          {/* B2C Card */}
          <div className="rounded-3xl overflow-hidden shadow-card hover:shadow-lifted transition-shadow bg-[#FDF3F0] flex flex-col group border border-white">
            {/* Image */}
            <div className="h-[280px] w-full relative border-b border-white">
              <Image src="/landing-page/landing-page-img-1.jpg" alt="Personal Gifting" fill className="object-cover" />
              {/* Icon Circle */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md text-[#C67D5C] z-10">
                <Gift size={26} strokeWidth={1.5} />
              </div>
            </div>

            <div className="pt-14 pb-12 px-8 text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Personal Gifting</h3>
              <div className="flex items-center justify-center gap-2 text-[#C67D5C]/50 mb-5">
                <div className="h-px bg-[#C67D5C]/20 w-8"></div>
                <Heart size={12} className="text-[#C67D5C]/30" />
                <div className="h-px bg-[#C67D5C]/20 w-8"></div>
              </div>
              <p className="text-charcoal/70 mb-10 max-w-[290px] mx-auto text-sm leading-relaxed">
                Thoughtful gifts for life's special moments. Birthdays, Anniversaries, Eid and more.
              </p>
              <div className="mt-auto">
                <Link href="/b2c" className="inline-flex items-center justify-center bg-[#C67D5C] text-white px-4 sm:px-5 md:px-7 py-3 sm:py-3.5 rounded-full text-[11px] sm:text-[12px] md:text-[13px] font-bold tracking-wider hover:bg-[#b06c4d] transition-colors uppercase shadow-sm whitespace-nowrap">
                  Explore Personal Gifts &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* B2B Card */}
          <div className="rounded-3xl overflow-hidden shadow-card hover:shadow-lifted transition-shadow bg-[#F2F5F0] flex flex-col group border border-white">
            {/* Image */}
            <div className="h-[280px] w-full relative border-b border-white">
              <Image src="/landing-page/landing-page-img-2.png" alt="Events & Corporate" fill className="object-cover" />
              {/* Icon Circle */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md text-[#7D8F73] z-10">
                <Building2 size={26} strokeWidth={1.5} />
              </div>
            </div>

            <div className="pt-14 pb-12 px-8 text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Weddings, Events & Corporate</h3>
              <div className="flex items-center justify-center gap-2 text-[#7D8F73]/50 mb-5">
                <div className="h-px bg-[#7D8F73]/20 w-8"></div>
                <Heart size={12} className="text-[#7D8F73]/30" />
                <div className="h-px bg-[#7D8F73]/20 w-8"></div>
              </div>
              <p className="text-charcoal/70 mb-10 max-w-[290px] mx-auto text-sm leading-relaxed">
                Elevate your celebrations and business gifting with stunning edible arrangements.
              </p>
              <div className="mt-auto">
                <Link href="/b2b" className="inline-flex items-center justify-center bg-[#325247] text-white px-4 sm:px-5 md:px-7 py-3 sm:py-3.5 rounded-full text-[11px] sm:text-[12px] md:text-[13px] font-bold tracking-wider hover:bg-[#3e6859] transition-colors uppercase shadow-sm whitespace-nowrap">
                  Explore Events & Corporate &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Section */}
        <div className="mb-20 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-white py-4 px-6 sm:px-8 rounded-[2rem] shadow-sm max-w-fit mx-auto border border-cloud">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF3F0] text-[#C67D5C] flex items-center justify-center shrink-0">
                <Headphones size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-charcoal">Not sure which one is right for you?</p>
                <p className="text-[13px] text-warm-gray mt-0.5">We're here to help you find the perfect gift.</p>
              </div>
            </div>
            <div className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4 flex justify-center">
              <Link href="/contact" className="w-full sm:w-auto text-center border-2 border-[#C67D5C] text-[#C67D5C] hover:bg-[#C67D5C] hover:text-white transition-colors px-6 py-2 rounded-full text-[13px] font-bold tracking-wider uppercase">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Features Footer */}
      <div className="bg-[#FDF3F0] py-10 border-t border-[#F5E6E1]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <div className="flex items-start justify-center sm:justify-start gap-4">
            <Leaf className="text-[#C67D5C] shrink-0" size={26} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-charcoal text-sm">Made Fresh</h4>
              <p className="text-[13px] text-charcoal/70 mt-1 leading-relaxed">Every arrangement<br />made to order</p>
            </div>
          </div>
          <div className="flex items-start justify-center sm:justify-start gap-4">
            <Heart className="text-[#C67D5C] shrink-0" size={26} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-charcoal text-sm">Made With Love</h4>
              <p className="text-[13px] text-charcoal/70 mt-1 leading-relaxed">Handcrafted with care<br />and perfection</p>
            </div>
          </div>
          <div className="flex items-start justify-center sm:justify-start gap-4">
            <Truck className="text-[#C67D5C] shrink-0" size={26} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-charcoal text-sm">Local Delivery</h4>
              <p className="text-[13px] text-charcoal/70 mt-1 leading-relaxed">Delivery across GTA<br />and surrounding areas</p>
            </div>
          </div>
          <div className="flex items-start justify-center sm:justify-start gap-4">
            <ShieldCheck className="text-[#C67D5C] shrink-0" size={26} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-charcoal text-sm">Secure Checkout</h4>
              <p className="text-[13px] text-charcoal/70 mt-1 leading-relaxed">Safe and secure<br />payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
