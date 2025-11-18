'use client';
import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import useStore from '@/store/useStore';
import CuentoDisplay from '@/components/CuentoDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

function CuentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { usuario, cuentoActual, setCuentoActual, iniciarProgreso, limpiarCuento } = useStore();
  
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const generandoRef = useRef(false);
  
  useEffect(() => {
    if (!usuario) {
      toast.error('Primero debes registrarte');
      router.push('/');
      return;
    }
    
    // Validar si el cuento actual es válido
    if (cuentoActual) {
      if (validarCuento(cuentoActual)) {
        setCargando(false);
        return;
      } else {
        console.warn('⚠️ Cuento actual inválido, generando uno nuevo...');
        limpiarCuento();
      }
    }
    
    if (!generandoRef.current) {
      generarNuevoCuento();
    }
  }, [usuario, cuentoActual]);
  
  // Función para validar que un cuento tenga todos los datos necesarios
  const validarCuento = (cuento) => {
    if (!cuento) return false;
    
    const camposRequeridos = ['titulo', 'contenido', 'nivel', 'preguntas'];
    const tieneTodasLasPropiedades = camposRequeridos.every(campo => cuento[campo]);
    
    if (!tieneTodasLasPropiedades) {
      console.error('❌ Cuento falta propiedades:', camposRequeridos.filter(c => !cuento[c]));
      return false;
    }
    
    // Validar que las preguntas sean válidas
    if (!Array.isArray(cuento.preguntas) || cuento.preguntas.length === 0) {
      console.error('❌ Preguntas inválidas');
      return false;
    }
    
    const preguntasValidas = cuento.preguntas.every(p => 
      p && 
      p.pregunta && 
      Array.isArray(p.opciones) && 
      p.opciones.length === 4 &&
      typeof p.respuestaCorrecta === 'number' &&
      p.respuestaCorrecta >= 0 &&
      p.respuestaCorrecta <= 3
    );
    
    if (!preguntasValidas) {
      console.error('❌ Formato de preguntas inválido');
      return false;
    }
    
    return true;
  };
  
  const generarNuevoCuento = async () => {
    if (generandoRef.current) return;
    generandoRef.current = true;
    
    try {
      setCargando(true);
      setError(null);
      
      const nivel = searchParams.get('nivel') || usuario?.nivelActual || 'basico';
      const tema = searchParams.get('tema') || null;
      
      // Mostrar toast de inicio
      toast.loading('Generando tu cuento mágico...', { id: 'generando-cuento' });
      
      const response = await fetch('/api/generar-cuento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nivel,
          tema,
          userId: usuario.id,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al generar cuento');
      }
      
      if (!validarCuento(data.data)) {
        throw new Error('El cuento generado no tiene el formato correcto');
      }
      
      setCuentoActual(data.data);
      iniciarProgreso();
      
      toast.success('¡Cuento listo! 📖✨', { id: 'generando-cuento' });
      
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error.message);
      toast.error('No se pudo generar el cuento', { id: 'generando-cuento' });
      generandoRef.current = false;
    } finally {
      setCargando(false);
    }
  };
  
  const handleContinuar = () => {
    router.push('/preguntas');
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Generando tu cuento mágico..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ups, algo salió mal
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              generandoRef.current = false;
              generarNuevoCuento();
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }
  
  if (!cuentoActual) {
    return null;
  }
  
  return <CuentoDisplay cuento={cuentoActual} onContinuar={handleContinuar} />;
}

export default function CuentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    }>
      <CuentoContent />
    </Suspense>
  );
}