import { Request } from "express";
import { IHttpAuth } from "@ports/ports";
import { injectable } from "inversify";

@injectable()
export class BearerAnyAuth implements IHttpAuth {
  async authorize(request: Request): Promise<boolean> {
    const auth = request?.headers?.["authorization"]?.split("Bearer ")?.[1];
    return !!(auth && auth?.length);
  }
}
