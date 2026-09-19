import apiClient from "@/services/apiClient";

export const disponibilidadService = {
  listarGroomers({ fecha, horaInicio, horaFin, excluirTareaId } = {}) {
    const params = new URLSearchParams({
      fecha,
      horaInicio,
      horaFin,
    });

    if (excluirTareaId) {
      params.set("excluirTareaId", excluirTareaId);
    }

    return apiClient.get(`/api/disponibilidad/groomers?${params.toString()}`);
  },
};
