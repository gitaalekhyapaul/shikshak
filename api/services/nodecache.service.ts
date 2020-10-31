import nodeCache from "node-cache";
import { errors } from "../error/error.constant";

export class CacheService {
  private static instance: CacheService;
  private cache: null | nodeCache = null;
  private constructor() {}

  public initalize = async (): Promise<void> => {
    try {
      this.cache = new nodeCache({
        stdTTL: 86400,
      });
      console.info(`Connected to NodeCache`);
    } catch (err) {
      console.error("Could not connect to NodeCache");
      console.error("NodeCacheError\n%o", { error: err });
      throw errors.INTERNAL_SERVER_ERROR;
    }
  };

  public static getInstance = (): CacheService => {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
      return CacheService.instance!;
    }
    return CacheService.instance!;
  };
  public getCache = (): nodeCache => {
    return this.cache!;
  };
}
