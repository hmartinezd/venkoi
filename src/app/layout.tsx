import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venkoi',
  description: 'Venkoi website foundation for a Tampa Bay software company.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

