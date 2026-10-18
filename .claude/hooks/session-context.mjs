#!/usr/bin/env node
// В начале каждой сессии подкладывает ментору текущий пункт роадмапа
// и последнюю запись журнала, чтобы не начинать с нуля.
// stdout хука SessionStart добавляется в контекст модели.

import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const read = (p) => readFile(join(root, p), "utf8").catch(() => "");

const roadmap = await read("docs/ROADMAP.md");
const journal = await read("docs/learning/journal.md");

const next = roadmap
  .split("\n")
  .find((line) => /^\s*- \[ \]/.test(line))
  ?.replace(/^\s*- \[ \]\s*/, "")
  .trim();

const lastSession = journal
  .split(/\n(?=### )/)
  .pop()
  ?.trim();

const out = ["## Контекст учебной сессии"];
out.push(
  next
    ? `Текущий пункт роадмапа: **${next}**`
    : "Все пункты роадмапа отмечены — предложи следующий модуль.",
);
if (lastSession?.startsWith("### "))
  out.push("Последняя сессия из журнала:", lastSession);
out.push(
  "Начни с короткого вопроса: продолжаем этот пункт или есть что-то другое?",
);

process.stdout.write(out.join("\n\n") + "\n");
