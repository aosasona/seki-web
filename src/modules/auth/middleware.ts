import { createMiddleware } from "hono/factory";
import { auth } from "../../lib/lucia";
import { AppException } from "../../lib/app-exception";

type ProtectOpts = {
  // Allow API keys to be used for authentication on current route
  allowApiKeys?: boolean;

  // Permissions required to access current route
  permissions?: number;

  // Redirect to this path if user is not logged in
  redirectIfNotLoggedIn?: string;
};

// TODO: add support for API keys (find user, validate permissions, etc)
export function protect(opts: ProtectOpts = { redirectIfNotLoggedIn: "/sign-in" }) {
  return createMiddleware(async (c, next) => {
    const authReq = auth.handleRequest(c);
    const session = await authReq.validate();

    // If the user is not logged in, redirect to the login page or return 401 for API routes
    if (!session || !session.user) {
      const isApiRoute = c.req.path?.startsWith("/api");
      if (isApiRoute) {
        throw new AppException("Unauthorized", 401);
      }

      return c.redirect(opts.redirectIfNotLoggedIn || "/sign-in");
    }

    await next();
  });
}

export const redirectIfLoggedIn = createMiddleware(async (c, next) => {
  const authReq = auth.handleRequest(c);
  const session = await authReq.validate();
  if (!session || !session.user) {
    await next();
    return;
  }

  // If the user is logged in, redirect to the projects page
  if (c.req.path === "/sign-in" && session != null && session.user != null) {
    return c.redirect("/projects");
  }

  await next();
});
