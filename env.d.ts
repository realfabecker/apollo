declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string;

    APOLLO__PORT: string;
    APOLLO__HOST: string;

    NODE_ENV: string;
  }
}
