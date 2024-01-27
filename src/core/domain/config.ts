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

export const ApolloConfigSchema = z.object({
  host: z.string(),
  port: z.string(),
});
export type ApolloConfigEntity = z.infer<typeof ApolloConfigSchema>;
