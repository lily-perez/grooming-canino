import React, { createContext, useCallback, useContext, useState } from 'react';

import {
  finalizarCita,
  obtenerHistorial as obtenerHistorialFirestore,
  registrarAtencion as guardarHistorialFirestore,
} from '../services/historialService';

const HistorialContext = createContext(null);

export const HistorialProvider = ({ children }) => {
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const registrarAtencion = async (citaId, datosAtencion) => {
    setEstaGuardando(true);

    try {
      const registroGuardado = await guardarHistorialFirestore({
        ...datosAtencion,
        citaId: datosAtencion?.citaId ?? citaId,
      });

      if (typeof finalizarCita === 'function' && citaId) {
        await finalizarCita(citaId, datosAtencion?.observaciones ?? '');
      }

      return { exito: true, data: registroGuardado };
    } catch (error) {
      console.error('Error en registrarAtencion Context:', error);
      return { exito: false, error: error.message };
    } finally {
      setEstaGuardando(false);
    }
  };

  const cargarHistorial = useCallback(async (groomerId = null) => {
    setCargandoHistorial(true);

    try {
      const data = await obtenerHistorialFirestore(groomerId);
      setHistorial(data);
    } catch (error) {
      console.error('Error cargando el historial:', error);
    } finally {
      setCargandoHistorial(false);
    }
  }, []);

  return (
    <HistorialContext.Provider
      value={{
        registrarAtencion,
        estaGuardando,
        historial,
        cargandoHistorial,
        cargarHistorial,
      }}
    >
      {children}
    </HistorialContext.Provider>
  );
};

export const useHistorial = () => {
  const ctx = useContext(HistorialContext);

  if (!ctx) {
    throw new Error('useHistorial debe usarse dentro de HistorialProvider');
  }

  return ctx;
};