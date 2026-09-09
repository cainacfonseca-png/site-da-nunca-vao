import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function adminContext(): TrpcContext {
  return {
    user: { id: 1, openId: "admin", name: "Admin", email: "admin@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("catalog product validation", () => {
  it("rejects a product without a valid purchase URL", async () => {
    const caller = appRouter.createCaller(adminContext());
    await expect(caller.admin.createProduct({ name: "Produto", section: "store", purchaseUrl: "nao-e-url", position: 0, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects non-admin access to the admin catalog", async () => {
    const ctx = adminContext();
    ctx.user = { ...ctx.user!, role: "user" };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.products()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
