import { lucia } from "lucia";
import { hono } from "lucia/middleware";
import env from "./env";
import { libsqlClient } from "../database/connection";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { github } from "@lucia-auth/oauth/providers";

export const auth = lucia({
  env: env.env,
  middleware: hono(),
  adapter: libsql(libsqlClient, { user: "users", session: "user_sessions", key: "user_keys" }),
});

export const githubAuth = github(auth, {
  clientId: env.github.clientId,
  clientSecret: env.github.clientSecret,
});

export type Auth = typeof auth;
