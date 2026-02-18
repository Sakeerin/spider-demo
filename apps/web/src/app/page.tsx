import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Browse contractor services, smart home products, and project support from verified professionals.',
};

export default async function Home() {
  const content = await getPublicContent();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SPIDER Contractor Marketplace',
    url: 'https://spider-marketplace.com',
    potentialAction: {
      '@type': 'SearchAction',
      target:
        'https://spider-marketplace.com/services?query={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pt-16">
          <div className="animate-rise-in rounded-3xl border border-slate-200 bg-gradient-to-br from-cyan-100 via-white to-amber-100 p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
              Public Marketplace
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find verified contractors for every stage of your property
              project.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700">
              Compare services, discover smart home products, and submit your
              requirements in minutes.
            </p>
            <form
              action="/services"
              className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="search"
                name="query"
                placeholder="Search services, e.g. renovation"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
              >
                Search
              </button>
            </form>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Explore services
              </Link>
              <Link
                href="/products"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Browse products
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Service categories
            </h2>
            <Link
              href="/services"
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{service.summary}</p>
                <p className="mt-4 text-sm font-medium text-cyan-700">
                  {service.heroStat}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Latest updates
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {content.news.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    {article.category}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </div>
  );
}
