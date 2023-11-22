export default {
  port: env({ name: "PORT", defaultValue: 4000 }),
  env: env<"DEV" | "PROD">({ name: "ENV", defaultValue: "PROD" }),
  resendApiKey: env({ name: "RESEND_API_KEY", defaultValue: "", required: true }),
  turso: {
    authToken: env({ name: "TURSO_AUTH_TOKEN", defaultValue: "", required: true }),
    url: env({ name: "TURSO_URL", defaultValue: "", required: true }),
  },
  github: {
    appId: env({ name: "GITHUB_APP_ID", defaultValue: "", required: true }),
    appSecret: env({ name: "GITHUB_APP_PRIVATE_KEY", defaultValue: "", required: true }),
    clientId: env({ name: "GITHUB_APP_CLIENT_ID", defaultValue: "", required: true }),
    clientSecret: env({ name: "GITHUB_APP_CLIENT_SECRET", defaultValue: "", required: true }),
  },
};

type EnvArgs<T> = {
  name: string;
  defaultValue: T;
  required?: boolean;
};
function env<T>(args: EnvArgs<T>): T {
  const { name, defaultValue, required } = args;

  const value = Bun.env[name];
  if (value == null) {
    if (required) {
      throw new Error(`Environment variable "${name}" is required`);
    }

    return defaultValue;
  }

  if (typeof defaultValue === "number") {
    return Number(value) as T;
  } else if (typeof defaultValue === "boolean") {
    const v = value.toLowerCase() == "true";
    return v as T;
  } else {
    return value?.toString() as unknown as T;
  }
}
