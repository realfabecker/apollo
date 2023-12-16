import { z, ZodError } from "zod";
import { IConfigStore } from "@ports/ports";

export class EnvConfigReader<T extends object> implements IConfigStore<T> {
  data: T = {} as T;

  constructor(
    private readonly prefix: string,
    private readonly schema: z.ZodObject<any>,
  ) {
    this.data = this.load();
  }

  private load(): T {
    const data: { [key: string]: any } = {};
    const regSt = new RegExp(`^${this.prefix}__`);
    for (const k of Object.keys(process.env)) {
      if (!regSt.test(k)) {
        continue;
      }
      const key = k.replace(/__/g, ".").toLowerCase();
      data[key.replace(`${this.prefix.toLowerCase()}.`, "")] = process.env[k];
    }
    try {
      return this.schema.parse(data) as T;
    } catch (e) {
      const msg = (<ZodError>e).errors.map((m) => {
        return `${m.path.join(".")}: ${m.message}`;
      });
      throw new Error(`Config: ` + msg.join("; "));
    }
  }

  public get(key: keyof T): string {
    return this.data[key] as string;
  }
}
