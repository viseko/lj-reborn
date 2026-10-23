import { ApiError } from "./clients";

export const ERROR_MESSAGES = {
  NETWORK: "Нет связи с сервером",
  UNKNOWN: "Что-то пошло не так. Повторите попытку",
};

// Тексты для кодов ошибок бэка
export const API_ERRORS_MESSAGES = {
  INVALID_CREDENTIALS: "Неверный логин или пароль",
  CONFLICT: "Пользователь с таким логином или e-mail уже существует",
  INVALID_TOKEN:
    "Ссылка для сброса пароля устарела или уже использована. Запросите новую",
  VALIDATION_ERROR: "Проверьте правильность заполнения полей",
  INTERNAL_ERROR: "На сервере что-то сломалось. Попробуйте ещё раз чуть позже",
};

type KnownErrorCode = keyof typeof API_ERRORS_MESSAGES;

function isKnownErrorCode(code: string): code is KnownErrorCode {
  return Object.hasOwn(API_ERRORS_MESSAGES, code);
}

// Превращает любую пойманную ошибку в текст для юзера
export function getErrorMessage(err: unknown): string {
  // fetch упал до ответа сервера (бэк выключен, нет сети)
  if (!(err instanceof ApiError)) {
    return ERROR_MESSAGES.NETWORK;
  }

  if (isKnownErrorCode(err.code)) {
    return API_ERRORS_MESSAGES[err.code];
  }

  return ERROR_MESSAGES.UNKNOWN;
}
