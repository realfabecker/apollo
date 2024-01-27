import { inject, injectable } from "inversify";
import { Request } from "express";
import { IHttpAuth } from "@ports/ports";
import { Types } from "@ports/types";
import { AppConfig } from "@domain/config";

@injectable()
export class BearerEnvAuth implements IHttpAuth {
  constructor(@inject(Types.AppConfig) private readonly config: AppConfig) {}
  async authorize(request: Request): Promise<boolean> {
    const auth = request?.headers?.["authorization"]?.split("Bearer ")?.[1];
    return !!(auth && auth === this.config.jwt.secret);
  }
}
