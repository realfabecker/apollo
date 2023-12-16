import { Container } from "inversify";

import { Types } from "@ports/ports";
import { GreeterService } from "@services/GreeterService";
import { ConsoleApp } from "@handlers/cmd/ConsoleApp";
import { HttpApp } from "@handlers/http/HttpApp";
import { HttpRouter } from "@handlers/http/HttpRouter";
import { ConsoleLogger } from "@adapters/logger/ConsoleLogger";
import { DocsGenCmd } from "@handlers/cmd/DocsGenCmd";
import { GreeterCmd } from "@handlers/cmd/GreeterCmd";
import { EnvConfigReader } from "@adapters/config/EnvConfigReader";
import { ApolloConfigEntity, ApolloConfigSchema } from "@domain/schema";

export const container = new Container();
container.bind(Types.GreeterService).to(GreeterService);
container.bind(Types.Logger).to(ConsoleLogger);
container.bind(Types.HttpApp).to(HttpApp);
container.bind(HttpRouter).toSelf();
container.bind(Types.ConsoleApp).to(ConsoleApp);
container.bind(DocsGenCmd).toSelf();
container.bind(GreeterCmd).toSelf();
container.bind(Types.ApolloConfig).toDynamicValue(() => {
  return new EnvConfigReader<ApolloConfigEntity>("APOLLO", ApolloConfigSchema);
});
