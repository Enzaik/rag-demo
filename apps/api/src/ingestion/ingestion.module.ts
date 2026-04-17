import { Module } from "@nestjs/common";
import { EmbeddingsService } from "./embeddings.service";
import { ProductsIngestor } from "./products.ingestor";

@Module({
  providers: [EmbeddingsService, ProductsIngestor],
  exports: [EmbeddingsService, ProductsIngestor],
})
export class IngestionModule {}
