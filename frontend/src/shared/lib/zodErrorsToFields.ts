import type { ZodError } from "zod";

export function zodErrorsToFields<T extends Record<string, unknown>>(
  error: ZodError,
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  for (const issue of error.issues) {
    fieldErrors[issue.path[0] as keyof T] = issue.message;
  }

  return fieldErrors;
}
