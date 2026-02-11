// app/layout.tsx
import type { Metadata } from 'next';
// Import your fonts if using Geist or whatever – comment out if not needed
// import { GeistSans, GeistMono } from 'next/font/google';

// const geistSans = GeistSans({ variable: '--font-geist-sans' });
// const geistMono = GeistMono({ variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'CRUD "Seguro"',
  description: 'Tracker de usuarios con validación y manejo de errores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}  // uncomment if using fonts
        suppressHydrationWarning  // ← This silences the font/extension mismatch noise in dev/prod
      >
        {children}
      </body>
    </html>
  );
}