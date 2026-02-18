import type { Metadata } from 'next';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how SPIDER helps customers and contractors work better through verified matching and milestone delivery.',
};

export default async function AboutPage() {
  const content = await getPublicContent();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-cyan-100 via-white to-teal-100 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            About SPIDER
          </h1>
          <p className="mt-4 max-w-3xl text-slate-700">
            {content.about.mission}
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Our story</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              {content.about.story}
            </p>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              What we value
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {content.about.values.map((value) => (
                <li key={value}>• {value}</li>
              ))}
            </ul>
          </article>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              By the numbers
            </h2>
            <div className="mt-4 space-y-3">
              {content.about.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
