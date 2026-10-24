import './globals.css';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiClient } from '../lib/api-client';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'TomeSphere — Digital Product Studio & Platform',
  description:
    'TomeSphere is a digital product studio and software platform by Katam Ganesh Reddy. Explore purposeful web platforms, creator utilities, and high-performance digital products.',
  metadataBase: new URL('https://tomesphere.in'),
  openGraph: {
    title: 'TomeSphere — Digital Product Studio & Platform',
    description:
      'Explore digital software products, creator tools, and modern web applications at tomesphere.in.',
    url: 'https://tomesphere.in',
    siteName: 'TomeSphere',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#07080d' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const profile = await apiClient.profile.get().catch(() => null);

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('site-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`
          }}
        />
      </head>
      <body>
        <div className="ambient-wrapper" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="ambient-orb orb-primary" />
          <div className="ambient-orb orb-secondary" />
          <div className="ambient-orb orb-tertiary" />
        </div>
        <div className="site-layout">
          <Navbar profile={profile} />
          {children}
          <Footer profile={profile} />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
