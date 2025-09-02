import { Inter } from 'next/font/google';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'NewsfeedVid - Actualités en Vidéo',
  description: 'Toute l\'actualité mondiale en vidéo. Interface moderne inspirée de Google Actualités.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}