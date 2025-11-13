// /lib/validator.ts
import { z, type ZodSchema } from "zod";

export function validateOrLog<T>(
  schema: ZodSchema<T>,
  value: unknown,
  label: string,
  context?: string // <- make optional
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    console.warn(`[validateOrLog] ${label}${context ? ` (${context})` : ""} failed`, parsed.error.flatten());
    // Return a sane fallback if you prefer, but throwing is louder during dev
    throw new Error(`Validation failed for ${label}`);
  }
  return parsed.data;
}