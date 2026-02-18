import type { Metadata } from 'next';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { ProductFilter } from '@/components/public/product-filter';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'Smart Home Products',
  description:
    'Explore solar, EV charging, and smart device products with installation-ready contractor support.',
};

export default async function ProductsPage() {
  const content = await getPublicContent();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-100 via-white to-cyan-100 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Smart home catalog
          </h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Compare products and request installation support from verified
            local teams.
          </p>
        </section>

        <section className="mt-8">
          <ProductFilter products={content.products} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
