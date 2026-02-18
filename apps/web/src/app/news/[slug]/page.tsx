import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { getPublicContent } from '@/lib/content/public-content';

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const content = await getPublicContent();
  return content.news.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const content = await getPublicContent();
  const article = content.news.find((item) => item.slug === params.slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const content = await getPublicContent();
  const article = content.news.find((item) => item.slug === params.slug);

  if (!article) {
    notFound();
  }

  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.publishedAt,
    description: article.excerpt,
    publisher: {
      '@type': 'Organization',
      name: 'SPIDER',
    },
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/news" className="text-sm font-semibold text-cyan-700">
          ← Back to news
        </Link>
        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
            {article.category}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="mt-5 text-base text-slate-700">{article.excerpt}</p>
          <div className="mt-6 space-y-4 text-slate-700">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
    </div>
  );
}
