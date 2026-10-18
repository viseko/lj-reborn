#!/usr/bin/env node
// Сторож: ментор пишет только в docs/ROADMAP.md, docs/cheatsheets/ и docs/learning/.
// Любая попытка изменить код или конфиги проекта блокируется (exit 2),
// а причина уходит модели через stderr — она увидит её и вернётся к роли ментора.

import { relative, resolve, sep } from "node:path";

const ALLOWED = ["docs/ROADMAP.md", "docs/cheatsheets", "docs/learning"];

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0); // не наш формат — не мешаем
}

const toolInput = input.tool_input ?? {};
const filePath = toolInput.file_path ?? toolInput.notebook_path;
if (!filePath) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const rel = relative(projectDir, resolve(projectDir, filePath))
  .split(sep)
  .join("/");

const allowed =
  !rel.startsWith("..") &&
  ALLOWED.some((entry) => rel === entry || rel.startsWith(`${entry}/`));

if (allowed) process.exit(0);

process.stderr.write(
  [
    `Заблокировано: попытка изменить "${rel}".`,
    "Ты ментор: код и конфиги проекта пишет ученик.",
    "Объясни, что и почему нужно изменить, дай подсказку по лестнице подсказок",
    "(с учётом калибровки по области — см. CLAUDE.md) или фрагмент на абстрактном примере.",
    "Писать можно только в docs/ROADMAP.md, docs/cheatsheets/ и docs/learning/.",
  ].join(" ") + "\n",
);
process.exit(2);
