import { ApolloConfigEntity } from "@domain/schema";

export const Types = {
  HttpApp: Symbol.for("IHttpApp"),
  ConsoleApp: Symbol.for("IConsoleApp"),
  GreeterService: Symbol.for("IGreeterService"),
  Logger: Symbol.for("ILogger"),
  ApolloConfig: Symbol.for("IApolloConfig"),
};

export interface IHttpApp {
  listen(port: number): void;
  register(): void;
}

export interface IGreeterService {
  greet(name: string): Promise<string>;
}

export interface IConsoleApp {
  run(): Promise<void>;
}

export interface ILogger {
  label(key: string, val: string): void;
  inf(message: string): void;
  err(message: string): void;
  exp(error: Error): void;
}

export interface IConfigStore<T extends object> {
  get(key: keyof T): string;
}

export type IApolloConfig = IConfigStore<ApolloConfigEntity>;
