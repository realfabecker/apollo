#!/usr/bin/env node
import "reflect-metadata";
import "tsconfig-paths/register";
import { IConsoleApp } from "@ports/ports";
import { container } from "@apollo/container";
import { Types } from "@ports/types";

(async () => {
  try {
    const app = container.get<IConsoleApp>(Types.ConsoleApp);
    await app.run();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
