import app from "./app";
import env from "./lib/env";

export default {
  port: env.port,
  fetch: app.fetch,
};
