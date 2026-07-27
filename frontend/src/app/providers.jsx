'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Create a single instance outside the component to bypass SSR chunking bugs on Linux.
// Since we only fetch data on the client (no server-side prefetching), this is perfectly safe.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
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
