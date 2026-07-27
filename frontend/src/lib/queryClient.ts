import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance for TanStack Query.
 * Exported so that auth handlers (e.g. useAuth login/logout) can clear the cache
 * when switching users to prevent cross-user data leakage.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 0,
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
