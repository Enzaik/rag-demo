import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { IngestionModule } from "../ingestion/ingestion.module";
import { RetrievalController } from "./retrieval.controller";
import { RetrievalService } from "./retrieval.service";

@Module({
  imports: [AuthModule, IngestionModule],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
