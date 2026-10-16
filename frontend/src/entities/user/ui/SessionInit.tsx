"use client";

import { useEffect } from "react";
import { useUserStore } from "@/entities/user";

export const SessionInit = () => {
  const fetchMe = useUserStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return null;
};
