import React, { createContext, useState, useContext } from 'react';
import { guardarRegistroAtencion } from '../services/historialService';

const HistorialContext = createContext();

export const HistorialProvider = ({ children }) => {
  const [estaGuardando, setEstaGuardando] = useState(false);

  const registrarAtencion = async (datos, imagenUri) => {
    setEstaGuardando(true);
    try {
      const resultado = await guardarRegistroAtencion(datos, imagenUri);
      return resultado;
    } catch (error) {
      console.error("Error en Contexto al guardar:", error);
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

export const useHistorial = () => useContext(HistorialContext);