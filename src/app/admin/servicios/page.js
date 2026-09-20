import ServiciosPageContent from "@/components/servicios/ServiciosPageContent";
import { ServiciosProvider } from "@/context/ServiciosContext";

export default function AdminServiciosPage() {
  return (
    <ServiciosProvider>
      <ServiciosPageContent />
    </ServiciosProvider>
  );
}