import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";

const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

@Injectable()
export class LocalOnlyGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const ip = req.ip ?? req.socket?.remoteAddress ?? "";
    if (!LOOPBACK.has(ip)) {
      throw new ForbiddenException("admin endpoints are local-only");
    }
    return true;
  }
}
