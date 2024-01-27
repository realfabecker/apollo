import { z } from "zod";

export const BuildConfigSchema = z.object({
  build: z.object({
    date: z.string(),
    number: z.string(),
  }),
  git: z.object({
    commit: z.string(),
  }),
});
export type BuildConfig = z.infer<typeof BuildConfigSchema>;

export const AppConfigSchema = z.object({
  app: z.object({
    host: z.string(),
    port: z.string(),
  }),
  jwt: z.object({
    secret: z.string(),
  }),
});
export type AppConfig = z.infer<typeof AppConfigSchema>;
