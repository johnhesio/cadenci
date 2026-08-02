import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceTable from "@/components/catalog/ServiceTable";
import ServiceForm from "@/components/catalog/ServiceForm";
import { useServices } from "@/hooks/useServices";

export default function ServiceCatalog() {
  const { services, addService, updateService, deleteService } = useServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(service) {
    setEditing(service);
    setDialogOpen(true);
  }

  async function handleSubmit(data) {
    setErrorMessage("");
    try {
      if (editing) {
        await updateService(editing.id, data);
      } else {
        await addService(data);
      }
      setDialogOpen(false);
    } catch {
      setErrorMessage("Não foi possível salvar o serviço. Tente novamente.");
    }
  }

  async function handleDelete(id) {
    setErrorMessage("");
    try {
      await deleteService(id);
    } catch {
      setErrorMessage("Não foi possível excluir: existem agendamentos vinculados a este serviço.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Catálogo de serviços"
        subtitle="Duração, respiro entre atendimentos e valores"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Novo serviço
          </Button>
        }
      />

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-rose/30 bg-rose/10 px-4 py-2.5 text-sm text-rose">
          {errorMessage}
        </div>
      )}

      <ServiceTable services={services} onEdit={openEdit} onDelete={handleDelete} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar serviço" : "Novo serviço"}</DialogTitle>
          </DialogHeader>
          <ServiceForm
            key={editing?.id ?? "new"}
            defaultValues={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
