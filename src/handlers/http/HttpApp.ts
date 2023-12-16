//@ts-ignore
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IHttpApp, ILogger, Types } from "@ports/ports";
import Boom from "@hapi/boom";
import { HttpRouter } from "@handlers/http/HttpRouter";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSp from "../../../docs/specs/openapi.json";
import { getReasonPhrase, ReasonPhrases, StatusCodes } from "http-status-codes";

@injectable()
export class HttpApp implements IHttpApp {
  private readonly app: express.Application;

  constructor(
    private router: HttpRouter,
    @inject(Types.Logger)
    private logger: ILogger,
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
    this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSp));
    this.app.get("/api/status", this.router.getStatus.bind(this.router));
    this.app.get("/api/greet", this.router.getGreet.bind(this.router));
    this.app.post("/api/greet", this.router.postGreet.bind(this.router));
    this.app.use(this.error.bind(this));
  }

  error(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
      return next(err);
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
}
