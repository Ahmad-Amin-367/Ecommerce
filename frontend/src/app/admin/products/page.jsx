'use client';
import { useState, useEffect } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProductModal from '@/components/admin/ProductModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isFeatured, setIsFeatured] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, isFeatured, maxPrice, maxStock]);

  // Fetch Categories for Filter Dropdown
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Fetch Products with Server-Side Filters
  const { data: productsData, isLoading } = useProducts({
    page,
    limit: 50,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category && { categoryId: category }),
    ...(isFeatured !== '' && { isFeatured }),
    ...(maxPrice !== '' && { maxPrice }),
    ...(maxStock !== '' && { maxStock }),
  });
  const products = productsData?.data || [];
  const totalPages = productsData?.meta?.totalPages || 1;
  const totalCount = productsData?.meta?.totalCount || 0;
  const limit = productsData?.meta?.limit || 5;

  const deleteMutation = useDeleteProduct();

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteMutation.mutateAsync(productToDelete.id);
      setProductToDelete(null);
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

      <div className="bg-white border border-cloud rounded-2xl shadow-sm flex flex-col">
        {/* Filters Section (Table Header) */}
        <div className="p-4 border-b border-cloud flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-cloud rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-cloud rounded-lg text-sm bg-white focus:outline-none focus:border-primary text-charcoal"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={isFeatured}
              onChange={(e) => setIsFeatured(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-cloud rounded-lg text-sm bg-white focus:outline-none focus:border-primary text-charcoal"
            >
              <option value="">All Products</option>
              <option value="true">Featured Only</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 border rounded-lg text-sm transition-colors cursor-pointer ${showAdvancedFilters || maxPrice || maxStock
                ? 'border-primary bg-primary-glow text-primary'
                : 'border-cloud bg-white text-charcoal hover:bg-gray-50'
                }`}
            >
              <Filter size={16} />
              Filters
              {(maxPrice || maxStock) && (
                <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                  {(maxPrice ? 1 : 0) + (maxStock ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 border-b border-cloud bg-background-secondary flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">Max Price:</span>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 border border-cloud rounded-lg text-sm bg-white focus:outline-none focus:border-primary text-charcoal"
                  >
                    <option value="">Any Price</option>
                    <option value="50">Less than $50</option>
                    <option value="100">Less than $100</option>
                    <option value="500">Less than $500</option>
                    <option value="1000">Less than $1000</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">Max Stock:</span>
                  <select
                    value={maxStock}
                    onChange={(e) => setMaxStock(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 border border-cloud rounded-lg text-sm bg-white focus:outline-none focus:border-primary text-charcoal"
                  >
                    <option value="">Any Stock</option>
                    <option value="20">Less than 20</option>
                    <option value="50">Less than 50</option>
                    <option value="100">Less than 100</option>
                    <option value="200">Less than 200</option>
                  </select>
                </div>

                {(maxPrice || maxStock) && (
                  <button
                    onClick={() => {
                      setMaxPrice('');
                      setMaxStock('');
                    }}
                    className="text-sm text-primary hover:text-primary-dark font-medium px-2 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto flex-1">
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
                        <span className="font-medium text-charcoal">{product.name}</span>
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
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary-glow rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                          disabled={deleteMutation.isPending && productToDelete?.id === product.id}
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

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-cloud flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-secondary rounded-b-2xl">
          <div className="text-sm text-text-muted font-medium">
            Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} records
          </div>

          <ReactPaginate
            previousLabel={<ChevronLeft size={16} />}
            nextLabel={<ChevronRight size={16} />}
            breakLabel="..."
            breakClassName="w-8 h-8 flex items-center justify-center text-text-muted"
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            forcePage={page - 1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            containerClassName="flex items-center gap-1.5"
            activeClassName="!bg-primary !text-white !border-primary hover:!bg-primary-dark"
            pageClassName="w-8 h-8 flex items-center justify-center border border-cloud rounded text-sm text-charcoal hover:bg-cloud transition-colors cursor-pointer bg-white"
            previousClassName="w-8 h-8 flex items-center justify-center border border-cloud rounded text-sm text-charcoal hover:bg-cloud transition-colors cursor-pointer bg-white"
            nextClassName="w-8 h-8 flex items-center justify-center border border-cloud rounded text-sm text-charcoal hover:bg-cloud transition-colors cursor-pointer bg-white"
            disabledClassName="!opacity-30 !cursor-not-allowed hover:!bg-white"
            disabledLinkClassName="!cursor-not-allowed"
            pageLinkClassName="w-full h-full flex items-center justify-center"
            previousLinkClassName="w-full h-full flex items-center justify-center"
            nextLinkClassName="w-full h-full flex items-center justify-center"
          />
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
