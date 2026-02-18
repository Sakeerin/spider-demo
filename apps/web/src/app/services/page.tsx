import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Browse construction, renovation, and smart home service categories with trusted contractor support.',
};

interface ServicesPageProps {
  searchParams: {
    query?: string;
  };
}

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const content = await getPublicContent();
  const query = searchParams.query?.trim().toLowerCase() ?? '';
  const services = query
    ? content.services.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.summary.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      )
    : content.services;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-100 via-white to-orange-100 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Service categories
          </h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Find service details, contractor options, and submit project leads
            for site surveys.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-slate-900">
                {service.title}
              </h2>
              <p className="mt-3 text-slate-600">{service.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {service.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link
                href={`/services/${service.slug}`}
                className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Open service page
              </Link>
            </article>
          ))}
        </section>
        {services.length === 0 && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No service matched your search. Try another keyword.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
