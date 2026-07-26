export async function generateMetadata({ params }) {
  return {
    title: `Product Detail`,
    description: 'View product details, reviews and add to cart.',
  };
}

export default function ProductDetailPage({ params }) {
  const { id } = params;
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-lg)' }}>
        Product Detail
      </h1>
      {/* Wire up useProduct(id) hook and ProductImageGallery component */}
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Product ID / Slug: <strong>{id}</strong>
      </p>
    </div>
  );
}
