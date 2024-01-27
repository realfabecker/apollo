import { IAuthService, IJwtProvider } from "@ports/ports";
import { inject, injectable, unmanaged } from "inversify";
import { Types } from "@ports/types";
import process from "process";

@injectable()
export class JwtAuthService implements IAuthService {
  constructor(
    @inject(Types.JwtProvider) private readonly jwtProvider: IJwtProvider,
    @unmanaged() private readonly key = <string>process.env.APOLLO__TOKEN,
  ) {}

  async auth(login: string, password: string): Promise<{ token: string }> {
    const token = this.jwtProvider.encode(
      {
        sub: login,
        pas: password,
      },
      this.key,
    );
    return { token };
  }

  async verify(token: string): Promise<boolean> {
    try {
      return !!this.jwtProvider.verify(token, this.key);
    } catch (e) {
      return false;
    }
  }
}
