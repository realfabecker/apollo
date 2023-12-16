import "reflect-metadata";
//ts-ignore
import "tsconfig-paths/register";
import { IApolloConfig, IHttpApp, Types } from "@ports/ports";
import { container } from "@apollo/container";
import * as process from "process";

try {
  const cnf = container.get<IApolloConfig>(Types.ApolloConfig);
  const app = container.get<IHttpApp>(Types.HttpApp);
  app.register();
  app.listen(Number(cnf.get("port")));
} catch (e) {
  console.error(e);
  process.exit(1);
}
