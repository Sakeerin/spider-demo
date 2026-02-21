import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContractorContactForm } from '@/components/contractors/contractor-contact-form';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import {
  formatBudgetRange,
  formatServiceLabel,
  getPublicContent,
} from '@/lib/content/public-content';

interface ContractorProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const content = await getPublicContent();
  return content.contractors.map((contractor) => ({ id: contractor.id }));
}

export async function generateMetadata({
  params,
}: ContractorProfilePageProps): Promise<Metadata> {
  const content = await getPublicContent();
  const contractor = content.contractors.find((item) => item.id === params.id);

  if (!contractor) {
    return {};
  }

  return {
    title: contractor.name,
    description: contractor.headline,
  };
}

export default async function ContractorProfilePage({
  params,
}: ContractorProfilePageProps) {
  const content = await getPublicContent();
  const contractor = content.contractors.find((item) => item.id === params.id);

  if (!contractor) {
    notFound();
  }

  const relatedContractors = content.contractors
    .filter(
      (item) =>
        item.id !== contractor.id &&
        item.serviceSlugs.some((service) =>
          contractor.serviceSlugs.includes(service)
        )
    )
    .slice(0, 3);

  const contractorSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contractor.name,
    description: contractor.headline,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: contractor.rating,
      reviewCount: contractor.reviews,
    },
    areaServed: contractor.city,
    knowsAbout: contractor.serviceSlugs.map((service) =>
      formatServiceLabel(service)
    ),
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-100 via-white to-emerald-100 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-800">
            Verified contractor profile
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {contractor.name}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-700">{contractor.headline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {contractor.serviceSlugs.map((serviceSlug) => (
              <span
                key={serviceSlug}
                className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800"
              >
                {formatServiceLabel(serviceSlug)}
              </span>
            ))}
            {contractor.verified && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                Verification approved
              </span>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                Trust signals
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rating and reviews
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {contractor.rating.toFixed(1)} / 5 ({contractor.reviews}{' '}
                    reviews)
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Project success
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {contractor.successRate}% across{' '}
                    {contractor.completedProjects} completed jobs
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Typical budget
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatBudgetRange(
                      contractor.budgetMin,
                      contractor.budgetMax
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Response window
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    About {contractor.responseTimeHours} hours in{' '}
                    {contractor.city}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {contractor.trustSignals.map((signal) => (
                  <li key={signal}>- {signal}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                Portfolio highlights
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {contractor.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      {formatServiceLabel(item.serviceSlug)}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.summary}
                    </p>
                    <p className="mt-3 text-xs font-medium text-slate-700">
                      {item.location} - {item.completedAt} - {item.budgetLabel}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                Customer reviews
              </h2>
              <div className="mt-4 space-y-3">
                {contractor.testimonials.map((review) => (
                  <blockquote
                    key={review.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm text-slate-700">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <footer className="mt-3 text-xs text-slate-600">
                      {review.author} - {review.projectType} -{' '}
                      {review.rating.toFixed(1)}
                      /5
                    </footer>
                  </blockquote>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <ContractorContactForm contractorName={contractor.name} />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Similar contractors
              </h2>
              <div className="mt-4 space-y-3">
                {relatedContractors.map((item) => (
                  <Link
                    key={item.id}
                    href={`/contractors/${item.id}`}
                    className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-cyan-300"
                  >
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">
                      {item.rating.toFixed(1)} rating - {item.city}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/contractors"
                className="mt-5 inline-block text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              >
                Back to contractor catalog
              </Link>
            </section>
          </aside>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contractorSchema) }}
      />
    </div>
  );
}
