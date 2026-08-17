'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/useCart';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import orderService from '@/services/orderService';
import Button from '@/components/ui/Button';
import StripeProvider from '@/components/checkout/StripeProvider';
import StripeCardForm from '@/components/checkout/StripeCardForm';
import { formatCurrency } from '@/utils/formatCurrency';
import { ChevronLeft, Lock, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuthStore();
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY'); // 'CASH_ON_DELIVERY' | 'STRIPE'

  // Stripe state after order initialization
  const [activeOrder, setActiveOrder] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const shippingFee = 200; // Flat rate
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0 && !activeOrder) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod: paymentMethod,
        notes: formData.notes,
        guestInfo: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone
        }
      };

      // Create Order
      const res = await api.post('/orders', payload);
      const createdOrder = res.data.data;

      if (paymentMethod === 'CASH_ON_DELIVERY') {
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/checkout/confirmation?orderId=${createdOrder.id}`);
      } else if (paymentMethod === 'STRIPE') {
        // Fetch Stripe PaymentIntent Client Secret
        const intentRes = await orderService.createPaymentIntent(createdOrder.id);
        const { clientSecret } = intentRes.data.data;
        
        setActiveOrder(createdOrder);
        setStripeClientSecret(clientSecret);
        clearCart();
        toast.success('Shipping details saved. Please enter your card info below.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to initialize order. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !activeOrder) {
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
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              if (activeOrder) {
                setActiveOrder(null);
                setStripeClientSecret(null);
              } else {
                useCartStore.getState().openCart();
              }
            }}
            className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className="mr-1" />
            {activeOrder ? 'Back to Details' : 'Edit Cart'}
          </button>
          <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
            <ShieldCheck size={16} />
            Secure Encrypted Checkout
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12">
          {/* Left: Form or Stripe Card Input */}
          <div className="w-full lg:w-3/5">
            {activeOrder && stripeClientSecret ? (
              /* Stripe Card Payment Step */
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <div className="mb-6 pb-4 border-b border-cloud">
                  <div className="flex justify-between items-center">
                    <h2 className="font-serif text-2xl font-bold text-charcoal">Complete Card Payment</h2>
                    <span className="text-xs font-mono bg-cream px-2.5 py-1 rounded-md text-text-muted border border-cloud">
                      {activeOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    Paying for order shipped to <span className="font-medium text-charcoal">{formData.city}</span>
                  </p>
                </div>

                <StripeProvider clientSecret={stripeClientSecret}>
                  <StripeCardForm
                    orderId={activeOrder.id}
                    totalAmount={formatCurrency(activeOrder.totalAmount || total)}
                    onCancel={() => {
                      setActiveOrder(null);
                      setStripeClientSecret(null);
                    }}
                  />
                </StripeProvider>
              </div>
            ) : (
              /* Shipping & Payment Method Selection Step */
              <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">Shipping Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Last Name *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-1">Address *</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" placeholder="Street address, apartment, suite, etc." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-charcoal mb-1">Order Notes (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors resize-none text-sm" placeholder="Special instructions for delivery or gift messages..." />
                </div>

                <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {/* Card Payment Option */}
                  <div 
                    onClick={() => setPaymentMethod('STRIPE')}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'STRIPE' 
                        ? 'border-primary bg-primary-glow/60 shadow-sm' 
                        : 'border-cloud hover:border-primary/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'STRIPE' ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'STRIPE' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={20} className={paymentMethod === 'STRIPE' ? 'text-primary' : 'text-text-secondary'} />
                        <div>
                          <p className={`font-medium text-sm ${paymentMethod === 'STRIPE' ? 'text-primary' : 'text-charcoal'}`}>
                            Credit / Debit Card (Stripe)
                          </p>
                          <p className="text-xs text-text-muted">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Instant & Secure
                    </span>
                  </div>

                  {/* COD Option */}
                  <div 
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'CASH_ON_DELIVERY' 
                        ? 'border-primary bg-primary-glow/60 shadow-sm' 
                        : 'border-cloud hover:border-primary/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'CASH_ON_DELIVERY' ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'CASH_ON_DELIVERY' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Banknote size={20} className={paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-text-secondary'} />
                        <div>
                          <p className={`font-medium text-sm ${paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-charcoal'}`}>
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-xs text-text-muted">Pay in cash when package arrives</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full h-14 text-lg font-semibold shadow-md cursor-pointer" isLoading={isSubmitting}>
                  {paymentMethod === 'STRIPE' ? `Proceed to Card Payment (${formatCurrency(total)})` : 'Place Order (COD)'}
                </Button>
              </form>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-cream/50 rounded-2xl border border-cloud p-6 sticky top-28 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-charcoal mb-6">Order Summary</h2>
              
              <ul className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-cloud shrink-0">
                      <Image src={item.product.images?.[0] || 'https://via.placeholder.com/150'} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-sm font-medium text-charcoal line-clamp-1">{item.product.name}</span>
                      <span className="text-sm text-text-secondary">{formatCurrency(item.product.price)}</span>
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
                  <span>Shipping Fee</span>
                  <span className="font-medium text-charcoal">{formatCurrency(shippingFee)}</span>
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
