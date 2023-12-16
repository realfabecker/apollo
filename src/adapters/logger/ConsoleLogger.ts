import winston from "winston";
import * as util from "util";
import { injectable } from "inversify";
import { ILogger } from "@ports/ports";

@injectable()
export class ConsoleLogger implements ILogger {
  private logger: winston.Logger;
  private context: { val: string; key: string }[] = [];

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.metadata(),
        winston.format.printf(({ level, message, ...opts }) => {
          const metadata = (
            (opts.metadata?.context as Record<string, any>[]) || []
          ).reduce((acc, { key, val }) => `${acc} ${key}="${val}"`, "");
          return util.format(
            'datetime="%s" level="%s" message="%s" %s',
            opts.metadata.timestamp,
            level,
            message,
            metadata.trim(),
          );
        }),
      ),
    });
    this.logger.add(new winston.transports.Console());
  }

  public label(key: string, val: string): void {
    const index = this.context.findIndex((value) => value.key === key);
    if (index !== -1) {
      this.context[index].val = val;
    } else {
      this.context.push({ key, val });
    }
  }

  public inf(message: string): void {
    this.logger.info(this.sanitize(message), { context: this.context });
  }

  public err(message: string): void {
    this.logger.error(this.sanitize(message), { context: this.context });
  }

  public exp(error: Error): void {
    const stack = (<Error>error)?.stack?.split("\n").map((s) => s.trim());
    if (stack) {
      this.label("stack", this.sanitize(JSON.stringify(stack)));
    }
    this.err(error.message);
  }

  private sanitize(str: string): string {
    return (str + "")
      .replace(/[\\"']/g, "\\$&")
      .replace(/\u0000/g, "\\0")
      .replace(/\n|\r\n+/g, "");
  }
}
