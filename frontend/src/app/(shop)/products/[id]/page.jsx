export async function generateMetadata({ params }) {
  return {
    title: `Product Detail`,
    description: 'View product details, reviews and add to cart.',
  };
}

export default function ProductDetailPage({ params }) {
  const { id } = params;
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-charcoal mb-6">
        Product Detail
      </h1>
      {/* Wire up useProduct(id) hook and ProductImageGallery component */}
      <p className="text-warm-gray">
        Product ID / Slug: <strong className="text-charcoal">{id}</strong>
      </p>
    </div>
  );
}
