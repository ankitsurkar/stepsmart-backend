import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'StepSmart LMS',
  description: 'Your personalized learning platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
