import yargs from "yargs";
import { inject, injectable } from "inversify";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";
import { IApolloConfig, ILogger, Types } from "@ports/ports";
import * as process from "process";

@injectable()
export class DocsGenCmd {
  constructor(
    @inject(Types.Logger) private readonly logger: ILogger,
    @inject(Types.ApolloConfig) private readonly config: IApolloConfig,
  ) {}

  Command(): yargs.CommandModule {
    return {
      command: "docs:gen",
      describe: "generate open api docs",
      handler: async () => {
        const base = path.resolve(path.join(__dirname, "..", "..", ".."));
        const host = this.config.get("host");
        const port = this.config.get("port");
        const env = (process.env.NODE_ENV || "development")
          .substring(0, 3)
          .toUpperCase();

        const options = {
          definition: {
            openapi: "3.0.0",
            info: {
              title: "API",
              version: "0.0.1",
            },
            servers: [
              {
                url: `${host}:${port}/api`,
                description: `Acesso (${env})`,
              },
            ],
          },
          apis: [
            base + "/src/handlers/http/*.ts",
            base + "/docs/specs/components/schemas/*.yml",
          ],
        };

        const openApiSpecification = swaggerJSDoc(options);
        const writeTo = path.resolve(
          path.join(base, "docs", "specs", "openapi.json"),
        );
        fs.writeFileSync(writeTo, JSON.stringify(openApiSpecification));
        this.logger.inf(`schema open api registrado em ${writeTo}`);
      },
    };
  }
}
