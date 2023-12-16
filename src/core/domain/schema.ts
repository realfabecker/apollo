import { z } from "zod";

export const ApolloConfigSchema = z.object({
  host: z.string(),
  port: z.string(),
});
export type ApolloConfigEntity = z.infer<typeof ApolloConfigSchema>;
