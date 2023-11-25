import { Context } from "hono";

export async function protect<S, T, U>(c: Context<S, T, U>, next) { }
