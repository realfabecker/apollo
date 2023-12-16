import yargs, { ArgumentsCamelCase } from "yargs";
import { inject, injectable } from "inversify";
import { IGreeterService, ILogger, Types } from "@ports/ports";

@injectable()
export class GreeterCmd {
  constructor(
    @inject(Types.GreeterService)
    private readonly service: IGreeterService,
    @inject(Types.Logger)
    private readonly logger: ILogger,
  ) {}

  Command(): yargs.CommandModule {
    return {
      command: "greet",
      describe: "say hello to somebody",
      builder: (yargs: yargs.Argv) => {
        return yargs
          .option("name", {
            describe: "name to say hello to",
          })
          .demandOption("name");
      },
      handler: async (args: ArgumentsCamelCase<{ name?: string }>) => {
        const greetings = await this.service.greet(args.name as string);
        this.logger.inf(greetings);
      },
    };
  }
}
