'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import uploadService from '@/services/uploadService';

const productSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  slug: Yup.string().min(3, 'Slug must be at least 3 characters').required('Slug is required'),
  description: Yup.string(),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  comparePrice: Yup.number().min(0, 'Compare price must be positive').nullable(),
  stock: Yup.number().integer('Stock must be an integer').min(0, 'Stock must be 0 or more').required('Stock is required'),
  sku: Yup.string(),
  categoryId: Yup.string().required('Category is required'),
  isActive: Yup.boolean().default(true),
  isFeatured: Yup.boolean().default(false),
});

export default function ProductModal({ isOpen, onClose, product = null }) {
  const isEditing = !!product;
  const [mounted, setMounted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const formik = useFormik({
    initialValues: {
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
    validationSchema: productSchema,
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        let images = product?.images || [];

        if (imageFile) {
          const uploadRes = await uploadService.uploadImage(imageFile);
          images = [uploadRes.data.data.url];
        }

        const payload = { ...values, images };

        if (isEditing) {
          await updateMutation.mutateAsync({ id: product.id, data: payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        onClose();
      } catch (err) {
        // Error handled by mutation hook toasts
      } finally {
        setIsUploading(false);
      }
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (product && isOpen) {
      formik.resetForm({
        values: {
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
        }
      });
      setImagePreview(product.images?.[0] || '');
      setImageFile(null);
    } else if (isOpen) {
      formik.resetForm();
      setImagePreview('');
      setImageFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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
          <form id="product-form" onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            {/* Image Upload Area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Product Image</label>
              <div className="relative w-full h-40 border-2 border-dashed border-cloud rounded-2xl flex flex-col items-center justify-center bg-cream/50 overflow-hidden hover:bg-cream transition-colors group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain" />
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-charcoal">Click or drag image to upload</p>
                    <p className="text-xs text-text-muted mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Product Name" 
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              />
              <Input 
                label="Slug" 
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : undefined}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Description</label>
              <textarea
                name="description"
                className="w-full py-3 px-4 bg-white border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow resize-none min-h-[100px]"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-xs text-error">{formik.errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Price (CAD)" 
                type="number" 
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price ? formik.errors.price : undefined}
              />
              <Input 
                label="Compare Price (Optional)" 
                type="number" 
                name="comparePrice"
                value={formik.values.comparePrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.comparePrice && formik.errors.comparePrice ? formik.errors.comparePrice : undefined}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Stock Quantity" 
                type="number" 
                name="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock && formik.errors.stock ? formik.errors.stock : undefined}
              />
              <Input 
                label="SKU (Optional)" 
                name="sku"
                value={formik.values.sku}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sku && formik.errors.sku ? formik.errors.sku : undefined}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Category</label>
              <select
                name="categoryId"
                className="w-full py-3 px-4 bg-white border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <p className="text-xs text-error">{formik.errors.categoryId}</p>
              )}
            </div>

            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isActive"
                  className="accent-primary w-4 h-4" 
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                />
                <span className="text-sm text-charcoal">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isFeatured"
                  className="accent-primary w-4 h-4" 
                  checked={formik.values.isFeatured}
                  onChange={formik.handleChange}
                />
                <span className="text-sm text-charcoal">Featured on Homepage</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cloud flex justify-end gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={formik.isSubmitting || isUploading}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" isLoading={formik.isSubmitting || isUploading || createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
