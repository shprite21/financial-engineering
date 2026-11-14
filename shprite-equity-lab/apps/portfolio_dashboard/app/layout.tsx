import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Shprite Equity Lab',
  icons: { icon: '/favicon.svg' },
  description:
    'Build and analyze a custom systematic equities portfolio using Yahoo Finance data.',
  openGraph: {
    title: 'Shprite Equity Lab',
    description:
      'Systematic equities portfolio research with custom allocations and Yahoo Finance history.',
    images: [
      {
        url: 'http://localhost:3000/og.png',
        alt: 'Shprite Equity Lab — Systematic equities portfolio research',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shprite Equity Lab',
    description:
      'Systematic equities portfolio research with custom allocations and Yahoo Finance history.',
    images: ['http://localhost:3000/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
