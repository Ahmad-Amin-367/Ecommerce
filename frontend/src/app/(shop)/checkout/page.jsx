'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { ChevronLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const shippingFee = 200; // Flat rate for now
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
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
        paymentMethod: 'CASH_ON_DELIVERY',
        notes: formData.notes,
        guestInfo: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone
        }
      };

      await api.post('/orders', payload);
      
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/'); // Redirect to home for now
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Cart
          </Link>
          <div className="flex items-center text-sm text-text-muted">
            <Lock size={14} className="mr-1" />
            Secure Checkout
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12">
          {/* Left: Shipping Form */}
          <div className="w-full lg:w-3/5">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 md:p-8">
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
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors" />
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
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-4 bg-cream border border-cloud rounded-lg outline-none focus:border-primary transition-colors resize-none" placeholder="Special instructions for delivery or gift messages..." />
              </div>

              <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Payment Method</h2>
              <div className="border border-primary bg-primary-glow rounded-xl p-4 flex items-center justify-between mb-8 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-[5px] border-primary"></div>
                  <span className="font-medium text-primary">Cash on Delivery (COD)</span>
                </div>
                <span className="text-sm text-text-secondary">Pay upon receiving</span>
              </div>

              <Button type="submit" variant="primary" className="w-full h-14 text-lg" isLoading={isSubmitting}>
                Place Order (COD)
              </Button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-cream/50 rounded-2xl border border-cloud p-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-charcoal mb-6">Order Summary</h2>
              
              <ul className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-cloud shrink-0">
                      <Image src={item.product.images?.[0] || 'https://via.placeholder.com/150'} alt={item.product.name} fill className="object-cover" />
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
