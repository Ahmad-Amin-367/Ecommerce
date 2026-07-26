export const metadata = {
  title: 'ShopZone — Premium E-Commerce',
  description: 'Discover thousands of products at unbeatable prices.',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-16 md:py-24 min-h-[calc(100vh-80px)] md:min-h-auto relative overflow-hidden">
        <div className="animate-fade-in z-10">
          <p className="inline-flex items-center gap-2 bg-primary-glow border border-primary text-primary-light px-4 py-1 rounded-full text-sm font-medium mb-6">
            ✨ New Arrivals Every Week
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tight mb-6 text-text-primary">
            Shop the <span className="gradient-text">Future</span> Today
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-[480px]">
            Discover thousands of premium products curated just for you. Fast delivery,
            easy returns, and unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-primary text-white rounded-full font-semibold text-base transition-all duration-250 hover:-translate-y-[2px] hover:shadow-glow">
              Shop Now
            </a>
            <a href="/products?isFeatured=true" className="inline-flex items-center px-8 py-3.5 bg-transparent text-text-primary border border-border-light rounded-full font-semibold text-base transition-all duration-250 hover:border-primary hover:bg-primary-glow">
              View Featured
            </a>
          </div>
        </div>
        
        {/* Visual elements */}
        <div className="hidden md:flex relative h-[500px] items-center justify-center">
          <div className="absolute w-[300px] h-[300px] bg-primary-glow rounded-full blur-[80px] animate-pulse" />
          <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-primary to-transparent rounded-full top-[20%] right-[20%] animate-fade-in" />
          <div className="absolute w-[150px] h-[150px] bg-gradient-to-br from-accent to-transparent rounded-full bottom-[25%] left-[20%] animate-fade-in opacity-80" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-24">
        {[
          { value: '50K+', label: 'Happy Customers' },
          { value: '10K+', label: 'Products' },
          { value: '99%', label: 'Satisfaction Rate' },
          { value: '24/7', label: 'Support' },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-6 bg-gradient-card border border-border rounded-2xl transition-all duration-250 hover:border-primary hover:-translate-y-[2px] hover:shadow-glow">
            <p className="text-3xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
