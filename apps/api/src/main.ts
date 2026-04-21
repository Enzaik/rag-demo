import "reflect-metadata";
import "./load-env";

import { NestFactory } from "@nestjs/core";
import express from "express";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { AppModule } from "./app.module";
import { auth } from "./auth/auth";

async function bootstrap() {
  // Disable the default body parser so better-auth can read the raw request
  // stream on `/api/auth/*`. We re-enable JSON parsing for every other route.
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // app.use(cookieParser());

  const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  // better-auth handler must be mounted BEFORE express.json() — the handler
  // consumes the request stream directly.
  app.use("/api/auth", toNodeHandler(auth));

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`api listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
