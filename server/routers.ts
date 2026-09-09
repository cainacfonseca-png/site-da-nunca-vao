import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createProduct, deleteProduct, getAnalytics, listAdminProducts, listPublicProducts, recordPageVisit, recordProductClick, updateProduct } from "./db";
import { systemRouter } from "./_core/systemRouter";

const productInput = z.object({
  name: z.string().trim().min(1).max(220),
  section: z.enum(["store", "finds"]),
  purchaseUrl: z.string().url(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  position: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.query(() => listPublicProducts()),
    visit: publicProcedure.input(z.object({ path: z.string().max(200).default("/"), referrer: z.string().max(500).optional() })).mutation(({ ctx, input }) => recordPageVisit(input.path, input.referrer, ctx.req.headers["user-agent"])),
    click: publicProcedure.input(z.object({ productId: z.number().int().positive(), referrer: z.string().max(500).optional() })).mutation(({ ctx, input }) => recordProductClick(input.productId, input.referrer, ctx.req.headers["user-agent"])),
  }),
  admin: router({
    products: adminProcedure.query(() => listAdminProducts()),
    createProduct: adminProcedure.input(productInput).mutation(({ input }) => createProduct(input)),
    updateProduct: adminProcedure.input(z.object({ id: z.number().int().positive(), values: productInput.partial() })).mutation(({ input }) => updateProduct(input.id, input.values)),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteProduct(input.id)),
    analytics: adminProcedure.query(() => getAnalytics()),
  }),
});

export type AppRouter = typeof appRouter;
