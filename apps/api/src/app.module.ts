import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { AuthModule } from "./auth/auth.module";
import { IngestionModule } from "./ingestion/ingestion.module";

@Module({
  imports: [AuthModule, IngestionModule],
  controllers: [HealthController],
})
export class AppModule {}
