import type { Metadata } from 'next';
import { ContractorCatalog } from '@/components/contractors/contractor-catalog';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'Contractor Catalog',
  description:
    'Search and compare verified contractors by service, location, budget range, and trust signals.',
};

interface ContractorCatalogPageProps {
  searchParams: {
    query?: string;
  };
}

export default async function ContractorCatalogPage({
  searchParams,
}: ContractorCatalogPageProps) {
  const content = await getPublicContent();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-100 via-white to-amber-100 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Contractor catalog
          </h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Discover verified contractors, filter by service and budget fit, and
            compare trust signals before requesting a quote.
          </p>
        </section>

        <section className="mt-8">
          <ContractorCatalog
            contractors={content.contractors}
            initialQuery={searchParams.query ?? ''}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
