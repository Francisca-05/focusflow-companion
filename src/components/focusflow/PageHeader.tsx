import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function PageHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="px-6 pt-8 pb-4 flex items-center gap-3">
      <button onClick={() => router.history.back()} className="h-10 w-10 rounded-full bg-card shadow-soft flex items-center justify-center active:scale-95 transition-transform">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}