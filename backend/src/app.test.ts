import { describe, it, expect } from "vitest";
import { buildApp } from "./app.js";

type TestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function doResponse(url: string, method: TestMethod = "GET") {
  const app = buildApp();
  const response = await app.inject({
    method,
    url,
  });

  return response;
}

describe("health route", () => {
  it("returns ok status", async () => {
    const response = await doResponse("/health");

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ status: "ok" });
  });
});

describe("not found", () => {
  it("returns 404", async () => {
    const response = await doResponse("/nonexsisturl");

    expect(JSON.parse(response.body).error.code).toBe("NOT_FOUND");
  });
});
