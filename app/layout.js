import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from './components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Cravy',
  description: 'Shoppable recipes, delivered by Instacart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-white min-h-screen antialiased" style={{ fontFamily: 'Georgia, serif' }}>
        <Header />
        <main className="p-6">{children}</main>
        <script async src="https://www.tiktok.com/embed.js"></script>
      </body>
    </html>
  );
}

