// "Почтальон" для отправки писем

import fp from "fastify-plugin";
import nodemailer from "nodemailer";

import { env } from "../env.js";

const host = env.SMTP_HOST;
const port = env.SMTP_PORT;
const from = env.MAIL_FROM;

type MailToSend = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type Postman = {
  send: (mail: MailToSend) => Promise<void>;
};

export default fp(async (fastify) => {
  let postman: Postman;

  if (host && env.NODE_ENV !== "test") {
    const transport = nodemailer.createTransport({ host, port });

    postman = {
      send: async (mail) => {
        await transport.sendMail({
          from,
          ...mail,
        });
      },
    };

    fastify.addHook("onClose", async () => {
      transport.close();
    });
  } else {
    postman = {
      send: async (mail) => {
        fastify.log.info(mail, "Mail (SMTP_HOST not set, not sent)");
      },
    };
  }

  fastify.decorate("postman", postman);
});
