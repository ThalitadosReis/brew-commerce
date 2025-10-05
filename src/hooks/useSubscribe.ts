"use client";
import { useState } from "react";

type StatusType = "success" | "error" | "loading" | null;

export function useSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusType>(null);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      return;
    }

    // mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
    }
  };

  return {
    email,
    setEmail,
    status,
    subscribe,
  };
}
