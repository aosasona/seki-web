import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { jsxRenderer } from "hono/jsx-renderer";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AppException } from "./lib/app-exception";
import env from "./lib/env";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./database/connection";
import { protect, redirectIfLoggedIn } from "./modules/auth/middleware";

declare module "hono" {
  interface ContextRenderer {
    (content: any, props: { title: string }): Response;
  }
}

const app = new Hono();

if (env.env == "DEV") {
  migrate(db, { migrationsFolder: "./drizzle/migrations" }).catch(console.error);
}

app.use(cors());
app.use("*", logger());

app.onError((e, ctx) => {
  if (e instanceof AppException) {
    if (e.status == 500) {
      console.error({ stack: e.stack, cause: e.cause });
    }

    return ctx.json({ ok: false, code: e.status, error: e.message, errors: e?.errors });
  } else {
    console.error({ stack: e.stack, cause: e.cause });
    return ctx.json({ ok: false, code: 500, error: "Internal Server Error" });
  }
});

// Static files
app.use("/css/*", serveStatic({ root: "./src/assets/" }));
app.use("/images/*", serveStatic({ root: "./src/assets/" }));

// Pages
import SignIn from "./ui/pages/sign-in";

app.get(
  "/*",
  jsxRenderer(({ children, title }) => {
    return <Layout title={title}>{children}</Layout>;
  })
);
app.get("/sign-in", redirectIfLoggedIn, (c) => c.render(<SignIn />, { title: "Sign In" }));
app.get("/projects", protect(), (c) => c.render(<Projects />, { title: "Projects" }));

// API
import { auth } from "./modules/auth/route";
import Projects from "./ui/pages/projects";
import Layout from "./ui/components/layout";

app.route("/api/auth", auth);
app.all("/api/*", (_) => {
  throw new AppException("Not Found", 404);
});

export default app;
