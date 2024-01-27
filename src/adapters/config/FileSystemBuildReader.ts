import path from "path";
import fs from "fs";
import ini from "ini";
import { inject, injectable, unmanaged } from "inversify";

import { IBuildConfigReader, ICacheProvider } from "@ports/ports";
import { BuildConfig } from "@domain/config";
import { Types } from "@ports/types";
import * as process from "process";

const isDev = process.env.NODE_ENV === "development";

@injectable()
export class FileSystemBuildReader implements IBuildConfigReader {
  constructor(
    @inject(Types.CacheProvider) private readonly cache: ICacheProvider,
    @unmanaged()
    private readonly key = isDev ? "build.info.sample" : "build.info",
  ) {}

  public async read(): Promise<BuildConfig | undefined> {
    const config = await this.cache.get(this.key);
    if (config) return JSON.parse(config as string) as BuildConfig;

    const p = path.resolve(path.join(__dirname, "..", "..", "..", this.key));
    if (!fs.existsSync(p)) return;

    const info = fs.readFileSync(p, { encoding: "utf-8" });
    const data = ini.parse(info) as BuildConfig | undefined;
    await this.cache.set(this.key, JSON.stringify(data));
    return data;
  }
}
