import pino from "pino";
import type { Env } from "../config/env.js";

export function createLogger(level: Env["LOG_LEVEL"]) {
  return pino({ level });
}

export type Logger = ReturnType<typeof createLogger>;
