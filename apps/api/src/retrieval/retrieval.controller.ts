import { BadRequestException, Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { retrieveRequestSchema, type RetrieveResponse } from "@rag/shared";
import { DATABASE, type DbHandle } from "../db/db.module";
import { SessionGuard } from "../auth/session.guard";
import { RetrievalService } from "./retrieval.service";

@Controller("retrieve")
@UseGuards(SessionGuard)
export class RetrievalController {
  constructor(
    @Inject(DATABASE) private readonly handle: DbHandle,
    private readonly retrieval: RetrievalService,
  ) {}

  @Post()
  async retrieve(@Body() body: unknown): Promise<RetrieveResponse> {
    const parsed = retrieveRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const { query, topK } = parsed.data;
    const chunks = await this.retrieval.retrieve(this.handle.db, query, topK);
    return { chunks };
  }
}
