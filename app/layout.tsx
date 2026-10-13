import type { Metadata } from 'next';
import { Parkinsans } from 'next/font/google';
import './globals.css';

const parkinsans = Parkinsans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-parkinsans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Bento Lite - Frozen | basil',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={parkinsans.variable}>
      <body>{children}</body>
    </html>
  );
}
