import express from "express";
import { inject, injectable } from "inversify";
import { IGreeterService, Types } from "@ports/ports";
import Boom from "@hapi/boom";

@injectable()
export class HttpRouter {
  constructor(
    @inject(Types.GreeterService)
    private readonly service: IGreeterService,
  ) {}

  /**
   * @openapi
   *
   * /status:
   *   get:
   *     description: Obtém situação de execução do aplicativo
   *     tags: [Apollo]
   *     responses:
   *       200:
   *         description: Sucesso na consulta da situação
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   message: "UP and Running!"
   */
  public async getStatus(req: express.Request, res: express.Response) {
    res.status(200).send({ status: "success", message: "Up and Running!" });
  }

  /**
   * @openapi
   *
   * /greet:
   *   get:
   *     description: Cumprimenta pelo query string
   *     tags: [Apollo]
   *     parameters:
   *      - name: name
   *        in: query
   *        required: true
   *        description: Nome a ser cumprimentado
   *        schema:
   *          type: string
   *     responses:
   *       200:
   *         description: Sucesso no registro da operação
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GreetingsResponse'
   */
  public async getGreet(req: express.Request, res: express.Response) {
    const { name } = req.query;
    if (!name) throw Boom.badRequest("name field is required");
    const greetings = await this.service.greet(name as string);
    res.status(200).send({ status: "success", message: greetings });
  }

  /**
   * @openapi
   *
   * /greet:
   *   post:
   *     description: Cumprimenta pelo request body
   *     tags: [Apollo]
   *     requestBody:
   *      description: Informações para saudações
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/GreetingsPostRequest'
   *     responses:
   *       200:
   *         description: Sucesso no registro da operação
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GreetingsResponse'
   */
  public async postGreet(req: express.Request, res: express.Response) {
    const { name } = req.body;
    if (!name) throw Boom.badRequest("name field is required");
    const greetings = await this.service.greet(name as string);
    res.status(200).send({ status: "success", message: greetings });
  }
}
