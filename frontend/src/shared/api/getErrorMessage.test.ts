import { describe, expect, it } from "vitest";

import { ApiError } from "./clients";
import {
  API_ERRORS_MESSAGES,
  ERROR_MESSAGES,
  getErrorMessage,
} from "./getErrorMessage";

describe("getErrorMessage", () => {
  it("returns network message for non-API errors", () => {
    expect(getErrorMessage(new Error("unknown"))).toBe(ERROR_MESSAGES.NETWORK);
  });

  it("returns translated message for known error code", () => {
    expect(
      getErrorMessage(
        new ApiError("INVALID_CREDENTIALS", "Invalid login or password", 401),
      ),
    ).toBe(API_ERRORS_MESSAGES["INVALID_CREDENTIALS"]);
  });

  it("returns generic message for unknown error code", () => {
    expect(getErrorMessage(new ApiError("SOMETHING_NEW", "Message", 500))).toBe(
      ERROR_MESSAGES.UNKNOWN,
    );
  });

  it("does not treat inherited object keys as known codes", () => {
    expect(getErrorMessage(new ApiError("constructor", "Message", 400))).toBe(
      ERROR_MESSAGES.UNKNOWN,
    );
  });
});
