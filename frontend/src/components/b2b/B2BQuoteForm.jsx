'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '@/store/authStore';
import b2bService from '@/services/b2bService';
import { Send, CheckCircle, Building, User, Mail, Phone, Calendar, Users, DollarSign, FileText, Sparkles, Loader2 } from 'lucide-react';

// North American / Canadian Phone Number Regex
const canadianPhoneRegex = /^(\+?1[-. ]?)?\(?([2-9][0-9]{2})\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/;

const quoteValidationSchema = Yup.object({
  companyName: Yup.string()
    .trim()
    .required('Company / Organization name is required'),
  contactName: Yup.string()
    .trim()
    .required('Contact person name is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Work email address is required'),
  phone: Yup.string()
    .trim()
    .required('Phone number is required')
    .matches(
      canadianPhoneRegex,
      'Please enter a valid Canadian phone number (e.g. 416-555-0123 or +1 647 555 0123)'
    ),
  eventDate: Yup.string().nullable(),
  eventType: Yup.string().required('Please select an occasion / event type'),
  serviceType: Yup.string().required('Please select a service required'),
  guestCount: Yup.string().required('Please select estimated guest count / units'),
  budgetRange: Yup.string().required('Please select an estimated budget target'),
  notes: Yup.string(),
});

export default function B2BQuoteForm({ initialValues = {} }) {
  const { user } = useAuthStore();
  const [submittedQuote, setSubmittedQuote] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      companyName: initialValues.companyName || '',
      contactName: user?.name || initialValues.contactName || '',
      email: user?.email || initialValues.email || '',
      phone: user?.phone || initialValues.phone || '',
      eventDate: initialValues.eventDate || '',
      eventType: initialValues.eventType || '',
      serviceType: initialValues.serviceType || '',
      guestCount: initialValues.guestCount || '',
      budgetRange: initialValues.budgetRange || '',
      notes: initialValues.notes || '',
    },
    enableReinitialize: true,
    validationSchema: quoteValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMsg('');
      try {
        const res = await b2bService.submitQuote(values);
        setSubmittedQuote(res.data || res);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to submit quote request. Please check details and try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (submittedQuote) {
    return (
      <div id="b2b-quote-form" className="bg-[#e9f0eb] rounded-3xl border border-[#325247]/20 p-8 sm:p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-[#325247] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle size={32} />
        </div>
        <span className="inline-block px-3 py-1 bg-white text-[#325247] border border-cloud rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          Quote Reference: {submittedQuote.quoteNumber}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-4">
          Quote Request Received!
        </h3>
        <p className="text-warm-gray text-base max-w-lg mx-auto mb-6 leading-relaxed">
          Thank you, <strong className="text-charcoal">{submittedQuote.contactName}</strong>. We have received the B2B inquiry for <strong className="text-[#325247]">{submittedQuote.companyName}</strong>. Our corporate event specialist will contact you within 24 business hours.
        </p>
        
        <div className="bg-white rounded-2xl p-6 border border-cloud max-w-md mx-auto text-left mb-8 shadow-sm space-y-2 text-sm text-warm-gray">
          <div className="flex justify-between">
            <span className="font-semibold text-charcoal">Service:</span>
            <span>{submittedQuote.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-charcoal">Event Type:</span>
            <span>{submittedQuote.eventType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-charcoal">Quantity/Guests:</span>
            <span>{submittedQuote.guestCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmittedQuote(null);
            formik.resetForm();
          }}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#325247] text-white rounded-full font-bold text-xs sm:text-sm whitespace-nowrap hover:bg-[#253e35] transition-all cursor-pointer shadow-sm"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form id="b2b-quote-form" onSubmit={formik.handleSubmit} className="bg-white rounded-3xl border border-cloud p-4 sm:p-8 lg:p-10 shadow-lifted">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h3 className="font-serif text-xl sm:text-3xl font-bold text-charcoal">
          Request a Custom B2B Quote
        </h3>
        <p className="text-xs sm:text-sm text-warm-gray mt-1">
          Tell us about your event, headcount, and custom branding requirements. We respond within 24 hours.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Building size={14} className="text-[#325247]" />
            Company / Organization Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. Acme Corp, GTA Weddings"
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-charcoal placeholder:text-text-muted focus:outline-none transition-all ${
              formik.touched.companyName && formik.errors.companyName
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          />
          {formik.touched.companyName && formik.errors.companyName && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.companyName}</p>
          )}
        </div>

        {/* Contact Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <User size={14} className="text-[#325247]" />
            Contact Person Name *
          </label>
          <input
            type="text"
            name="contactName"
            value={formik.values.contactName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Your full name"
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-charcoal placeholder:text-text-muted focus:outline-none transition-all ${
              formik.touched.contactName && formik.errors.contactName
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          />
          {formik.touched.contactName && formik.errors.contactName && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.contactName}</p>
          )}
        </div>

        {/* Corporate Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Mail size={14} className="text-[#325247]" />
            Work Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="name@company.com"
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-charcoal placeholder:text-text-muted focus:outline-none transition-all ${
              formik.touched.email && formik.errors.email
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.email}</p>
          )}
        </div>

        {/* Canadian Phone Number with Yup Validation */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Phone size={14} className="text-[#325247]" />
            Canadian Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. 416-555-0123 or +1 647 555 0123"
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-charcoal placeholder:text-text-muted focus:outline-none transition-all ${
              formik.touched.phone && formik.errors.phone
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.phone}</p>
          )}
        </div>

        {/* Event Type Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#325247]" />
            Occasion / Event Type *
          </label>
          <select
            name="eventType"
            value={formik.values.eventType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white focus:outline-none transition-all cursor-pointer ${
              !formik.values.eventType ? 'text-text-muted' : 'text-charcoal'
            } ${
              formik.touched.eventType && formik.errors.eventType
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          >
            <option value="" disabled hidden>Select an option</option>
            <option value="Corporate Event">Corporate Event / Gala</option>
            <option value="Employee Appreciation">Employee Appreciation & Gifting</option>
            <option value="Wedding">Wedding Celebration</option>
            <option value="Client Gifting">Executive Client Gifting</option>
            <option value="Holiday Celebration">Holiday & Festive Ordering</option>
            <option value="Bulk Wholesale">Bulk Wholesale / Retail Ordering</option>
            <option value="Other">Other Custom Celebration</option>
          </select>
          {formik.touched.eventType && formik.errors.eventType && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.eventType}</p>
          )}
        </div>

        {/* Service Type Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <FileText size={14} className="text-[#325247]" />
            Primary Service Required *
          </label>
          <select
            name="serviceType"
            value={formik.values.serviceType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white focus:outline-none transition-all cursor-pointer ${
              !formik.values.serviceType ? 'text-text-muted' : 'text-charcoal'
            } ${
              formik.touched.serviceType && formik.errors.serviceType
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          >
            <option value="" disabled hidden>Select an option</option>
            <option value="Weddings">Weddings</option>
            <option value="Corporate Gifting">Corporate Gifting</option>
            <option value="Fruit Tables">Fruit Tables</option>
            <option value="Dessert Cups">Dessert Cups</option>
            <option value="Chocolate Fountain">Chocolate Fountain</option>
            <option value="Custom Displays">Custom Displays</option>
          </select>
          {formik.touched.serviceType && formik.errors.serviceType && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.serviceType}</p>
          )}
        </div>

        {/* Headcount / Quantity Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Users size={14} className="text-[#325247]" />
            Estimated Guest Count / Units *
          </label>
          <select
            name="guestCount"
            value={formik.values.guestCount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white focus:outline-none transition-all cursor-pointer ${
              !formik.values.guestCount ? 'text-text-muted' : 'text-charcoal'
            } ${
              formik.touched.guestCount && formik.errors.guestCount
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-cloud focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20'
            }`}
          >
            <option value="" disabled hidden>Select an option</option>
            <option value="15-30 Guests">15 - 30 Guests / Units</option>
            <option value="30-75 Guests">30 - 75 Guests / Units</option>
            <option value="75-150 Guests">75 - 150 Guests / Units</option>
            <option value="150-300 Guests">150 - 300 Guests / Units</option>
            <option value="300+ Guests">300+ Guests / Units</option>
          </select>
          {formik.touched.guestCount && formik.errors.guestCount && (
            <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.guestCount}</p>
          )}
        </div>

        {/* Target Event Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Calendar size={14} className="text-[#325247]" />
            Target Delivery / Event Date
          </label>
          <input
            type="date"
            name="eventDate"
            value={formik.values.eventDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 rounded-xl border border-cloud text-sm font-medium text-charcoal bg-white focus:outline-none focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20 transition-all"
          />
        </div>
      </div>

      {/* Budget Range Selection */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
          <DollarSign size={14} className="text-[#325247]" />
          Estimated Budget Target (CAD) *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['$250 - $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500+'].map((budget) => (
            <button
              key={budget}
              type="button"
              onClick={() => formik.setFieldValue('budgetRange', budget)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                formik.values.budgetRange === budget
                  ? 'bg-[#325247] text-white border-[#325247] shadow-sm'
                  : formik.touched.budgetRange && formik.errors.budgetRange
                  ? 'bg-white text-charcoal border-error'
                  : 'bg-white text-charcoal border-cloud hover:border-cloud-dark'
              }`}
            >
              {budget}
            </button>
          ))}
        </div>
        {formik.touched.budgetRange && formik.errors.budgetRange && (
          <p className="text-xs text-error mt-1.5 font-semibold">{formik.errors.budgetRange}</p>
        )}
      </div>

      {/* Custom Notes */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#2c3e35] mb-2 font-semibold">
          Customization Requirements & Notes
        </label>
        <textarea
          name="notes"
          rows={3}
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Specify dietary restrictions, corporate branding colors, plaque details, delivery address, or special setup requests..."
          className="w-full px-4 py-3 rounded-xl border border-cloud text-sm font-medium text-charcoal placeholder:text-text-muted focus:outline-none focus:border-[#325247] focus:ring-2 focus:ring-[#325247]/20 transition-all resize-none"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 px-3 sm:px-6 bg-[#325247] hover:bg-[#253e35] text-white rounded-2xl font-bold text-xs sm:text-sm md:text-base tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 text-center"
      >
        {formik.isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin shrink-0" />
            <span className="truncate">Submitting Quote...</span>
          </>
        ) : (
          <>
            <Send size={16} className="shrink-0" />
            <span className="text-center leading-tight">Submit Official B2B Quote Request</span>
          </>
        )}
      </button>
    </form>
  );
}
