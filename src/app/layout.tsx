import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { DataProvider } from '@/lib/data';
import { ToastProvider, ConfirmProvider } from '@/components/feedback';

export const metadata: Metadata = {
  title: { default: 'GKJ Mijen', template: '%s · GKJ Mijen' },
  description: 'Portal pelayanan jemaat dan panel pengurus Gereja Kristen Jawa Mijen, Semarang.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <DataProvider>
            <ConfirmProvider>{children}</ConfirmProvider>
          </DataProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
