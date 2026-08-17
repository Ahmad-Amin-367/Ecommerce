'use client';
import { useState } from 'react';
import B2BCalculator from './B2BCalculator';
import B2BQuoteForm from './B2BQuoteForm';

export default function B2BQuoteFormWrapper() {
  const [calculatorSelection, setCalculatorSelection] = useState({});

  return (
    <div className="space-y-12">
      {/* 1. Interactive Estimator Widget — Commented out for now
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
            Step 1: Estimate Your Investment
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
            Calculate Your B2B Budget Target
          </h2>
          <p className="text-xs text-warm-gray mt-1">
            Adjust guest count and service parameters below to view instant estimations.
          </p>
        </div>
        <B2BCalculator onSelectService={setCalculatorSelection} />
      </div>
      */}

      {/* 2. Official Quote Form */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#325247] mb-2 block">
            Submit Details
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#325247]">
            Lock In Your Corporate Quote Request
          </h2>
        </div>
        <B2BQuoteForm initialValues={calculatorSelection} />
      </div>
    </div>
  );
}
