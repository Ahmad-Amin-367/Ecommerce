'use client';
import { useFormik } from 'formik';
import { checkoutSchema } from '@/validations/checkoutValidation';
import { usePlaceOrder } from '@/hooks/useOrders';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PAYMENT_METHODS } from '@/utils/constants';

export default function CheckoutForm({ addresses = [], onAddressSelect }) {
  const placeOrder = usePlaceOrder();

  const formik = useFormik({
    initialValues: {
      addressId: addresses.find(a => a.isDefault)?.id || '',
      paymentMethod: 'CASH_ON_DELIVERY',
      notes: '',
    },
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      placeOrder.mutate(values);
    },
  });

  const selectedMethod = formik.values.paymentMethod;
  const selectedAddress = formik.values.addressId;

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-12">
      {/* Address Selection */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-cloud">Delivery Address</h2>
        <div className="grid gap-4">
          {addresses.map((address) => (
            <label key={address.id} className="group flex items-start gap-4 p-6 bg-white border border-cloud rounded-2xl cursor-pointer transition-all duration-200 hover:bg-background-hover has-[:checked]:border-primary has-[:checked]:bg-primary-glow">
              <input
                type="radio"
                name="addressId"
                value={address.id}
                checked={formik.values.addressId === address.id}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (onAddressSelect) onAddressSelect(address);
                }}
                className="mt-1 accent-[#C67D5C] w-[18px] h-[18px] cursor-pointer"
              />
              <div className="flex flex-col gap-[2px] text-sm text-warm-gray">
                <span className="font-bold text-base text-charcoal mb-1">{address.label}</span>
                <p>{address.street}, {address.city}, {address.state}</p>
                <p>{address.country} - {address.postalCode}</p>
              </div>
            </label>
          ))}
          {addresses.length === 0 && (
            <p className="text-sm text-text-muted italic py-4">No addresses found. Please add an address to your profile.</p>
          )}
        </div>
        {formik.touched.addressId && formik.errors.addressId && (
          <p className="text-sm text-error">{formik.errors.addressId}</p>
        )}
      </section>

      {/* Payment Method */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-cloud">Payment Method</h2>
        <div className="grid gap-4">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.value} className="group flex items-start gap-4 p-6 bg-white border border-cloud rounded-2xl cursor-pointer transition-all duration-200 hover:bg-background-hover has-[:checked]:border-primary has-[:checked]:bg-primary-glow">
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={formik.values.paymentMethod === method.value}
                onChange={formik.handleChange}
                className="mt-1 accent-[#C67D5C] w-[18px] h-[18px] cursor-pointer"
              />
              <span className="text-base font-semibold text-charcoal">{method.label}</span>
            </label>
          ))}
        </div>
        {formik.touched.paymentMethod && formik.errors.paymentMethod && (
          <p className="text-sm text-error">{formik.errors.paymentMethod}</p>
        )}
      </section>

      {/* Order Notes */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-cloud">Order Notes (Optional)</h2>
        <Input
          name="notes"
          placeholder="Any special instructions for delivery or gift wrapping..."
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes && formik.errors.notes ? formik.errors.notes : undefined}
        />
      </section>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={formik.isSubmitting || placeOrder.isPending}
        disabled={!selectedAddress || !selectedMethod}
      >
        Place Order
      </Button>
    </form>
  );
}
