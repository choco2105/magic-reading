'use client';
// Hook personalizado para gestionar el usuario
import { useEffect, useState } from 'react';
import { obtenerUsuario, crearUsuario } from '@/lib/db/models';
import useStore from '@/store/useStore';

export function useUser() {
  const { usuario, setUsuario } = useStore();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  // Cargar usuario desde Firebase si existe en el store
  useEffect(() => {
    if (usuario?.id) {
      cargarUsuarioCompleto(usuario.id);
    }
  }, [usuario?.id]);
  
  const cargarUsuarioCompleto = async (userId) => {
    try {
      setCargando(true);
      const resultado = await obtenerUsuario(userId);
      
      if (resultado.success) {
        setUsuario(resultado.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };
  
  const registrarUsuario = async (nombre, edad) => {
    try {
      setCargando(true);
      setError(null);
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await crearUsuario(userId, {
        nombre,
        edad,
        nivelActual: edad <= 8 ? 'basico' : edad <= 10 ? 'intermedio' : 'avanzado',
      });
      
      const resultado = await obtenerUsuario(userId);
      
      if (resultado.success) {
        setUsuario(resultado.data);
        return { success: true, data: resultado.data };
      }
      
      throw new Error('Error al registrar usuario');
      
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };
  
  return {
    usuario,
    cargando,
    error,
    registrarUsuario,
    cargarUsuarioCompleto,
  };
}