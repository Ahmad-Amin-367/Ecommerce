'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Star } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCreateTestimonial, useUpdateTestimonial } from '@/hooks/useTestimonials';

const testimonialSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Customer name is required'),
  location: Yup.string().required('City / Location is required'),
  rating: Yup.number().min(1).max(5).required('Rating is required'),
  text: Yup.string().min(10, 'Review text must be at least 10 characters').required('Review text is required'),
  isActive: Yup.boolean().default(true),
});

export default function TestimonialModal({ isOpen, onClose, testimonial = null }) {
  const isEditing = !!testimonial;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      rating: 5,
      text: '',
      isActive: true,
    },
    validationSchema: testimonialSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({ id: testimonial.id, data: values });
        } else {
          await createMutation.mutateAsync(values);
        }
        onClose();
      } catch (err) {
        // Error handling done by toast
      }
    },
  });

  useEffect(() => {
    if (testimonial && isOpen) {
      formik.resetForm({
        values: {
          name: testimonial.name || '',
          location: testimonial.location || '',
          rating: testimonial.rating || 5,
          text: testimonial.text || '',
          isActive: testimonial.isActive !== undefined ? testimonial.isActive : true,
        },
      });
    } else if (!testimonial && isOpen) {
      formik.resetForm({
        values: {
          name: '',
          location: '',
          rating: 5,
          text: '',
          isActive: true,
        },
      });
    }
  }, [testimonial, isOpen]);

  if (!isOpen || !mounted) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cloud">
          <h2 className="font-serif text-xl font-bold text-charcoal">
            {isEditing ? 'Edit Home Review' : 'Add New Home Review'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-text-muted hover:text-charcoal hover:bg-cloud/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <Input
            label="Customer Name"
            name="name"
            placeholder="e.g. Ayesha K."
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            required
          />

          <Input
            label="Location / City"
            name="location"
            placeholder="e.g. Lahore, Karachi, Islamabad"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && formik.errors.location}
            required
          />

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => formik.setFieldValue('rating', star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={26}
                    className={
                      star <= formik.values.rating
                        ? 'text-warning fill-warning'
                        : 'text-cloud fill-cloud'
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-charcoal">
                {formik.values.rating} / 5
              </span>
            </div>
            {formik.touched.rating && formik.errors.rating && (
              <p className="text-xs text-error mt-1">{formik.errors.rating}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Review Content
            </label>
            <textarea
              name="text"
              rows={4}
              placeholder="Write the customer's testimonial or review here..."
              value={formik.values.text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none ${
                formik.touched.text && formik.errors.text
                  ? 'border-error focus:border-error'
                  : 'border-cloud focus:border-primary'
              }`}
            />
            {formik.touched.text && formik.errors.text && (
              <p className="text-xs text-error mt-1">{formik.errors.text}</p>
            )}
          </div>

          {/* Visibility Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formik.values.isActive}
              onChange={formik.handleChange}
              className="w-4 h-4 text-primary rounded border-cloud focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-charcoal cursor-pointer">
              Show this review on home page slider
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-cloud mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Update Review' : 'Save Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
