import env from "../lib/env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const libsqlClient = createClient({ url: env.turso.url, authToken: env.turso.authToken });
export const db = drizzle(libsqlClient);
