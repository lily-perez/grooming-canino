import ServiciosPageContent from "@/components/servicios/ServiciosPageContent";
import { ServiciosProvider } from "@/context/ServiciosContext";

export default function GroomerServiciosPage() {
  return (
    <ServiciosProvider>
      <ServiciosPageContent />
    </ServiciosProvider>
  );
}