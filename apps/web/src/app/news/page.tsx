import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'News',
  description:
    'Read marketplace updates, project tips, and smart home product guidance from SPIDER.',
};

export default async function NewsPage() {
  const content = await getPublicContent();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-100 via-white to-cyan-100 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            News & insights
          </h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Project ideas, market trends, and updates from the SPIDER team.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.news.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                {article.category}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {article.title}
              </h2>
              <p className="mt-3 text-sm text-slate-600">{article.excerpt}</p>
              <p className="mt-4 text-xs text-slate-500">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
