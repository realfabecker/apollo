import yargs from "yargs";
import { injectable } from "inversify";
import { IConsoleApp } from "@ports/ports";
import { DocsGenCmd } from "@handlers/cmd/DocsGenCmd";
import { GreeterCmd } from "@handlers/cmd/GreeterCmd";

@injectable()
export class ConsoleApp implements IConsoleApp {
  constructor(
    private readonly greetCmd: GreeterCmd,
    private readonly docsGenCmd: DocsGenCmd,
  ) {}

  async run(): Promise<any> {
    await yargs(process.argv.slice(2))
      .scriptName("api")
      .command(this.greetCmd.Command())
      .command(this.docsGenCmd.Command())
      .demandCommand()
      .parseAsync();
  }
}
