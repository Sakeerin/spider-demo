import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SPIDER | Verified Contractor Marketplace',
    template: '%s | SPIDER',
  },
  description:
    'Find verified contractors for construction, renovation, and smart home projects with transparent milestone tracking.',
  openGraph: {
    title: 'SPIDER Contractor Marketplace',
    description:
      'Discover services, compare verified contractors, and launch projects with confidence.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
