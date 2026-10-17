import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './AuthContext';
import {
  actualizarEstadoTarea,
  obtenerMisTareas,
} from '../services/tareasService';

const TareasContext = createContext(null);

export function TareasProvider({ children }) {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      setTareas(await obtenerMisTareas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      recargar();
    } else {
      setTareas([]);
      setError(null);
    }
  }, [usuario, recargar]);

  // Lanza el error si el servidor rechaza el cambio; la pantalla lo muestra.
  const cambiarEstado = useCallback(async (tareaId, estado) => {
    const actualizada = await actualizarEstadoTarea(tareaId, estado);
    const nuevoEstado = actualizada?.estado ?? estado;

    setTareas((prev) =>
      prev.map((t) => (t.id === tareaId ? { ...t, estado: nuevoEstado } : t)),
    );
  }, []);

  const value = useMemo(
    () => ({ tareas, cargando, error, recargar, cambiarEstado }),
    [tareas, cargando, error, recargar, cambiarEstado],
  );

  return (
    <TareasContext.Provider value={value}>{children}</TareasContext.Provider>
  );
}

export function useTareas() {
  const ctx = useContext(TareasContext);
  if (!ctx) {
    throw new Error('useTareas debe usarse dentro de TareasProvider');
  }
  return ctx;
}