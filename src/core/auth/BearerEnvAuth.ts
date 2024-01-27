import { injectable } from "inversify";
import { Request } from "express";
import { IHttpAuth } from "@ports/ports";

@injectable()
export class BearerEnvAuth implements IHttpAuth {
  async authorize(request: Request): Promise<boolean> {
    const auth = request?.headers?.["authorization"]?.split("Bearer ")?.[1];
    return !!(auth && auth === process.env.APOLLO__TOKEN);
  }
}
