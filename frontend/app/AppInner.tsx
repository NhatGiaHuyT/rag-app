'use client';
import { Box, Portal, useDisclosure } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo, useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { useAuth } from '@/contexts/AuthContext';
import allRoutes from '@/routes';
import { IRoute } from '@/types/navigation';

export default function AppInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const { onOpen } = useDisclosure();
  const { isAdmin, isLoggedIn } = useAuth();

  useEffect(() => {
    const key = localStorage.getItem('apiKey');
    if (key?.includes('sk-')) setApiKey(key);
  }, []);

  // ── Filter routes based on auth role ────────────────────────────────────────
  const routes = useMemo<IRoute[]>(() => {
    return allRoutes
      .filter((r) => {
        // Admin section: only visible when logged in as admin
        if (r.name === 'Admin') return isAdmin;
        return true;
      })
      .map((r) => {
        // Account section: filter items based on login state
        if (r.name === 'Account' && r.items) {
          return {
            ...r,
            items: r.items.filter((item) => {
              if (item.name === 'Sign In' || item.name === 'Register') return !isLoggedIn;
              return isLoggedIn;
            }),
          };
        }
        return r;
      });
  }, [isAdmin, isLoggedIn]);

  // Auth pages render without sidebar
  const isAuthPage =
    pathname?.includes('sign-in') || pathname?.includes('register');

  if (isAuthPage) return <>{children}</>;

  return (
    <Box>
      <Sidebar setApiKey={setApiKey} routes={routes} />
      <Box
        pt={{ base: '60px', md: '100px' }}
        float="right"
        minHeight="100vh"
        height="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
        maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Portal>
          <Box>
            <Navbar
              setApiKey={setApiKey}
              onOpen={onOpen}
              logoText={'AI Chat App'}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
          </Box>
        </Portal>
        <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh" pt="50px">
          {children}
        </Box>
        <Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

