declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string;

    APOLLO__APP__PORT: string;
    APOLLO__APP__HOST: string;
    APOLLO__JWT__SECRET: string;

    NODE_ENV: "development" | "production";
  }
}
