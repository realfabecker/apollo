import { IJwtProvider } from "@ports/ports";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class JsonWebtokenProvider implements IJwtProvider {
  decode(token: string): Record<string, any> | null {
    return jwt.decode(token) as Record<string, any>;
  }

  verify(token: string, key: string): Record<string, any> | null {
    return jwt.verify(token, key) as Record<string, any>;
  }

  encode(data: Record<string, any>, key: string): string {
    return jwt.sign(data, key);
  }
}
