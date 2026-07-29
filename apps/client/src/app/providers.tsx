'use client';

import { useState } from 'react';

import { ThemeProvider, Toaster } from '@chup/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  // useState로 잡아둬야 리렌더마다 캐시가 날아가지 않음
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR에서 클라이언트가 곧바로 재요청하는 걸 막음
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
