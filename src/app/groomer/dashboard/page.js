import GroomerDashboardContent from "@/components/groomer/GroomerDashboardContent";
import { ServiciosProvider } from "@/context/ServiciosContext";

export default function GroomerDashboardPage() {
  return (
    <ServiciosProvider>
      <GroomerDashboardContent />
    </ServiciosProvider>
  );
}