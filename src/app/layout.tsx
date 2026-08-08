import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venkoi | Software Products & Custom Development in Tampa Bay',
  description: 'Venkoi creates modern software products and custom digital solutions that help businesses work simpler, faster, and smarter.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}



