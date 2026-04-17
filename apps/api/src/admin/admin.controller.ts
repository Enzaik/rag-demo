import { Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { DATABASE, type DbHandle } from "../db/db.module";
import { MarkdownIngestor } from "../ingestion/markdown.ingestor";
import { ProductsIngestor } from "../ingestion/products.ingestor";
import { LocalOnlyGuard } from "./local-only.guard";

@Controller("admin")
@UseGuards(LocalOnlyGuard)
export class AdminController {
  constructor(
    @Inject(DATABASE) private readonly handle: DbHandle,
    private readonly products: ProductsIngestor,
    private readonly markdown: MarkdownIngestor,
  ) {}

  @Post("reindex")
  async reindex() {
    const started = Date.now();
    const [productsResult, markdownResult] = await Promise.all([
      this.products.ingestAll(this.handle.db),
      this.markdown.ingestAll(this.handle.db),
    ]);
    return {
      elapsedMs: Date.now() - started,
      products: productsResult,
      markdown: markdownResult,
    };
  }
}
