import { injectable } from "inversify";
import { IGreeterService } from "@ports/ports";

@injectable()
export class GreeterService implements IGreeterService {
  public async greet(name: string): Promise<string> {
    return `Hello ${name}`;
  }
}
