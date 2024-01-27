import express from "express";
import { inject, injectable } from "inversify";
import { IBuildConfigReader } from "@ports/ports";
import { Types } from "@ports/types";
import { StatusCodes } from "http-status-codes";

@injectable()
export class StatusRouter {
  constructor(
    @inject(Types.BuildConfigReader)
    private readonly buildReader: IBuildConfigReader,
  ) {}
  /**
   * @openapi
   *
   * /api/status:
   *   get:
   *     summary: Obtém situação do aplicativo
   *     tags: [Apollo]
   *     responses:
   *       200:
   *         description: Sucesso na consulta da situação
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/BuildDTO"
   */
  public async getStatus(req: express.Request, res: express.Response) {
    const data = await this.buildReader.read();
    if (!data) return res.status(StatusCodes.NO_CONTENT).send();
    res.status(StatusCodes.OK).send(data);
  }
}
