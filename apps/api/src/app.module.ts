import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { AuthModule } from "./auth/auth.module";
import { DbModule } from "./db/db.module";
import { IngestionModule } from "./ingestion/ingestion.module";
import { AdminModule } from "./admin/admin.module";
import { RetrievalModule } from "./retrieval/retrieval.module";
import { ConversationsModule } from "./conversations/conversations.module";

@Module({
  imports: [
    DbModule,
    AuthModule,
    IngestionModule,
    AdminModule,
    RetrievalModule,
    ConversationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
