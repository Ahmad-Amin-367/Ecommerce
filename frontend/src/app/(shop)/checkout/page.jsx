'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/useCart';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import deliveryService from '@/services/deliveryService';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  ChevronLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Truck,
  Store,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { postcodeValidator } from 'postcode-validator';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated, isAuthChecked } = useAuthStore();

  const items = useMemo(() => cart?.items || [], [cart?.items]);
  const subtotal = cart?.subtotal || 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('STRIPE'); // 'STRIPE' | 'CASH_ON_DELIVERY'

  // Fulfillment State: 'DELIVERY' | 'PICKUP'
  const [fulfillmentType, setFulfillmentType] = useState('DELIVERY');

  // Delivery Settings from backend
  const [deliverySettings, setDeliverySettings] = useState({
    pickupEnabled: true,
    pickupLocationName: 'Milton, ON',
    pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
    unservicedAreaMessage:
      'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
    eventSetupMessage:
      'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
  });

  // Delivery calculation state
  const [deliveryStatus, setDeliveryStatus] = useState({
    isLoading: false,
    isAvailable: false,
    fee: null,
    zoneName: '',
    isUnserviced: false,
    unservicedAreaMessage: '',
    isEventSetup: false,
    eventSetupMessage: '',
    message: '',
    fsa: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  // Prefill user details
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const formattedInitialPhone = user.phone ? new AsYouType('CA').input(user.phone) : '';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        email: prev.email || user.email || '',
        phone: prev.phone || formattedInitialPhone,
      }));
    }
  }, [user]);

  // Auth redirect
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthChecked, isAuthenticated, router]);

  // Load delivery settings
  useEffect(() => {
    deliveryService
      .getSettings()
      .then((res) => {
        if (res.data?.data) {
          setDeliverySettings(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load delivery settings:', err));
  }, []);

  // Real-time calculation of delivery fee
  const calculateFee = useCallback(
    async (type, postal) => {
      if (type === 'PICKUP') {
        setDeliveryStatus({
          isLoading: false,
          isAvailable: true,
          fee: 0,
          zoneName: 'Free Store Pickup (Milton)',
          isUnserviced: false,
          isEventSetup: false,
          message: '',
          fsa: '',
        });
        return;
      }

      const trimmedPostal = (postal || '').trim();

      // Step 1: FRONTEND VALIDATION FIRST using postcode-validator library.
      // Must be a valid Canadian postal code before ANY API call is made.
      const isValidCanadian = Boolean(trimmedPostal && postcodeValidator(trimmedPostal, 'CA'));

      if (!isValidCanadian) {
        setDeliveryStatus({
          isLoading: false,
          isAvailable: false,
          fee: null,
          zoneName: '',
          isUnserviced: false,
          isEventSetup: false,
          message:
            trimmedPostal.length === 0
              ? 'Please enter your Canadian postal code (e.g. L9T 4B2)'
              : 'Please enter a valid Canadian postal code (e.g. L9T 4B2)',
          fsa: '',
        });
        // STOP HERE: Do not call the backend API if postal code is not a valid Canadian postal code
        return;
      }

      // Step 2: Postal code is confirmed valid for Canada! Call API for delivery availability and charges.
      const fsa = trimmedPostal.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase();
      setDeliveryStatus((prev) => ({ ...prev, isLoading: true, fsa, message: '' }));

      try {
        const payload = {
          postalCode: trimmedPostal,
          fulfillmentType: 'DELIVERY',
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        };

        const res = await deliveryService.calculateFee(payload);
        const data = res.data?.data;

        if (data?.isEventSetup) {
          setDeliveryStatus({
            isLoading: false,
            isAvailable: false,
            fee: null,
            zoneName: '',
            isUnserviced: false,
            isEventSetup: true,
            eventSetupMessage:
              data.eventSetupMessage || deliverySettings.eventSetupMessage,
            message: '',
            fsa,
          });
        } else if (data?.isAvailable) {
          setDeliveryStatus({
            isLoading: false,
            isAvailable: true,
            fee: Number(data.fee),
            zoneName: data.zoneName || 'Local Delivery',
            isUnserviced: false,
            isEventSetup: false,
            message: '',
            fsa,
          });
        } else if (data?.isUnserviced) {
          setDeliveryStatus({
            isLoading: false,
            isAvailable: false,
            fee: null,
            zoneName: '',
            isUnserviced: true,
            unservicedAreaMessage:
              data.unservicedAreaMessage || deliverySettings.unservicedAreaMessage,
            isEventSetup: false,
            message: '',
            fsa,
          });
        } else {
          setDeliveryStatus({
            isLoading: false,
            isAvailable: false,
            fee: null,
            zoneName: '',
            isUnserviced: true,
            unservicedAreaMessage:
              data?.message || deliverySettings.unservicedAreaMessage,
            isEventSetup: false,
            message: '',
            fsa,
          });
        }
      } catch (err) {
        console.error('Delivery calculation error:', err);
        setDeliveryStatus({
          isLoading: false,
          isAvailable: false,
          fee: null,
          zoneName: '',
          isUnserviced: false,
          isEventSetup: false,
          message: 'Unable to calculate delivery fee. Please try again.',
          fsa,
        });
      }
    },
    [deliverySettings, items]
  );

  // Debounced effect for postal code changes
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateFee(fulfillmentType, formData.postalCode);
    }, 400);

    return () => clearTimeout(timer);
  }, [calculateFee, fulfillmentType, formData.postalCode]);

  // Effective shipping fee and total calculation
  const shippingFee = useMemo(() => {
    if (fulfillmentType === 'PICKUP') return 0;
    if (deliveryStatus.isAvailable && deliveryStatus.fee !== null) {
      return deliveryStatus.fee;
    }
    return null;
  }, [fulfillmentType, deliveryStatus]);

  const total = useMemo(() => {
    return subtotal + (shippingFee !== null ? shippingFee : 0);
  }, [subtotal, shippingFee]);

  // Enforce Canadian phone validation with libphonenumber-js
  const isPhoneValid = useMemo(() => {
    if (!formData.phone || typeof formData.phone !== 'string') return false;
    const parsed = parsePhoneNumberFromString(formData.phone, 'CA');
    return Boolean(parsed && parsed.country === 'CA' && parsed.isValid());
  }, [formData.phone]);

  // Enforce Canadian postal code validation with postcode-validator library
  const isPostalCodeValid = useMemo(() => {
    const trimmed = (formData.postalCode || '').trim();
    return Boolean(trimmed && postcodeValidator(trimmed, 'CA'));
  }, [formData.postalCode]);

  // Check if delivery checkout submission is blocked
  const isDeliveryBlocked = useMemo(() => {
    if (fulfillmentType === 'PICKUP') return false;
    if (!isPostalCodeValid) return true;
    return (
      deliveryStatus.isLoading ||
      !deliveryStatus.isAvailable ||
      deliveryStatus.isEventSetup ||
      deliveryStatus.isUnserviced
    );
  }, [fulfillmentType, isPostalCodeValid, deliveryStatus]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Auto-format as Canadian phone number as user types
      const formatted = new AsYouType('CA').input(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isPhoneValid) {
      toast.error('Please enter a valid Canadian phone number for delivery (e.g. (905) 555-0123)');
      return;
    }

    if (fulfillmentType === 'DELIVERY' && !isPostalCodeValid) {
      toast.error('Please enter a valid Canadian postal code (e.g. L9T 4B2)');
      return;
    }

    if (fulfillmentType === 'DELIVERY' && !deliveryStatus.isAvailable) {
      if (deliveryStatus.isEventSetup) {
        toast.error('Your cart includes event setup items. Please contact us for a delivery quote.');
      } else if (deliveryStatus.isUnserviced) {
        toast.error('Delivery is unavailable to this postal code. Please contact us or choose Milton Store Pickup.');
      } else {
        toast.error('Please enter a valid Canadian postal code to calculate delivery fee.');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedPhone = parsePhoneNumberFromString(formData.phone, 'CA');
      const canonicalPhone = parsedPhone ? parsedPhone.formatNational() : formData.phone;

      // 1. Create the Order in Database (PENDING state)
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        fulfillmentType: fulfillmentType,
        shippingAddress:
          fulfillmentType === 'DELIVERY'
            ? {
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
            }
            : null,
        paymentMethod: paymentMethod,
        notes: formData.notes,
        guestInfo: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: canonicalPhone,
        },
      };

      const res = await api.post('/orders', payload);
      const createdOrder = res.data.data;

      // 2. Handle Payment Method Branch
      if (paymentMethod === 'CASH_ON_DELIVERY') {
        clearCart();
        toast.success(
          fulfillmentType === 'PICKUP'
            ? 'Order placed successfully! Pay upon store pickup.'
            : 'Order placed successfully!'
        );
        router.push(`/checkout/confirmation?orderId=${createdOrder.id}`);
      } else if (paymentMethod === 'STRIPE') {
        // 3. For Card (Stripe), redirect to the dedicated payment page
        router.push(`/checkout/payment?orderId=${createdOrder.id}`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to process checkout. Please check your information.'
      );
      setIsSubmitting(false);
    }
  };

  if (!isAuthChecked || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary font-medium">Verifying login status...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-charcoal mb-4">Your Cart is Empty</h1>
        <p className="text-text-secondary mb-8">Add some beautiful gifts to your cart before checking out.</p>
        <Link href="/">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => useCartStore.getState().openCart()}
            className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className="mr-1" />
            Edit Cart
          </button>
          <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
            <ShieldCheck size={16} />
            Secure Encrypted Checkout
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12">
          {/* Left: Checkout Form */}
          <div className="w-full lg:w-3/5">
            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              {/* Fulfillment Switcher */}
              <div className="mb-8">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">
                  Choose Fulfillment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Option */}
                  <div
                    onClick={() => setFulfillmentType('DELIVERY')}
                    className={`border-2 rounded-xl p-4 flex items-center gap-3.5 cursor-pointer transition-all ${fulfillmentType === 'DELIVERY'
                        ? 'border-primary bg-primary-glow/40 shadow-xs'
                        : 'border-cloud hover:border-primary/40 bg-white'
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fulfillmentType === 'DELIVERY'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-cream text-charcoal'
                        }`}
                    >
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-charcoal">Local Delivery</span>
                        <span className="text-[10px] bg-cream text-charcoal font-semibold px-2 py-0.5 rounded border border-cloud">
                          GTA Zones
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Free Milton delivery, Oakville, Burlington, Mississauga & Brampton
                      </p>
                    </div>
                  </div>

                  {/* Free Pickup Option */}
                  {deliverySettings.pickupEnabled && (
                    <div
                      onClick={() => setFulfillmentType('PICKUP')}
                      className={`border-2 rounded-xl p-4 flex items-center gap-3.5 cursor-pointer transition-all ${fulfillmentType === 'PICKUP'
                          ? 'border-primary bg-primary-glow/40 shadow-xs'
                          : 'border-cloud hover:border-primary/40 bg-white'
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fulfillmentType === 'PICKUP'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-cream text-charcoal'
                          }`}
                      >
                        <Store size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-charcoal">Store Pickup</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            FREE
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Pick up directly in Milton, Ontario
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Contact Details */}
              <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">First Name *</label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Last Name *</label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-charcoal">Phone Number *</label>
                    <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                      🇨🇦 Canadian (+1)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. (905) 555-0123"
                      className={`w-full h-11 px-4 bg-cream border rounded-lg outline-none transition-colors text-sm font-mono tracking-wide ${formData.phone && !isPhoneValid
                          ? 'border-error focus:border-error bg-red-50/20'
                          : formData.phone && isPhoneValid
                            ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/10'
                            : 'border-cloud focus:border-primary'
                        }`}
                    />
                    {formData.phone && (
                      <div className="absolute right-3 top-3 pointer-events-none">
                        {isPhoneValid ? (
                          <CheckCircle2 size={18} className="text-emerald-600" />
                        ) : (
                          <AlertCircle size={18} className="text-error" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.phone && !isPhoneValid ? (
                    <p className="text-xs text-error mt-1">
                      Please enter a valid Canadian phone number (e.g. (905) 555-0123)
                    </p>
                  ) : formData.phone && isPhoneValid ? (
                    <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Valid Canadian phone number for delivery coordination</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-text-muted mt-1">
                      Required for delivery updates & driver coordination upon arrival
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address OR Pickup Details */}
              {fulfillmentType === 'DELIVERY' ? (
                <>
                  <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Delivery Address</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-charcoal mb-1">Street Address *</label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors text-sm"
                      placeholder="Street address, unit, suite, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Milton, Oakville, Mississauga, etc."
                        className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-charcoal">
                          Postal Code *
                        </label>
                        <span className="text-[11px] text-text-muted font-mono">
                          🇨🇦 A1A 1A1
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="e.g. L9T 4B2"
                          className={`w-full h-11 px-4 bg-cream border rounded-lg outline-none transition-colors uppercase font-mono text-sm tracking-wider ${
                            formData.postalCode && !isPostalCodeValid
                              ? 'border-error focus:border-error bg-red-50/20'
                              : formData.postalCode && isPostalCodeValid && deliveryStatus.isAvailable
                              ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/10'
                              : 'border-cloud focus:border-primary'
                          }`}
                        />
                        {deliveryStatus.isLoading ? (
                          <div className="absolute right-3 top-3">
                            <Spinner size="sm" />
                          </div>
                        ) : formData.postalCode && isPostalCodeValid && deliveryStatus.isAvailable ? (
                          <div className="absolute right-3 top-3 pointer-events-none">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                          </div>
                        ) : formData.postalCode && !isPostalCodeValid ? (
                          <div className="absolute right-3 top-3 pointer-events-none">
                            <AlertCircle size={18} className="text-error" />
                          </div>
                        ) : null}
                      </div>
                      {formData.postalCode && !isPostalCodeValid && (
                        <p className="text-xs text-error mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>Please enter a valid Canadian postal code (e.g. L9T 4B2)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Real-Time Postal Code Status Feedback */}
                  <div className="mb-6">
                    {deliveryStatus.isLoading ? (
                      <p className="text-xs text-text-muted flex items-center gap-1.5 py-1">
                        <Spinner size="sm" />
                        <span>Calculating delivery fee for your postal code...</span>
                      </p>
                    ) : deliveryStatus.isEventSetup ? (
                      /* Event Setup Notice */
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Sparkles size={20} className="text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-purple-900">Event Order Delivery Notice</p>
                            <p className="text-xs text-purple-800 mt-0.5">
                              {deliveryStatus.eventSetupMessage || deliverySettings.eventSetupMessage}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/contact"
                          className="text-xs font-semibold px-3 py-1.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors shrink-0 text-center"
                        >
                          Request Setup Quote
                        </Link>
                      </div>
                    ) : deliveryStatus.isAvailable ? (
                      /* Serviced Area Match */
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-xs text-emerald-950">
                              {deliveryStatus.zoneName}
                            </span>
                            <span className="text-[11px] text-emerald-800 block">
                              Postal Prefix: {deliveryStatus.fsa}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full">
                          {deliveryStatus.fee === 0 ? 'FREE DELIVERY' : `${formatCurrency(deliveryStatus.fee)} Delivery Fee`}
                        </span>
                      </div>
                    ) : deliveryStatus.isUnserviced ? (
                      /* Unserviced Area / Rest of GTA */
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-950 space-y-3">
                        <div className="flex items-start gap-3">
                          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-amber-900">Delivery Zone Notice</p>
                            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                              {deliveryStatus.unservicedAreaMessage || deliverySettings.unservicedAreaMessage}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Link
                            href="/contact"
                            className="text-xs font-semibold px-3 py-1.5 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
                          >
                            Contact Hisna Gifts
                          </Link>
                          <button
                            type="button"
                            onClick={() => setFulfillmentType('PICKUP')}
                            className="text-xs font-semibold px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            Switch to Free Store Pickup
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Prompt for postal code */
                      <p className="text-xs text-text-muted flex items-center gap-1.5 py-1">
                        <HelpCircle size={14} />
                        <span>Enter your Canadian postal code (e.g. L9T 4B2) to check delivery availability & charges</span>
                      </p>
                    )}

                  </div>
                </>
              ) : (
                /* Free Pickup Information Banner */
                <div className="mb-6 bg-cream/70 border border-cloud rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2.5 text-primary">
                    <MapPin size={20} />
                    <h3 className="font-serif font-bold text-base text-charcoal">
                      Free Store Pickup Location
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">
                    {deliverySettings.pickupLocationName}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {deliverySettings.pickupAddress}
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>$0.00 Delivery Fee • We will notify you when your order is ready for collection</span>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-charcoal mb-1">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors resize-none text-sm"
                  placeholder="Special instructions for delivery, gift card message, or pickup timing..."
                />
              </div>

              {/* Payment Method Selection */}
              <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {/* Stripe Card Payment Option */}
                <div
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'STRIPE'
                      ? 'border-primary bg-primary-glow/60 shadow-sm'
                      : 'border-cloud hover:border-primary/40 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'STRIPE' ? 'border-primary' : 'border-gray-300'
                        }`}
                    >
                      {paymentMethod === 'STRIPE' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={20}
                        className={paymentMethod === 'STRIPE' ? 'text-primary' : 'text-text-secondary'}
                      />
                      <div>
                        <p
                          className={`font-medium text-sm ${paymentMethod === 'STRIPE' ? 'text-primary' : 'text-charcoal'
                            }`}
                        >
                          Credit / Debit Card (Stripe)
                        </p>
                        <p className="text-xs text-text-muted">Visa, Mastercard, Amex, Discover</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Instant & Secure
                  </span>
                </div>

                {/* Cash on Delivery / Pay on Pickup Option */}
                <div
                  onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-primary bg-primary-glow/60 shadow-sm'
                      : 'border-cloud hover:border-primary/40 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-primary' : 'border-gray-300'
                        }`}
                    >
                      {paymentMethod === 'CASH_ON_DELIVERY' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote
                        size={20}
                        className={paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-text-secondary'}
                      />
                      <div>
                        <p
                          className={`font-medium text-sm ${paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-charcoal'
                            }`}
                        >
                          {fulfillmentType === 'PICKUP' ? 'Pay on Pickup (Cash / Card)' : 'Cash on Delivery (COD)'}
                        </p>
                        <p className="text-xs text-text-muted">
                          {fulfillmentType === 'PICKUP'
                            ? 'Pay when you collect your order in Milton'
                            : 'Pay in cash when package arrives at your door'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isDeliveryBlocked || !isPhoneValid || isSubmitting}
                className={`w-full h-14 text-lg font-semibold shadow-md flex items-center justify-center gap-2 ${isDeliveryBlocked || !isPhoneValid
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer'
                  }`}
                isLoading={isSubmitting}
              >
                {isDeliveryBlocked ? (
                  deliveryStatus.isEventSetup ? (
                    'Custom Quote Required for Event Items'
                  ) : deliveryStatus.isUnserviced ? (
                    'Delivery Unavailable for Postal Code'
                  ) : (
                    'Please Enter Valid Postal Code'
                  )
                ) : !isPhoneValid ? (
                  'Please Enter Valid Canadian Phone'
                ) : paymentMethod === 'STRIPE' ? (
                  <>
                    <span>Continue to Payment ({formatCurrency(total)})</span>
                    <ArrowRight size={18} />
                  </>
                ) : (
                  `Place Order (${fulfillmentType === 'PICKUP' ? 'Pickup' : 'COD'} - ${formatCurrency(total)})`
                )}
              </Button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-cream/50 rounded-2xl border border-cloud p-6 sticky top-28 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-charcoal mb-6">Order Summary</h2>

              <ul className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-cloud shrink-0">
                      <Image
                        src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-sm font-medium text-charcoal line-clamp-1">
                        {item.product.name}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-cloud pt-4 flex flex-col gap-3">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Fulfillment</span>
                  <span className="font-medium text-charcoal">
                    {fulfillmentType === 'PICKUP' ? (
                      <span className="text-emerald-700 font-bold">Free Store Pickup</span>
                    ) : (
                      'Local Delivery'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-charcoal">
                    {fulfillmentType === 'PICKUP' ? (
                      <span className="text-emerald-700 font-bold">$0.00 (FREE)</span>
                    ) : deliveryStatus.isLoading ? (
                      <span className="text-xs text-text-muted">Calculating...</span>
                    ) : deliveryStatus.isEventSetup ? (
                      <span className="text-xs text-purple-700 font-semibold">Quote Required</span>
                    ) : shippingFee !== null ? (
                      shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )
                    ) : (
                      <span className="text-xs text-text-muted">Calculated at address</span>
                    )}
                  </span>
                </div>

                <div className="border-t border-cloud mt-1 pt-4 flex justify-between items-center">
                  <span className="font-serif text-lg font-bold text-charcoal">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
