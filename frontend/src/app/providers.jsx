'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import authService from '@/services/authService';

function AuthInitializer({ children }) {
  const { setAuth, setAuthChecked, logout } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await authService.me();
        setAuth(response.data.data);
      } catch (error) {
        // Not authenticated — clear auth cookie and reset auth store, but preserve guest cart
        document.cookie = 'auth-status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        logout();
      } finally {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, [setAuth, setAuthChecked, logout]);

  return <>{children}</>;
}

export function Providers({ children }) {
  // Initialize QueryClient inside the component for Next.js App Router
  // This prevents context linkage bugs on the client side with Turbopack
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e2e',
            color: '#cdd6f4',
            border: '1px solid #313244',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' },
          },
          error: {
            iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' },
          },
        }}
      />
    </QueryClientProvider>
  );
}
