import { ReactNode } from "react";

export function MobileFrame({
  children,
  variant = "soft",
}: {
  children: ReactNode;
  variant?: "soft" | "purple" | "plain";
}) {
  const bg =
    variant === "purple"
      ? "bg-gradient-purple"
      : variant === "plain"
      ? "bg-background"
      : "bg-gradient-purple-soft";
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-primary-deep/5">
      <div className={`w-full sm:max-w-[440px] min-h-[100dvh] relative flex flex-col ${bg} sm:my-4 sm:rounded-[2.5rem] sm:shadow-2xl sm:overflow-hidden sm:min-h-[calc(100dvh-2rem)]`}>
        {children}
      </div>
    </div>
  );
}