#!/usr/bin/env node
import "reflect-metadata";
import "tsconfig-paths/register";
import { IConsoleApp, Types } from "@ports/ports";
import { container } from "@apollo/container";
import * as console from "console";
import * as process from "process";

(async () => {
  try {
    const app = container.get<IConsoleApp>(Types.ConsoleApp);
    await app.run();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
