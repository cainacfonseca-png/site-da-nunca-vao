import { useEffect } from "react";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export function useAuth(options: { redirectOnUnauthenticated?: boolean } = {}) {
  const me = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      void me.refetch();
    },
  });

  useEffect(() => {
    if (options.redirectOnUnauthenticated && !me.isLoading && !me.data) {
      startLogin();
    }
  }, [options.redirectOnUnauthenticated, me.isLoading, me.data]);

  return {
    user: me.data ?? null,
    loading: me.isLoading,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
}
