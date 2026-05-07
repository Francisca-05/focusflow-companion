import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "./index";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "FocusFlow — Home" }] }),
  component: () => {
    useAuthGuard();
    return <HomeScreen />;
  },
});