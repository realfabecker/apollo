import { IAuthService, IJwtProvider } from "@ports/ports";
import { inject, injectable } from "inversify";
import { Types } from "@ports/types";
import { AppConfig } from "@domain/config";

@injectable()
export class JwtAuthService implements IAuthService {
  constructor(
    @inject(Types.JwtProvider) private readonly jwtProvider: IJwtProvider,
    @inject(Types.AppConfig) private readonly config: AppConfig,
  ) {}

  async auth(login: string, password: string): Promise<{ token: string }> {
    const token = this.jwtProvider.encode(
      {
        sub: login,
        pas: password,
      },
      this.config.jwt.secret,
    );
    return { token };
  }

  async verify(token: string): Promise<boolean> {
    try {
      return !!this.jwtProvider.verify(token, this.config.jwt.secret);
    } catch (e) {
      return false;
    }
  }
}
