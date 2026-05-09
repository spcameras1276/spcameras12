import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { verifyAdminLogin } from "./admin-auth";

export const adminRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const token = await verifyAdminLogin(input.username, input.password);
      
      if (!token) {
        throw new Error("Usuário ou senha inválidos");
      }

      return { token };
    }),
});
