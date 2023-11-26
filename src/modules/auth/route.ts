import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { auth, githubAuth } from "../../lib/lucia";
import env from "../../lib/env";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { AppException } from "../../lib/app-exception";
import { protect } from "./middleware";

const app = new Hono();

app.get("/sign-out", protect(), async (c) => {
  const authReq = auth.handleRequest(c);
  const session = await authReq.validate();
  if (!session) {
    return c.redirect("/sign-in");
  }

  await auth.invalidateSession(session.sessionId);
  authReq.setSession(null);

  return c.redirect("/sign-in");
});

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

app.get("/callback/github", async (c) => {
  try {
    const storedState = getCookie(c, "github_oauth_state");
    const state = c.req.query("state");
    const code = c.req.query("code");

    if (!storedState || !state || storedState !== state || typeof code !== "string") {
      return c.json({ ok: false, error: "Invalid state" });
    }
    const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);

    const getUser = async () => {
      const user = await getExistingUser();
      if (!user) {
        return await createUser({
          attributes: {
            username: githubUser.login,
            email: githubUser.email,
          },
        });
      }

      return user;
    };

    const user = await getUser();

    if (!user) {
      throw new Error("User is somehow not defined or null");
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authReq = auth.handleRequest(c);
    authReq.setSession(session);

    return c.redirect("/projects");
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      throw new AppException(e.message, 400);
    }

    throw e;
  }
});

export { app as auth };
