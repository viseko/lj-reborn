"use client";
// Отметка на завершение гидрации
// Нужно для корректного ожидания в e2e-тестах

import { useEffect } from "react";

export const HydrationMarker = () => {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return null;
};
