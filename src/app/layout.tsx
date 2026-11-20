import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { DataProvider } from '@/lib/data';
import { ToastProvider, ConfirmProvider } from '@/components/feedback';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-serif', display: 'swap' });
const sans = Jost({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'GKJ Mijen', template: '%s · GKJ Mijen' },
  description: 'Portal pelayanan jemaat dan panel pengurus Gereja Kristen Jawa Mijen, Semarang.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable}`}>
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
