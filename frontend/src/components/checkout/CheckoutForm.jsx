'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/validations/checkoutValidation';
import { usePlaceOrder } from '@/hooks/useOrders';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PAYMENT_METHODS } from '@/utils/constants';

export default function CheckoutForm({ addresses = [], onAddressSelect }) {
  const placeOrder = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      addressId: addresses.find(a => a.isDefault)?.id || '',
      paymentMethod: 'CASH_ON_DELIVERY',
    },
  });

  const selectedMethod = watch('paymentMethod');
  const selectedAddress = watch('addressId');

  const onSubmit = async (data) => {
    placeOrder.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
      {/* Address Selection */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold pb-2 border-b border-border">Delivery Address</h2>
        <div className="grid gap-4">
          {addresses.map((address) => (
            <label key={address.id} className="group flex items-start gap-4 p-6 bg-background-secondary border border-border rounded-2xl cursor-pointer transition-colors duration-150 hover:bg-background-hover has-[:checked]:border-primary has-[:checked]:bg-primary-glow">
              <input
                type="radio"
                value={address.id}
                {...register('addressId')}
                className="mt-1 accent-primary w-[18px] h-[18px] cursor-pointer"
                onChange={(e) => {
                  register('addressId').onChange(e);
                  if (onAddressSelect) onAddressSelect(address);
                }}
              />
              <div className="flex flex-col gap-[2px] text-sm text-text-secondary">
                <span className="font-bold text-base text-text-primary mb-1">{address.label}</span>
                <p>{address.street}, {address.city}, {address.state}</p>
                <p>{address.country} - {address.postalCode}</p>
              </div>
            </label>
          ))}
          {addresses.length === 0 && (
            <p className="text-sm text-text-muted italic py-4">No addresses found. Please add an address to your profile.</p>
          )}
        </div>
        {errors.addressId && <p className="text-sm text-error">{errors.addressId.message}</p>}
      </section>

      {/* Payment Method */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold pb-2 border-b border-border">Payment Method</h2>
        <div className="grid gap-4">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.value} className="group flex items-start gap-4 p-6 bg-background-secondary border border-border rounded-2xl cursor-pointer transition-colors duration-150 hover:bg-background-hover has-[:checked]:border-primary has-[:checked]:bg-primary-glow">
              <input
                type="radio"
                value={method.value}
                {...register('paymentMethod')}
                className="mt-1 accent-primary w-[18px] h-[18px] cursor-pointer"
              />
              <span className="text-base font-semibold text-text-primary">{method.label}</span>
            </label>
          ))}
        </div>
        {errors.paymentMethod && <p className="text-sm text-error">{errors.paymentMethod.message}</p>}
      </section>

      {/* Order Notes */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold pb-2 border-b border-border">Order Notes (Optional)</h2>
        <Input
          placeholder="Any special instructions for delivery..."
          error={errors.notes?.message}
          {...register('notes')}
        />
      </section>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isSubmitting || placeOrder.isPending}
        disabled={!selectedAddress || !selectedMethod}
      >
        Place Order
      </Button>
    </form>
  );
}
