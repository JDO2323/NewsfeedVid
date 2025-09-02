import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { MainNavigation } from '@/components/Navigation/MainNavigation';
import { QuickActions } from '@/components/Navigation/QuickActions';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Video Actus - Actualités Vidéo',
  description: 'Toute l\'actualité française en vidéo. Comme Google Actualités, mais pour les vidéos.',
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
          <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
            <Header />
            <div className="flex">
              <MainNavigation />
              <div className="flex-1 lg:ml-0">
                <QuickActions />
            <main>
              {children}
            </main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}