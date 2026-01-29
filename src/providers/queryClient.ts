import { QueryClient } from "@tanstack/react-query";

// Create a singleton QueryClient instance
// This can be imported by both React components and route loaders
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});
