import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { PublicLeadForm } from '@/components/public/public-lead-form';
import { getPublicContent } from '@/lib/content/public-content';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const content = await getPublicContent();
  return content.products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const content = await getPublicContent();
  const product = content.products.find((item) => item.slug === params.slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.summary,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const content = await getPublicContent();
  const product = content.products.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link
            href="/products"
            className="text-sm font-semibold text-cyan-700"
          >
            ← Back to catalog
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-cyan-700">
            {product.category}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-slate-700">{product.summary}</p>
          <p className="mt-4 text-lg font-semibold text-slate-900">
            {product.priceRange}
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">
            Key features
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">
            Specifications
          </h2>
          <dl className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-2">
                <dt className="font-medium text-slate-700">{key}</dt>
                <dd className="text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside>
          <PublicLeadForm serviceLabel={`${product.name} installation`} />
        </aside>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </div>
  );
}
