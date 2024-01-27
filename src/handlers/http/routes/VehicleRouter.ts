import express from "express";
import { inject, injectable } from "inversify";
import { Types } from "@ports/types";
import { IVehicleService } from "@ports/ports";
import {
  VehiclePostSchema,
  VehiclePutSchema,
} from "@handlers/http/dtos/vehicle";
import { StatusCodes } from "http-status-codes";

@injectable()
export class VehicleRouter {
  constructor(
    @inject(Types.VehicleService)
    private readonly vehicleService: IVehicleService,
  ) {}

  /**
   * @openapi
   *
   * /api/vehicles:
   *   post:
   *     summary: Cria um novo veículo
   *     tags: [Apollo]
   *     security:
   *      - BearerAuth: []
   *     requestBody:
   *      description: Informações-base para cadastro de veículo
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/VehiclePostDTO'
   *     responses:
   *      200:
   *        description: Sucesso no cadastro do veículo
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                data:
   *                  $ref: '#/components/schemas/VehicleDTO'
   */
  public async postVehicle(req: express.Request, res: express.Response) {
    const data = VehiclePostSchema.parse(req.body);
    const vehicle = await this.vehicleService.create(data);
    res.status(StatusCodes.OK).send({ data: vehicle });
  }

  /**
   * @openapi
   *
   * /api/vehicles/{id}:
   *   patch:
   *     summary: Atualiza um veículo
   *     tags: [Apollo]
   *     security:
   *      - BearerAuth: []
   *     parameters:
   *      - name: id
   *        in: path
   *        description: ID do veículo
   *        required: true
   *        schema:
   *          type: string
   *     requestBody:
   *      description: Informações-base para atualização de um veículo
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/VehiclePutDTO'
   *     responses:
   *      200:
   *        description: Sucesso na atualização do Veículo
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                data:
   *                  $ref: '#/components/schemas/VehicleDTO'
   */
  public async pathVehicle(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const data = VehiclePutSchema.parse(req.body);
    const vehicle = await this.vehicleService.update(id, data);
    res.status(StatusCodes.OK).send({ data: vehicle });
  }

  /**
   * @openapi
   *
   * /api/vehicles:
   *   get:
   *     summary: Obtém listagem de veículos
   *     tags: [Apollo]
   *     security:
   *      - BearerAuth: []
   *     responses:
   *      200:
   *        description: Veículo obtido com sucesso
   */
  public async listVehicles(req: express.Request, res: express.Response) {
    const vehicles = await this.vehicleService.list();
    return res.status(StatusCodes.OK).send({ data: vehicles });
  }

  /**
   * @openapi
   *
   * /api/vehicles/{id}:
   *   get:
   *     summary: Atualiza um veículo
   *     tags: [Apollo]
   *     security:
   *      - BearerAuth: []
   *     parameters:
   *      - name: id
   *        in: path
   *        description: ID do veículo
   *        required: true
   *        schema:
   *          type: string
   *     responses:
   *      200:
   *        description: Veículo obtido com sucesso
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                data:
   *                  $ref: '#/components/schemas/VehicleDTO'
   */
  public async getVehicle(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const vehicle = await this.vehicleService.findById(id);
    if (!vehicle) return res.status(StatusCodes.NOT_FOUND).send();
    return res.status(StatusCodes.OK).send({ data: vehicle });
  }

  /**
   * @openapi
   *
   * /api/vehicles/{id}:
   *   delete:
   *     summary: Remove um veículo
   *     tags: [Apollo]
   *     security:
   *      - BearerAuth: []
   *     parameters:
   *      - name: id
   *        in: path
   *        description: ID do veículo
   *        required: true
   *        schema:
   *          type: string
   *     responses:
   *      204:
   *        description: Veículo removido com sucesso
   */
  public async deleteVehicle(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const vehicle = await this.vehicleService.findById(id);
    if (!vehicle) return res.status(StatusCodes.NOT_FOUND).send();
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
