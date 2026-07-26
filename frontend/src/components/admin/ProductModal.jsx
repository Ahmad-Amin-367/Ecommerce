'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  comparePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  sku: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export default function ProductModal({ isOpen, onClose, product = null }) {
  const isEditing = !!product;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      comparePrice: 0,
      stock: 0,
      sku: '',
      categoryId: '',
      isActive: true,
      isFeatured: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : 0,
        stock: product.stock,
        sku: product.sku || '',
        categoryId: product.categoryId,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    } else if (isOpen) {
      reset({
        name: '',
        slug: '',
        description: '',
        price: 0,
        comparePrice: 0,
        stock: 0,
        sku: '',
        categoryId: '',
        isActive: true,
        isFeatured: false,
      });
    }
  }, [product, isOpen, reset]);

  if (!isOpen || !mounted) return null;

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: product.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (err) {
      // Error handled by mutation hook toasts
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cloud shrink-0">
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-charcoal transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Product Name" error={errors.name?.message} {...register('name')} />
              <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Description</label>
              <textarea
                className="w-full py-3 px-4 bg-white border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow resize-none min-h-[100px]"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (PKR)" type="number" error={errors.price?.message} {...register('price')} />
              <Input label="Compare Price (Optional)" type="number" error={errors.comparePrice?.message} {...register('comparePrice')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock Quantity" type="number" error={errors.stock?.message} {...register('stock')} />
              <Input label="SKU (Optional)" error={errors.sku?.message} {...register('sku')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Category</label>
              <select
                className="w-full py-3 px-4 bg-white border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow"
                {...register('categoryId')}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-error">{errors.categoryId.message}</p>}
            </div>

            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4" {...register('isActive')} />
                <span className="text-sm text-charcoal">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4" {...register('isFeatured')} />
                <span className="text-sm text-charcoal">Featured on Homepage</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cloud flex justify-end gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
