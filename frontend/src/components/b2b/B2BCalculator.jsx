'use client';
import { useState } from 'react';
import { Calculator, CheckCircle2, Sparkles, Users, Gift, UtensilsCrossed, ArrowRight } from 'lucide-react';

const serviceRates = [
  {
    id: 'gift-boxes',
    name: 'Corporate Gift Boxes',
    basePricePerUnit: 35,
    icon: Gift,
    description: 'Custom chocolate & fruit boxes with corporate logos',
  },
  {
    id: 'fruit-table',
    name: 'Wedding & Event Fruit Tables',
    basePricePerUnit: 12,
    icon: UtensilsCrossed,
    description: '4ft to 6ft show-stopping handcrafted fruit arrangements',
  },
  {
    id: 'live-station',
    name: 'Live Dipping Station',
    basePricePerUnit: 18,
    icon: Sparkles,
    description: 'Live chocolate dipping station with fresh fruit & toppings',
  },
];

export default function B2BCalculator({ onSelectService }) {
  const [selectedService, setSelectedService] = useState(serviceRates[0]);
  const [guestCount, setGuestCount] = useState(75);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [includeCustomToppings, setIncludeCustomToppings] = useState(true);

  // Calculate estimated total range
  const calculateEstimate = () => {
    let base = selectedService.basePricePerUnit * guestCount;
    if (includeBranding) base += 150;
    if (includeCustomToppings) base += guestCount * 2.5;

    const minEstimate = Math.round(base * 0.9);
    const maxEstimate = Math.round(base * 1.15);
    return { minEstimate, maxEstimate };
  };

  const { minEstimate, maxEstimate } = calculateEstimate();

  const handleApplyToForm = () => {
    if (onSelectService) {
      onSelectService({
        serviceType: selectedService.name,
        guestCount: `${guestCount} Guests/Units`,
        budgetRange: `$${minEstimate.toLocaleString()} - $${maxEstimate.toLocaleString()}`,
      });
    }
    const formElement = document.getElementById('b2b-quote-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-cloud p-6 sm:p-8 shadow-lifted">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary-glow flex items-center justify-center text-primary">
          <Calculator size={22} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-charcoal">Instant B2B Quote Estimator</h3>
          <p className="text-xs text-warm-gray">Get a real-time estimate for your bulk order or event</p>
        </div>
      </div>

      {/* Service Selection */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
          1. Select Offering Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {serviceRates.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService.id === service.id;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-glow shadow-sm'
                    : 'border-cloud hover:border-cloud-dark hover:bg-background-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-cloud text-warm-gray'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  {isSelected && <CheckCircle2 size={18} className="text-primary" />}
                </div>
                <h4 className="font-semibold text-sm text-charcoal mb-1">{service.name}</h4>
                <p className="text-[11px] text-warm-gray line-clamp-2">{service.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest / Quantity Slider */}
      <div className="mb-6 bg-background rounded-2xl p-5 border border-cloud">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
            <Users size={14} className="text-primary" />
            2. Estimated Guest Count / Quantity
          </label>
          <span className="text-base font-bold text-primary bg-white px-3 py-1 rounded-full border border-cloud">
            {guestCount} {selectedService.id === 'gift-boxes' ? 'Units' : 'Guests'}
          </span>
        </div>

        <input
          type="range"
          min="20"
          max="500"
          step="5"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="w-full h-2 bg-cloud rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[11px] text-warm-gray mt-2">
          <span>20 guests</span>
          <span>150 guests</span>
          <span>500+ guests</span>
        </div>
      </div>

      {/* Add-ons Checkboxes */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-3 p-3.5 rounded-xl border border-cloud bg-white hover:bg-background-hover cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={includeBranding}
            onChange={(e) => setIncludeBranding(e.target.checked)}
            className="w-4 h-4 text-primary accent-primary rounded"
          />
          <div>
            <p className="text-xs font-semibold text-charcoal">Custom Logo Plaques / Packaging</p>
            <p className="text-[10px] text-warm-gray">Ribbons, branded cards & laser-engraved tags</p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3.5 rounded-xl border border-cloud bg-white hover:bg-background-hover cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={includeCustomToppings}
            onChange={(e) => setIncludeCustomToppings(e.target.checked)}
            className="w-4 h-4 text-primary accent-primary rounded"
          />
          <div>
            <p className="text-xs font-semibold text-charcoal">Premium Dipping & Flavours</p>
            <p className="text-[10px] text-warm-gray">Belgian chocolate, gold leaf & crushed nuts</p>
          </div>
        </label>
      </div>

      {/* Estimated Output Box */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-4 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wider">Estimated Investment Range</p>
          <div className="text-xl sm:text-3xl font-serif font-bold mt-0.5 sm:mt-1">
            ${minEstimate.toLocaleString()} — ${maxEstimate.toLocaleString()}
            <span className="text-xs font-normal text-white/80 ml-1.5">CAD</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-white/80 mt-1">*Final quote includes delivery, setup & volume discounts</p>
        </div>

        <button
          type="button"
          onClick={handleApplyToForm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-white text-primary rounded-full font-bold text-xs sm:text-sm hover:bg-background-hover transition-colors shadow-md cursor-pointer shrink-0 text-center"
        >
          <span>Lock in Quote Request</span>
          <ArrowRight size={16} className="shrink-0" />
        </button>
      </div>
    </div>
  );
}
