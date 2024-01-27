declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string;

    APOLLO__PORT: string;
    APOLLO__HOST: string;
    APOLLO__TOKEN: string;

    NODE_ENV: "development" | "production";
  }
}
