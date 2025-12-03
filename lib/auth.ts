import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.AUTH_SECRET!,
  baseURL: "https://todo.bnav.dev", // The base URL of THIS client app
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "bnav-oidc", // A custom ID you choose
          clientId: process.env.TODO_CLIENT_ID!, // From login.bnav.dev
          clientSecret: process.env.TODO_CLIENT_SECRET!,
          // This tells it to use the OIDC provider's standard endpoints
          discoveryUrl:
            "https://login.bnav.dev/api/auth/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email"], // Standard OIDC scopes
        },
      ],
    }),
  ],
});
