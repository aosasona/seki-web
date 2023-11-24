import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { githubAuth } from "../../lib/lucia";
import env from "../../lib/env";

const app = new Hono();

app.get("/sign-in/github", async (c) => {
  const [url, state] = await githubAuth.getAuthorizationUrl();
  setCookie(c, "github_oauth_state", state, {
    httpOnly: true,
    secure: env.env == "PROD",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });

  return c.redirect(url.toString());
});

app.get("/callback/github", (c) => {
  return c.json({ ok: true });
});

export { app as auth };
