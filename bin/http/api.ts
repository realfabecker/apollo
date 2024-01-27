import "reflect-metadata";
//ts-ignore
import "tsconfig-paths/register";
import { IApolloConfig, IHttpApp } from "@ports/ports";
import { Types } from "@ports/types";
import { container } from "@apollo/container";

try {
  const cnf = container.get<IApolloConfig>(Types.ApolloConfig);
  const app = container.get<IHttpApp>(Types.HttpApp);
  app.register();
  app.listen(Number(cnf.get("port")));
} catch (e) {
  console.error(e);
  process.exit(1);
}
