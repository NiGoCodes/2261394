export type Stack = "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type Package = "api" | "utils" | "config" | "middleware" | "auth";

export async function log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
) {
  try {
    await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });
  } catch (err) {
    
  }
}
