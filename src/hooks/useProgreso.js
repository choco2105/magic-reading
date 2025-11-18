'use client';
// Hook personalizado para gestionar el progreso
import { useState, useEffect } from 'react';
import { obtenerProgreso, guardarProgreso } from '@/lib/db/models';
import useStore from '@/store/useStore';

export function useProgreso() {
  const { usuario } = useStore();
  const [progreso, setProgreso] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (usuario?.id) {
      cargarProgreso();
    }
  }, [usuario?.id]);
  
  const cargarProgreso = async (limite = 10) => {
    try {
      setCargando(true);
      setError(null);
      
      const resultado = await obtenerProgreso(usuario.id, limite);
      
      if (resultado.success) {
        setProgreso(resultado.data);
      } else {
        throw new Error(resultado.error);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };
  
  const guardarNuevoProgreso = async (progresoData) => {
    try {
      setCargando(true);
      setError(null);
      
      const resultado = await guardarProgreso(usuario.id, progresoData);
      
      if (resultado.success) {
        // Recargar progreso actualizado
        await cargarProgreso();
        return { success: true, progresoId: resultado.progresoId };
      }
      
      throw new Error('Error al guardar progreso');
      
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };
  
  return {
    progreso,
    cargando,
    error,
    cargarProgreso,
    guardarNuevoProgreso,
  };
}