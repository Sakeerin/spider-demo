import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { ContractorFilter } from '@/components/public/contractor-filter';
import { PublicLeadForm } from '@/components/public/public-lead-form';
import { getPublicContent } from '@/lib/content/public-content';

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const content = await getPublicContent();
  return content.services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const content = await getPublicContent();
  const service = content.services.find((item) => item.slug === params.slug);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const content = await getPublicContent();
  const service = content.services.find((item) => item.slug === params.slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    provider: {
      '@type': 'Organization',
      name: 'SPIDER',
    },
    areaServed: service.featuredCities,
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {service.title}
            </h1>
            <p className="mt-4 text-slate-700">{service.description}</p>
            <p className="mt-5 text-sm font-semibold text-cyan-700">
              {service.heroStat}
            </p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Why customers choose this service
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {service.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Filter contractors
            </h2>
            <ContractorFilter
              contractors={content.contractors}
              serviceSlug={service.slug}
            />
          </div>
        </section>

        <aside>
          <PublicLeadForm serviceLabel={service.title} />
        </aside>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </div>
  );
}
