'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import uploadService from '@/services/uploadService';
import productService from '@/services/productService';

const productSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  description: Yup.string(),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  comparePrice: Yup.number()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
    .min(0, 'Compare price must be positive')
    .nullable(),
  categoryId: Yup.string().required('Category is required'),
  isActive: Yup.boolean().default(true),
  isFeatured: Yup.boolean().default(false),
  isEventSetup: Yup.boolean().default(false),
  imageFile: Yup.mixed()
    .nullable()
    .test('fileSize', 'File is too large. Maximum size is 15MB', (value) => {
      if (!value) return true;
      return value.size <= 15 * 1024 * 1024;
    }),
});

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function ProductModal({ isOpen, onClose, product = null }) {
  const isEditing = !!product;
  const [mounted, setMounted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      comparePrice: '',
      categoryId: '',
      isActive: true,
      isFeatured: false,
      isEventSetup: false,
      imageFile: null,
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      try {
        setIsUploading(true);

        // Check for exact name match before proceeding
        const checkRes = await productService.getProducts({ exactName: values.name, limit: 1 });
        const existingProduct = checkRes.data?.data?.[0];

        // If duplicate found AND it's not the product currently being edited
        if (existingProduct && (!isEditing || existingProduct.id !== product.id)) {
          setPendingPayload(values);
          setDuplicateWarning(true);
          setIsUploading(false);
          return;
        }

        await processSubmission(values);
      } catch (err) {
        if (err.config?.url?.includes('/upload')) {
          toast.error(err.response?.data?.message || 'Failed to upload image to storage');
        } else {
          toast.error(err.response?.data?.message || 'An error occurred during verification');
        }
      } finally {
        setIsUploading(false);
      }
    },
  });

  const processSubmission = async (values) => {
    try {
      setIsUploading(true);
      let images = isEditing ? (product?.images || []) : [];

      if (isImageRemoved) {
        images = [];
      }

      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile);
        images = [uploadRes.data.data.url];
      }

      const payload = { ...values, images };
      if (!payload.comparePrice) payload.comparePrice = null;

      if (isEditing) {
        await updateMutation.mutateAsync({ id: product.id, data: payload });
        toast.success('Product updated successfully!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Product created successfully!');
      }
      onClose();
    } catch (err) {
      if (err.config?.url?.includes('/upload')) {
        toast.error(err.response?.data?.message || 'Failed to upload and optimize image');
      } else {
        toast.error(err.response?.data?.message || 'Failed to save product. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setPendingPayload(null);
    }
  };

  const handleConfirmDuplicate = async () => {
    setDuplicateWarning(false);
    if (pendingPayload) {
      await processSubmission(pendingPayload);
    }
  };

  // Populate form when editing or resetting on open
  useEffect(() => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    if (product && isOpen) {
      formik.resetForm({
        values: {
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : '',
          categoryId: product.categoryId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isEventSetup: Boolean(product.isEventSetup),
          imageFile: null,
        },
      });
      setImagePreview(product.images?.[0] || '');
      setImageFile(null);
      setIsImageRemoved(false);
    } else if (isOpen) {
      formik.resetForm({
        values: {
          name: '',
          description: '',
          price: 0,
          comparePrice: '',
          categoryId: '',
          isActive: true,
          isFeatured: false,
          isEventSetup: false,
          imageFile: null,
        },
      });
      setImagePreview('');
      setImageFile(null);
      setIsImageRemoved(false);
    }
    setDuplicateWarning(false);
    setPendingPayload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOpen]);

  const processSelectedFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files (JPEG, PNG, WEBP) are allowed');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size exceeds 15MB. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    formik.setFieldValue('imageFile', file);
    setImageFile(file);
    setImagePreview(previewUrl);
    setIsImageRemoved(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    processSelectedFile(file);
  };

  const handleRemoveImage = (e) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview('');
    setIsImageRemoved(true);
    formik.setFieldValue('imageFile', null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  if (!isOpen || !mounted) return null;

  const isSaving =
    formik.isSubmitting ||
    isUploading ||
    createMutation.isPending ||
    updateMutation.isPending;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cloud shrink-0">
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-text-muted hover:text-charcoal transition-colors disabled:opacity-40"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="product-form" onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            {/* Image Upload Area */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-warm-gray">Product Image</label>
                {imageFile && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    Auto-optimized to WebP on save
                  </span>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSaving}
              />

              {imagePreview ? (
                /* Uploaded / Selected Image Preview Card */
                <div className="relative w-full p-4 border border-cloud rounded-2xl bg-cream/30 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white border border-cloud shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* File Meta */}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <FileCheck size={16} className="text-emerald-600 shrink-0" />
                        <p className="text-sm font-medium text-charcoal truncate max-w-[220px] sm:max-w-[260px]">
                          {imageFile ? imageFile.name : (product?.name ? `${product.name} (Current)` : 'Product Image')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted">
                        {imageFile ? (
                          <>
                            <span className="font-semibold text-charcoal bg-white border border-cloud px-2 py-0.5 rounded-md">
                              {formatFileSize(imageFile.size)}
                            </span>
                            <span>•</span>
                            <span>{imageFile.type.replace('image/', '').toUpperCase()}</span>
                          </>
                        ) : (
                          <span className="text-text-muted bg-white border border-cloud px-2 py-0.5 rounded-md">
                            Saved on Cloudflare R2
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Change / Remove) */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-cloud">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSaving}
                      className="px-3 py-1.5 rounded-lg border border-cloud bg-white text-xs font-medium text-charcoal hover:bg-cloud hover:border-warm-gray transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw size={13} />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isSaving}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-xs font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone Area */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative w-full h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-cream/40 overflow-hidden cursor-pointer transition-all group ${
                    isDragging
                      ? 'border-primary bg-primary/5 scale-[0.99]'
                      : formik.errors.imageFile
                      ? 'border-error bg-rose-50/20'
                      : 'border-cloud hover:border-primary/60 hover:bg-cream/70'
                  }`}
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-cloud/60 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-medium text-charcoal">
                    {isDragging ? 'Drop your image here' : 'Click or drag image to upload'}
                  </p>
                  <p className="text-xs text-text-muted mt-1">PNG, JPG, WEBP up to 15MB</p>
                  <span className="text-[11px] text-text-muted/80 mt-2 bg-white/80 border border-cloud/60 px-2.5 py-0.5 rounded-full">
                    Automatically compressed & resized to WebP
                  </span>
                </div>
              )}

              {formik.errors.imageFile && (
                <p className="text-xs text-error font-medium mt-1">{formik.errors.imageFile}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Product Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSaving}
                error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Description</label>
              <textarea
                name="description"
                disabled={isSaving}
                className="w-full py-3 px-4 bg-white border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow resize-none min-h-[100px] disabled:bg-cloud/30"
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
                disabled={isSaving}
                error={formik.touched.price && formik.errors.price ? formik.errors.price : undefined}
              />
              <Input
                label="Compare Price (Optional)"
                type="number"
                name="comparePrice"
                value={formik.values.comparePrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSaving}
                error={
                  formik.touched.comparePrice && formik.errors.comparePrice
                    ? formik.errors.comparePrice
                    : undefined
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-gray">Category</label>
              <select
                name="categoryId"
                disabled={isSaving}
                className="w-full py-3 px-4 bg-white border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow disabled:bg-cloud/30"
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

            <div className="flex flex-wrap gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  disabled={isSaving}
                  className="accent-primary w-4 h-4 cursor-pointer"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                />
                <span className="text-sm text-charcoal font-medium">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  disabled={isSaving}
                  className="accent-primary w-4 h-4 cursor-pointer"
                  checked={formik.values.isFeatured}
                  onChange={formik.handleChange}
                />
                <span className="text-sm text-charcoal font-medium">Featured on Homepage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isEventSetup"
                  disabled={isSaving}
                  className="accent-primary w-4 h-4 cursor-pointer"
                  checked={formik.values.isEventSetup}
                  onChange={formik.handleChange}
                />
                <span className="text-sm font-medium text-primary">
                  Event / Setup Item (Requires Quote)
                </span>
              </label>
            </div>
          </form>
        </div>

        <ConfirmModal
          isOpen={duplicateWarning}
          onClose={() => setDuplicateWarning(false)}
          onConfirm={handleConfirmDuplicate}
          title="Duplicate Product Name"
          message={`A product with the exact name "${pendingPayload?.name}" already exists in the database. Are you sure you want to create a duplicate?`}
          confirmText="Yes, Continue"
          isDestructive={false}
        />

        {/* Footer */}
        <div className="p-6 border-t border-cloud flex justify-end gap-3 shrink-0 bg-background-secondary rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            isLoading={isSaving}
          >
            {isUploading
              ? 'Optimizing & Uploading...'
              : isEditing
              ? 'Save Changes'
              : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
