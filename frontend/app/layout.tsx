'use client';
import { ReactNode } from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import AppWrappers from './AppWrappers';
import AppInner from './AppInner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id={'root'} suppressHydrationWarning>
        <ColorModeScript initialColorMode="light" />
        <AppWrappers>
          <AppInner>{children}</AppInner>
        </AppWrappers>
      </body>
    </html>
  );
}
