"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { customQueryClient } from "./customQueryClient";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = customQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
