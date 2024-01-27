//@ts-ignore
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IHttpApp, IHttpAuth, ILogger } from "@ports/ports";
import Boom from "@hapi/boom";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import { getReasonPhrase, ReasonPhrases, StatusCodes } from "http-status-codes";
import { Types } from "@ports/types";
import { ZodError } from "zod";
import swaggerSp from "../../../docs/specs/openapi.json";
import { StatusRouter } from "@handlers/http/routes/StatusRouter";
import { VehicleRouter } from "@handlers/http/routes/VehicleRouter";
import { OauthRouter } from "@handlers/http/routes/OauthRouter";

/**
 * @openapi
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *    BasicAuth:
 *      type: http
 *      scheme: basic
 */
@injectable()
export class HttpApp implements IHttpApp {
  private readonly app: express.Application;

  constructor(
    @inject(Types.Logger)
    private logger: ILogger,
    @inject(Types.HttpAuth)
    private httpAuth: IHttpAuth,
    private statusRouter: StatusRouter,
    private vehicleRouter: VehicleRouter,
    private oauthRouter: OauthRouter,
  ) {
    this.app = express();
    this.app.use(helmet());
    this.app.use(morgan("combined"));
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  listen(port: number): void {
    this.app.listen(port, () => this.logger.inf(`listening at ${port}`));
  }

  register(): void {
    // docs path definition
    this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSp));
    this.app.get("/api/docs.json", this.getSpecsHandler);

    // status path definition
    this.app.get(
      "/api/status",
      this.statusRouter.getStatus.bind(this.statusRouter),
    );

    // oauth path definition
    this.app.post(
      "/api/oauth/token",
      this.oauthRouter.postToken.bind(this.oauthRouter),
    );

    // auth middleware definition
    this.app.use(this.getAuthMiddleware.bind(this));

    // vehicle path definition
    this.app.post(
      "/api/vehicles",
      this.vehicleRouter.postVehicle.bind(this.vehicleRouter),
    );
    this.app.get(
      "/api/vehicles",
      this.vehicleRouter.listVehicles.bind(this.vehicleRouter),
    );
    this.app.get(
      "/api/vehicles/:id",
      this.vehicleRouter.getVehicle.bind(this.vehicleRouter),
    );
    this.app.patch(
      "/api/vehicles/:id",
      this.vehicleRouter.pathVehicle.bind(this.vehicleRouter),
    );
    this.app.delete(
      "/api/vehicles/:id",
      this.vehicleRouter.deleteVehicle.bind(this.vehicleRouter),
    );

    // error middleware binding
    this.app.use(this.getErrorMiddleware.bind(this));
  }

  getSpecsHandler(req: Request, res: Response) {
    const d = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "docs",
      "specs",
      "openapi.json",
    );
    const b = fs.readFileSync(d, { encoding: "utf8" }) || "{}";
    res.status(200).json(JSON.parse(b));
  }

  getErrorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (res.headersSent) {
      return next(err);
    }
    if (err instanceof ZodError) {
      const validationErrors = err.errors.map(
        (error) => `${error.path.join(".")}: ${error.message}`,
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: StatusCodes.BAD_REQUEST, message: validationErrors });
    }
    if (Boom.isBoom(err)) {
      return res.status(err.output.statusCode).json({
        status: err.output.statusCode,
        message: getReasonPhrase(err.output.statusCode),
        reason: err.message,
      });
    }
    this.logger.exp(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  async getAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!(await this.httpAuth.authorize(req))) {
        return next(Boom.unauthorized());
      }
      next();
    } catch (e) {
      next(Boom.unauthorized());
    }
  }
}
