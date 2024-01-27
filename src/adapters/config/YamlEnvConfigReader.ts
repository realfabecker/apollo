import { injectable } from "inversify";
import * as path from "path";
import YAML from "yaml";
import fs from "fs";
import { AppConfig } from "@domain/config";
import { IAppConfigReader } from "@ports/ports";

@injectable()
export class YamlEnvConfigReader implements IAppConfigReader {
  public read(): AppConfig {
    let file = fs.readFileSync(
      path.join(__dirname, "..", "..", "..", "app.yml"),
      { encoding: "utf-8" },
    );
    const envs = file.match(/\{\{(?<env>.*):-(?<default>.*)}}/g);
    envs?.forEach((item) => {
      const m = item.match(/{{(?<env>.*):-(?<default>.*)}}/);
      if (!m?.groups || !m[0]) return;
      if (process.env[m.groups.env]) {
        file = file.replace(m[0], <string>process.env[m.groups.env]);
      } else {
        file = file.replace(m[0], <string>m.groups.default);
      }
    });
    return YAML.parse(file);
  }
}
