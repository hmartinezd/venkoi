import './globals.css';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Venkoi | Software Products & Custom Development in Tampa Bay',
  description: 'Venkoi creates modern software products and custom digital solutions that help businesses work simpler, faster, and smarter.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}


