import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from './AuthContext';
import {
  actualizarEstadoTarea,
  finalizarCita as finalizarCitaApi,
  obtenerMisTareas,
} from '../services/tareasService';
import { sembrarDatosDemo } from '../services/seedTareas';

const TareasContext = createContext(null);

export function TareasProvider({ children }) {
  const { usuario } = useAuth();
  const esGroomer = usuario?.rol === 'groomer' && usuario?.activo === true;
  const usuarioId = esGroomer ? usuario.uid : null;
  const solicitud = useRef(0);
  const [origenId, setOrigenId] = useState(null);
  const [tareasGuardadas, setTareasGuardadas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(null);

  const vista = useMemo(() => {
    const vigentes = origenId !== null && origenId === usuarioId;

    return {
      tareas: vigentes ? tareasGuardadas : [],
      error: vigentes ? errorGuardado : null,
      cargando: Boolean(usuarioId) && (!vigentes || cargando),
    };
  }, [origenId, usuarioId, tareasGuardadas, errorGuardado, cargando]);

  const recargar = useCallback(async () => {
    if (!usuarioId) {
      return;
    }

    const actual = ++solicitud.current;
    const id = usuarioId;

    setCargando(true);
    setErrorGuardado(null);

    try {
      const lista = await obtenerMisTareas(id);

      if (solicitud.current !== actual) {
        return;
      }

      setOrigenId(id);
      setTareasGuardadas(lista);
    } catch (e) {
      if (solicitud.current !== actual) {
        return;
      }

      setOrigenId(id);
      setErrorGuardado(e.message);
    } finally {
      if (solicitud.current === actual) {
        setCargando(false);
      }
    }
  }, [usuarioId]);

  useEffect(() => {
    if (!usuarioId) {
      return undefined;
    }

    const actual = ++solicitud.current;
    const id = usuarioId;

    obtenerMisTareas(id)
      .then((lista) => {
        if (solicitud.current !== actual) {
          return;
        }

        setOrigenId(id);
        setTareasGuardadas(lista);
        setErrorGuardado(null);
        setCargando(false);
      })
      .catch((e) => {
        if (solicitud.current !== actual) {
          return;
        }

        setOrigenId(id);
        setErrorGuardado(e.message);
        setCargando(false);
      });

    return () => {
      if (solicitud.current === actual) {
        solicitud.current += 1;
      }
    };
  }, [usuarioId]);

  // Lanza el error si Firestore rechaza el cambio; la pantalla lo muestra.
  const cambiarEstado = useCallback(
    async (tareaId, estado) => {
      const tarea = tareasGuardadas.find((t) => t.id === tareaId);

      if (!tarea) {
        throw new Error('Tarea no encontrada.');
      }

      const actualizada = await actualizarEstadoTarea(
        tareaId,
        estado,
        tarea.estado,
        usuarioId,
        tarea.citaId,
      );

      setTareasGuardadas((prev) =>
        prev.map((t) => {
          if (t.id === tareaId) {
            return {
              ...t,
              estado: actualizada.estado,
              citaEstado: estado === 'en_proceso' ? 'en_proceso' : t.citaEstado,
            };
          }
          if (estado === 'en_proceso' && t.citaId === tarea.citaId) {
            return { ...t, citaEstado: 'en_proceso' };
          }
          return t;
        }),
      );
    },
    [tareasGuardadas, usuarioId],
  );

  const finalizarCita = useCallback(
    async (citaId, observaciones) => {
      const resultado = await finalizarCitaApi(citaId, observaciones);
      await recargar();
      return resultado;
    },
    [recargar],
  );

  const sembrarDemo = useCallback(async () => {
    if (!usuarioId) {
      return;
    }

    await sembrarDatosDemo(usuarioId);
    await recargar();
  }, [usuarioId, recargar]);

  const value = useMemo(
    () => ({
      tareas: vista.tareas,
      cargando: vista.cargando,
      error: vista.error,
      recargar,
      cambiarEstado,
      finalizarCita,
      sembrarDemo,
    }),
    [vista, recargar, cambiarEstado, finalizarCita, sembrarDemo],
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