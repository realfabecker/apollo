import yargs from "yargs";
import { injectable } from "inversify";
import { IConsoleApp } from "@ports/ports";
import { DocsGenCmd } from "@handlers/cmd/DocsGenCmd";

@injectable()
export class ConsoleApp implements IConsoleApp {
  constructor(private readonly docsGenCmd: DocsGenCmd) {}

  async run(): Promise<any> {
    await yargs(process.argv.slice(2))
      .scriptName("api")
      .command(this.docsGenCmd.Command())
      .demandCommand()
      .parseAsync();
  }
}
