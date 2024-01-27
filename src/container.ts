import { Container, interfaces } from "inversify";
import { ConsoleApp } from "@handlers/cmd/ConsoleApp";
import { HttpApp } from "@handlers/http/HttpApp";
import { ConsoleLogger } from "@adapters/logger/ConsoleLogger";
import { DocsGenCmd } from "@handlers/cmd/DocsGenCmd";
import { Types } from "@ports/types";
import { VehicleFileSystemRepository } from "@adapters/vehicle/VehicleFileSystemRepository";
import { VehicleService } from "@services/VehicleService";
import { NodeInMemCache } from "@adapters/cache/NodeInMemCache";
import { JsonWebtokenProvider } from "@adapters/jwt/JsonWebtokenProvider";
import { JwtAuthService } from "@services/JwtAuthService";
import { BearerTokenAuth } from "@apollo/core/auth/BearerTokenAuth";
import { FileSystemBuildReader } from "@adapters/config/FileSystemBuildReader";
import { YamlEnvConfigReader } from "@adapters/config/YamlEnvConfigReader";
import { IAppConfigReader } from "@ports/ports";
import { StatusRouter } from "@handlers/http/routes/StatusRouter";
import { VehicleRouter } from "@handlers/http/routes/VehicleRouter";
import { OauthRouter } from "@handlers/http/routes/OauthRouter";

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
container.bind(Types.AppConfigReader).to(YamlEnvConfigReader);
container.bind(StatusRouter).toSelf();
container.bind(VehicleRouter).toSelf();
container.bind(OauthRouter).toSelf();
container.bind(DocsGenCmd).toSelf();

container
  .bind(Types.AppConfig)
  .toDynamicValue((context: interfaces.Context) => {
    const reader = context.container.get<IAppConfigReader>(
      Types.AppConfigReader,
    );
    return reader.read();
  })
  .inSingletonScope();
