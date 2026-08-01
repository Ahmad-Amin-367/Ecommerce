'use client';
import { useState } from 'react';
import { useTestimonials, useDeleteTestimonial, useUpdateTestimonial } from '@/hooks/useTestimonials';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import TestimonialModal from '@/components/admin/TestimonialModal';

export default function AdminTestimonialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Admin query fetches all testimonials (including inactive)
  const { data: testimonials = [], isLoading } = useTestimonials({ admin: true });

  const deleteMutation = useDeleteTestimonial();
  const updateMutation = useUpdateTestimonial();

  const handleEdit = (item) => {
    setEditingTestimonial(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (item) => {
    await updateMutation.mutateAsync({
      id: item.id,
      data: { isActive: !item.isActive },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this home review?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Home Page Reviews
          </h1>
          <p className="text-sm text-warm-gray mt-1">
            Manage customer testimonials displayed in the home page slider.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 self-start sm:self-auto">
          <Plus size={16} />
          Add Home Review
        </Button>
      </div>

      <div className="bg-white border border-cloud rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-secondary text-warm-gray font-semibold border-b border-cloud">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cloud">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-warm-gray">
                    Loading home reviews...
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-warm-gray">
                    No home reviews found. Click &quot;Add Home Review&quot; to create one!
                  </td>
                </tr>
              ) : (
                testimonials.map((review) => (
                  <tr key={review.id} className="hover:bg-background-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-charcoal">{review.name}</span>
                        <span className="text-xs text-text-muted">{review.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} className="text-warning fill-warning" />
                        ))}
                        <span className="text-xs font-semibold text-charcoal ml-1">
                          ({review.rating})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs md:max-w-md">
                      <p className="text-xs text-warm-gray line-clamp-2 leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {review.isActive ? (
                        <Badge variant="success">Visible on Home</Badge>
                      ) : (
                        <Badge variant="default">Hidden</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(review)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            review.isActive
                              ? 'text-primary hover:bg-primary-glow'
                              : 'text-text-muted hover:bg-cloud/50'
                          }`}
                          title={review.isActive ? 'Hide from home' : 'Show on home'}
                        >
                          {review.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => handleEdit(review)}
                          className="p-1.5 text-text-muted hover:text-charcoal hover:bg-cloud/50 rounded-lg transition-colors"
                          title="Edit Review"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Delete Review"
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

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonial={editingTestimonial}
      />
    </div>
  );
}
