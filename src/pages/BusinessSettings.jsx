import PageHeader from "@/components/layout/PageHeader";
import BusinessRulesForm from "@/components/settings/BusinessRulesForm";
import { useAppContext } from "@/hooks/useAppContext";

export default function BusinessSettings() {
  const { businessRules, updateBusinessRules } = useAppContext();

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Regras que a IA respeita ao agendar automaticamente" />
      <BusinessRulesForm businessRules={businessRules} onSave={updateBusinessRules} />
    </div>
  );
}
