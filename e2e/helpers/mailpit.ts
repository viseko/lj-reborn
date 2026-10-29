import { type APIRequestContext, expect } from "@playwright/test";

import { MAILPIT_URL } from "./env.js";

type MailData = {
  messages: { ID: string }[];
};

export async function getResetLink(request: APIRequestContext, email: string) {
  const response = await request.get(`${MAILPIT_URL}/api/v1/search`, {
    params: {
      query: `to:"${email}"`,
    },
  });

  expect(response.ok()).toBeTruthy();

  const json = (await response.json()) as MailData;
  const message = json.messages[0];

  if (!message) {
    throw new Error(`No email found for ${email}`);
  }

  const msgResponse = await request.get(
    `${MAILPIT_URL}/api/v1/message/${message.ID}`,
  );

  expect(msgResponse.ok()).toBeTruthy();

  const msgData = (await msgResponse.json()) as { Text: string };

  const link = msgData.Text.match(
    /https?:\/\/[^\s]+\/reset-password\?token=\w+/,
  )?.[0];

  if (!link) {
    throw new Error(`No reset link found for ${email}`);
  }

  return link;
}
