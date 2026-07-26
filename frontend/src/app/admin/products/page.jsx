'use client';
import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProductModal from '@/components/admin/ProductModal';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const { data: productsData, isLoading } = useProducts();
  const products = productsData?.data || [];
  
  const deleteMutation = useDeleteProduct();

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Manage Products
        </h1>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      <div className="bg-white border border-cloud rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-secondary text-warm-gray font-semibold border-b border-cloud">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cloud">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-warm-gray">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-warm-gray">
                    No products found. Create one to get started!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-background-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-charcoal">{product.name}</span>
                        <span className="text-xs text-text-muted">{product.sku || 'No SKU'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="text-charcoal">{product.stock} in stock</span>
                      ) : (
                        <span className="text-error font-medium">Out of stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="default">Draft</Badge>
                        )}
                        {product.isFeatured && (
                          <Badge variant="primary">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary-glow rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Delete"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />
    </div>
  );
}
