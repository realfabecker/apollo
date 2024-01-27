import { inject, injectable } from "inversify";
import { Request } from "express";
import { IAuthService, IHttpAuth } from "@ports/ports";
import Boom from "@hapi/boom";
import { Types } from "@ports/types";

@injectable()
export class BearerTokenAuth implements IHttpAuth {
  constructor(
    @inject(Types.AuthService) private readonly authService: IAuthService,
  ) {}
  async authorize(request: Request): Promise<boolean> {
    const auth = request?.headers?.["authorization"]?.split("Bearer ")?.[1];
    if (!auth) throw Boom.unauthorized();
    return this.authService.verify(auth);
  }
}
