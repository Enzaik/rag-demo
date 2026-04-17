import { Module } from "@nestjs/common";
import { IngestionModule } from "../ingestion/ingestion.module";
import { AdminController } from "./admin.controller";
import { LocalOnlyGuard } from "./local-only.guard";

@Module({
  imports: [IngestionModule],
  controllers: [AdminController],
  providers: [LocalOnlyGuard],
})
export class AdminModule {}
