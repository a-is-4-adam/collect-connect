import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_PUBLIC_ANON_KEY: z.string(),
});

export const env = envSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_PUBLIC_ANON_KEY: process.env.SUPABASE_PUBLIC_ANON_KEY,
});
