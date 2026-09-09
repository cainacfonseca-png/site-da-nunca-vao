import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { createRoot } from "react-dom/client";
import App from "./App";
import { trpc } from "./lib/trpc";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Elemento root não encontrado");

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
});

createRoot(root).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>,
);
