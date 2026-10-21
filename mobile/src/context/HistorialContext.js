import React, { createContext, useState, useContext } from 'react';
import { finalizarCita } from '../services/historialService';

const HistorialContext = createContext(null);

export const HistorialProvider = ({ children }) => {
  const [estaGuardando, setEstaGuardando] = useState(false);

  const registrarAtencion = async (citaId, observaciones) => {
    setEstaGuardando(true);

    try {
      await finalizarCita(citaId, observaciones);
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    } finally {
      setEstaGuardando(false);
    }
  };

  return (
    <HistorialContext.Provider value={{ registrarAtencion, estaGuardando }}>
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
