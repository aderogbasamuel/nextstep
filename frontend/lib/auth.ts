import { betterAuth } from "better-auth";
import { pool } from "@/lib/db";

export const auth = betterAuth({
  database: pool,

  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://nextstepapp.vercel.app",
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
