import { ReactNode } from "react";

export function MobileFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`min-h-screen w-full flex justify-center ${dark ? "bg-primary-deep" : "bg-background"}`}>
      <div className="w-full max-w-[440px] min-h-screen relative flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold ${light ? "text-white" : "text-foreground"}`}>
      <span>5:10</span>
      <div className={`h-1 w-16 rounded-full ${light ? "bg-white/40" : "bg-foreground/30"}`} />
      <div className="flex items-center gap-1">
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );
}