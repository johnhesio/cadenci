import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import ClientTable from "@/components/crm/ClientTable";
import { useClients } from "@/hooks/useClients";

export default function CRM() {
  const { clients } = useClients();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.whatsapp.replace(/\D/g, "").includes(q.replace(/\D/g, "")),
    );
  }, [clients, query]);

  return (
    <div>
      <PageHeader
        title="CRM"
        subtitle={`${clients.length} clientes cadastrados`}
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou WhatsApp"
              className="w-72 pl-9"
            />
          </div>
        }
      />
      <ClientTable clients={filtered} />
    </div>
  );
}
