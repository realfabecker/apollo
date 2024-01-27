import { Container } from "inversify";

import { ConsoleApp } from "@handlers/cmd/ConsoleApp";
import { HttpApp } from "@handlers/http/HttpApp";
import { StatusRouter } from "@handlers/http/StatusRouter";
import { ConsoleLogger } from "@adapters/logger/ConsoleLogger";
import { DocsGenCmd } from "@handlers/cmd/DocsGenCmd";
import { EnvConfigReader } from "@adapters/config/EnvConfigReader";
import { Types } from "@ports/types";
import { ApolloConfigEntity, ApolloConfigSchema } from "@domain/config";
import { VehicleRouter } from "@handlers/http/VehicleRouter";
import { VehicleFileSystemRepository } from "@adapters/vehicle/VehicleFileSystemRepository";
import { VehicleService } from "@services/VehicleService";
import { NodeInMemCache } from "@adapters/cache/NodeInMemCache";
import { JsonWebtokenProvider } from "@adapters/jwt/JsonWebtokenProvider";
import { OauthRouter } from "@handlers/http/OauthRouter";
import { JwtAuthService } from "@services/JwtAuthService";
import { BearerTokenAuth } from "@apollo/core/auth/BearerTokenAuth";
import { FileSystemBuildReader } from "@adapters/config/FileSystemBuildReader";

export const container = new Container();
container.bind(Types.Logger).to(ConsoleLogger);
container.bind(Types.HttpApp).to(HttpApp);
container.bind(Types.ConsoleApp).to(ConsoleApp);
container.bind(Types.VehicleService).to(VehicleService);
container.bind(Types.VehicleRepository).to(VehicleFileSystemRepository);
container.bind(Types.HttpAuth).to(BearerTokenAuth);
container.bind(Types.BuildConfigReader).to(FileSystemBuildReader);
container.bind(Types.CacheProvider).to(NodeInMemCache);
container.bind(Types.JwtProvider).to(JsonWebtokenProvider);
container.bind(Types.AuthService).to(JwtAuthService);

container.bind(Types.ApolloConfig).toDynamicValue(() => {
  return new EnvConfigReader<ApolloConfigEntity>("APOLLO", ApolloConfigSchema);
});

container.bind(StatusRouter).toSelf();
container.bind(VehicleRouter).toSelf();
container.bind(OauthRouter).toSelf();
container.bind(DocsGenCmd).toSelf();
