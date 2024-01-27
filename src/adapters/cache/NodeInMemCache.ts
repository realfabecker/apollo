import { injectable } from "inversify";
import NodeCache from "node-cache";
import { ICacheProvider } from "@ports/ports";

@injectable()
export class NodeInMemCache implements ICacheProvider {
  private readonly cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  async set(key: string, val: string, ttl: number = 0): Promise<void> {
    this.cache.set(key, val, ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) as string | null;
  }
}
