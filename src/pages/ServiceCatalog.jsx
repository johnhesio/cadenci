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

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(service) {
    setEditing(service);
    setDialogOpen(true);
  }

  function handleSubmit(data) {
    if (editing) {
      updateService(editing.id, data);
    } else {
      addService(data);
    }
    setDialogOpen(false);
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

      <ServiceTable services={services} onEdit={openEdit} onDelete={deleteService} />

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
