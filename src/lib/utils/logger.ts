type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, context: string, message: string, data?: unknown) {
  const prefix = `[${level.toUpperCase()}] [${context}]`;
  if (data !== undefined) {
    console[level === "debug" ? "log" : level](`${prefix} ${message}`, data);
  } else {
    console[level === "debug" ? "log" : level](`${prefix} ${message}`);
  }
}

export const logger = {
  info: (ctx: string, msg: string, data?: unknown) => log("info", ctx, msg, data),
  warn: (ctx: string, msg: string, data?: unknown) => log("warn", ctx, msg, data),
  error: (ctx: string, msg: string, data?: unknown) => log("error", ctx, msg, data),
  debug: (ctx: string, msg: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") log("debug", ctx, msg, data);
  },
};
