import { Outlet } from "react-router-dom";
import { Music } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAppContext } from "@/hooks/useAppContext";

function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-paper text-ink">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-gold text-pine-dark">
          <Music className="h-5 w-5" />
        </span>
        <p className="font-mono text-sm text-ink/50">Carregando dados do Supabase…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-paper text-ink">
      <div className="max-w-md rounded-xl border border-rose/30 bg-card p-6 text-center shadow-soft">
        <p className="font-display text-lg font-semibold text-rose">Não foi possível carregar os dados</p>
        <p className="mt-2 text-sm text-ink/60">{error?.message ?? "Verifique a conexão com o Supabase e tente novamente."}</p>
      </div>
    </div>
  );
}

export default function AppShell() {
  const { loading, error } = useAppContext();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper text-ink">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
