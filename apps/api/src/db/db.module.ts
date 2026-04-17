import { Global, Inject, Module, type OnApplicationShutdown } from "@nestjs/common";
import { createDb, type Database } from "@rag/db";
import type { Pool } from "pg";

export const DATABASE = Symbol("DATABASE");

export interface DbHandle {
  db: Database;
  pool: Pool;
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: (): DbHandle => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) throw new Error("DATABASE_URL is not set");
        return createDb({ connectionString });
      },
    },
  ],
  exports: [DATABASE],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async onApplicationShutdown() {
    await this.handle.pool.end();
  }
}
