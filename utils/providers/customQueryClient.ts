import { QueryClient, isServer } from "@tanstack/react-query";

function queryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 6000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function customQueryClient() {
  if (isServer) {
    return queryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = queryClient();
    return browserQueryClient;
  }
}
