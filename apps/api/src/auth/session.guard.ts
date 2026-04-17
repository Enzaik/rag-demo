import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { auth } from "./auth";

export interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; name?: string };
  session: { id: string; userId: string };
}

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
      else if (Array.isArray(value)) headers.set(key, value.join(", "));
    }

    const result = await auth.api.getSession({ headers });
    if (!result?.session || !result.user) {
      throw new UnauthorizedException("no active session");
    }

    (req as AuthenticatedRequest).user = result.user as AuthenticatedRequest["user"];
    (req as AuthenticatedRequest).session = result.session as AuthenticatedRequest["session"];
    return true;
  }
}
