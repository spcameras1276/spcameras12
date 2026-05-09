import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { getProdutos, getGaleria, getDepoimentos, getContatos } from "./db";
import { z } from "zod";
import { verifyAdminLogin } from "./admin-auth";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input }) => {
        const token = await verifyAdminLogin(input.username, input.password);
        
        if (!token) {
          throw new Error("Usuário ou senha inválidos");
        }

        return { token };
      }),
    produtos: router({
      list: adminProcedure.query(() => getProdutos()),
    }),
    galeria: router({
      list: adminProcedure.query(() => getGaleria()),
    }),
    depoimentos: router({
      list: adminProcedure.query(() => getDepoimentos()),
    }),
    contatos: router({
      list: adminProcedure.query(() => getContatos()),
    }),
  }),
});

export type AppRouter = typeof appRouter;
