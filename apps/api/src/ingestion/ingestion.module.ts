import { Module } from "@nestjs/common";
import { EmbeddingsService } from "./embeddings.service";
import { ProductsIngestor } from "./products.ingestor";
import { MarkdownIngestor } from "./markdown.ingestor";

@Module({
  providers: [EmbeddingsService, ProductsIngestor, MarkdownIngestor],
  exports: [EmbeddingsService, ProductsIngestor, MarkdownIngestor],
})
export class IngestionModule {}
