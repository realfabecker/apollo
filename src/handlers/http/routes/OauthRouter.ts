import express from "express";
import { inject, injectable } from "inversify";
import { IAuthService } from "@ports/ports";
import { Types } from "@ports/types";
import { StatusCodes } from "http-status-codes";

@injectable()
export class OauthRouter {
  constructor(
    @inject(Types.AuthService)
    private readonly authService: IAuthService,
  ) {}

  /**
   * @openapi
   *
   * /api/oauth/token:
   *   post:
   *     summary: Gera novo token de acesso a aplicação
   *     tags: [Apollo]
   *     security:
   *      - BasicAuth: []
   *     responses:
   *       200:
   *         description: Sucesso na processo de autorização
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                token:
   *                  type: string
   */
  public async postToken(req: express.Request, res: express.Response) {
    const auth = req.headers?.["authorization"]?.split("Basic ")?.[1] || "";
    if (!auth) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }
    const [user, pass] = Buffer.from(auth, "base64").toString().split(":");
    if (!user || !pass) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }
    const data = await this.authService.auth(user, pass);
    res.status(StatusCodes.OK).send(data);
  }
}
