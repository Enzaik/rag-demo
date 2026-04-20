import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  createConversationRequestSchema,
  patchConversationRequestSchema,
  sendMessageRequestSchema,
  type Conversation,
  type ListConversationsResponse,
  type ListMessagesResponse,
  type Message,
} from "@rag/shared";
import { DATABASE, type DbHandle } from "../db/db.module";
import { SessionGuard, type AuthenticatedRequest } from "../auth/session.guard";
import { ConversationsService } from "./conversations.service";

@Controller("conversations")
@UseGuards(SessionGuard)
export class ConversationsController {
  constructor(
    @Inject(DATABASE) private readonly handle: DbHandle,
    private readonly conversations: ConversationsService,
  ) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest): Promise<ListConversationsResponse> {
    const items = await this.conversations.list(this.handle.db, req.user.id);
    return { conversations: items };
  }

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: unknown,
  ): Promise<Conversation> {
    const parsed = createConversationRequestSchema.safeParse(body ?? {});
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());
    return this.conversations.create(this.handle.db, req.user.id, parsed.data.title);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConversation(
    @Req() req: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.conversations.deleteConversation(this.handle.db, req.user.id, id);
  }

  @Patch(":id")
  async patchConversation(
    @Req() req: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: unknown,
  ): Promise<Conversation> {
    const parsed = patchConversationRequestSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());
    return this.conversations.patchConversation(this.handle.db, req.user.id, id, parsed.data);
  }

  @Get(":id/messages")
  async listMessages(
    @Req() req: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<ListMessagesResponse> {
    const items = await this.conversations.listMessages(this.handle.db, req.user.id, id);
    return { messages: items };
  }

  @Post(":id/messages")
  async appendMessage(
    @Req() req: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: unknown,
  ): Promise<Message> {
    const parsed = sendMessageRequestSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());
    return this.conversations.appendMessage(this.handle.db, req.user.id, id, parsed.data);
  }
}
