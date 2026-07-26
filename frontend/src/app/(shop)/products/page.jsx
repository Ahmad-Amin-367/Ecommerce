export const metadata = {
  title: 'All Gifts',
  description: 'Browse our full collection of handpicked gifts for every occasion.',
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
          Our Collection
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal">
          All Gifts
        </h1>
      </div>
      {/* ProductGrid and ProductFilters components go here */}
      <p className="text-warm-gray text-center">
        Products listing — wire up ProductGrid and ProductFilters components here.
      </p>
    </div>
  );
}
