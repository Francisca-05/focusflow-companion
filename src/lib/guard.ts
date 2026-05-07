import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "./store";

export function useAuthGuard() {
  const { user } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);
}