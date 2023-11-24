import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AppException } from "./lib/app-exception";
import env from "./lib/env";

import { auth } from "./modules/auth";

const app = new Hono();

app.use(logger());
app.use(cors());

app.onError((e, ctx) => {
  if (e instanceof AppException) {
    if (e.status == 500) {
      console.error({ stack: e.stack, cause: e.cause });
    }

    return ctx.json({ ok: false, code: e.status, error: e.message, errors: e?.errors });
  } else {
    return ctx.json({ ok: false, code: 500, error: "Internal Server Error" });
  }
});

app.route("/api/auth", auth);
app.all("/api/*", (_) => {
  throw new AppException("Not Found", 404);
});

export default {
  port: env.port,
  fetch: app.fetch,
};
