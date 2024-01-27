import "reflect-metadata";
//ts-ignore
import "tsconfig-paths/register";
import { IHttpApp } from "@ports/ports";
import { Types } from "@ports/types";
import { container } from "@apollo/container";
import { AppConfig } from "@domain/config";

try {
  const cnf = container.get<AppConfig>(Types.AppConfig);
  const app = container.get<IHttpApp>(Types.HttpApp);
  app.register();
  app.listen(Number(cnf.app.port));
} catch (e) {
  console.error(e);
  process.exit(1);
}
