import type { Metadata } from 'next';
import { ContactForm } from '@/components/public/contact-form';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { getPublicContent } from '@/lib/content/public-content';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with SPIDER for service inquiries, contractor support, and partnership opportunities.',
};

export default async function ContactPage() {
  const content = await getPublicContent();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-100 via-white to-emerald-100 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Contact SPIDER
          </h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Reach us for project requests, contractor support, and platform
            questions.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <ContactForm />
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Support channels
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <dt className="font-semibold text-slate-900">Email</dt>
                <dd>{content.contact.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Phone</dt>
                <dd>{content.contact.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">LINE OA</dt>
                <dd>{content.contact.line}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Office hours</dt>
                <dd>{content.contact.officeHours}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Office</dt>
                <dd>{content.contact.officeAddress}</dd>
              </div>
            </dl>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
