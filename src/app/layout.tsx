import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import HelplineChat from '@/components/helpline-chat';
import Footer from '@/components/layout/footer';
<<<<<<< HEAD
=======
import { AuthProvider } from '@/components/auth-provider';
>>>>>>> cf5971e (signup login backend)

export const metadata: Metadata = {
  title: 'delibro',
  description: 'Connecting travelers with people who need to send parcels.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
<<<<<<< HEAD
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow min-h-screen bg-background pt-16">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <HelplineChat />
=======
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow min-h-screen bg-background pt-16">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <HelplineChat />
        </AuthProvider>
>>>>>>> cf5971e (signup login backend)
      </body>
    </html>
  );
}
