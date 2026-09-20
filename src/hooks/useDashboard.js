"use client";

import { useCallback, useEffect, useState } from "react";
import { dashboardRepository } from "@/repositories/dashboardRepository";

export function useDashboard(periodoInicial = "mes") {
  const [periodo, setPeriodo] = useState(periodoInicial);
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async (periodoConsultado = periodo) => {
    setCargando(true);
    setError(null);

    try {
      const resumen = await dashboardRepository.obtenerResumen(periodoConsultado);
      setData(resumen);
      return resumen;
    } catch (errorPeticion) {
      setError(errorPeticion);
      setData(null);
      throw errorPeticion;
    } finally {
      setCargando(false);
    }
  }, [periodo]);

  useEffect(() => {
    let activo = true;

    dashboardRepository
      .obtenerResumen(periodo)
      .then((resumen) => {
        if (activo) {
          setData(resumen);
          setError(null);
        }
      })
      .catch((errorPeticion) => {
        if (activo) {
          setError(errorPeticion);
          setData(null);
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [periodo]);

  const cambiarPeriodo = useCallback((siguientePeriodo) => {
    setPeriodo(siguientePeriodo);
    setCargando(true);
    setError(null);
  }, []);

  return {
    data,
    cargando,
    error,
    periodo,
    cambiarPeriodo,
    recargar,
  };
}
