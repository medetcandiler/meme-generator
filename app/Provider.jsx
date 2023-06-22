"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Provider({ children }) {
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default Provider;