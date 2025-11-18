'use client';
// Página de estadísticas y progreso del usuario
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useStore from '@/store/useStore';
import ProgresoChart from '@/components/ProgresoChart';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function ProgresoPage() {
  const router = useRouter();
  const { usuario } = useStore();
  
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState(null);
  const [mostrarModalNivel, setMostrarModalNivel] = useState(false);
  
  useEffect(() => {
    if (!usuario) {
      toast.error('Primero debes registrarte');
      router.push('/');
      return;
    }
    
    cargarProgreso();
  }, [usuario, router]);
  
  const cargarProgreso = async () => {
    try {
      setCargando(true);
      
      const response = await fetch(`/api/obtener-progreso?userId=${usuario.id}&limit=20`);
      
      // Si la respuesta no es OK, crear datos vacíos
      if (!response.ok) {
        console.warn('API de progreso no disponible, mostrando datos vacíos');
        crearDatosVacios();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDatos(data.data);
        
        // Mostrar modal si debe subir de nivel
        if (data.data.evaluacionNivel?.deberiaSubir) {
          setMostrarModalNivel(true);
        }
      } else {
        console.warn('Sin datos de progreso:', data.error);
        crearDatosVacios();
      }
      
    } catch (error) {
      console.error('Error al cargar progreso:', error);
      crearDatosVacios();
      // Solo mostrar un toast, no duplicar
      if (!datos) {
        toast.error('No se pudo cargar el historial. Mostrando datos vacíos.', {
          id: 'error-progreso' // Evita duplicados con el mismo ID
        });
      }
    } finally {
      setCargando(false);
    }
  };
  
  // Crear estructura de datos vacíos
  const crearDatosVacios = () => {
    setDatos({
      progreso: [],
      usuario: usuario,
      evaluacionNivel: { 
        deberiaSubir: false,
        mensaje: '¡Completa algunos cuentos para ver tu progreso!'
      },
      estadisticas: {
        totalCuentos: 0,
        promedioAciertos: 0,
        totalPuntos: 0,
        cuentosCompletados: 0,
        mejorRacha: 0,
      }
    });
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu progreso..." />
      </div>
    );
  }
  
  if (!datos) {
    return null;
  }
  
  // Verificar si el usuario es nuevo (sin cuentos)
  const esUsuarioNuevo = datos.estadisticas.totalCuentos === 0;
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">
                Mi Progreso
              </h1>
              <p className="text-gray-600">
                {esUsuarioNuevo 
                  ? `¡Hola ${usuario.nombre}! Comienza leyendo tu primer cuento 📚`
                  : `¡Sigue así ${usuario.nombre}! 🌟`
                }
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/')}
            >
              Leer nuevo cuento
            </Button>
          </div>
          
          {/* Nivel actual */}
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold">
            Nivel actual: {usuario.nivelActual}
          </div>
        </motion.div>
        
        {/* Mensaje para usuarios nuevos */}
        {esUsuarioNuevo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Tu aventura comienza aquí!
              </h3>
              <p className="text-gray-600 mb-6">
                Lee tu primer cuento para comenzar a acumular puntos y estadísticas
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/')}
              >
                🚀 Leer mi primer cuento
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Gráficos y estadísticas */}
        {!esUsuarioNuevo && (
          <ProgresoChart 
            estadisticas={datos.estadisticas}
            historial={datos.progreso}
          />
        )}
        
        {/* Botón volver */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
      
      {/* Modal de subida de nivel */}
      <Modal
        isOpen={mostrarModalNivel}
        onClose={() => setMostrarModalNivel(false)}
        title="¡Felicitaciones!"
        size="md"
      >
        <div className="text-center py-6">
          <div className="text-7xl mb-6">🎊</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Has mejorado mucho!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            {datos.evaluacionNivel?.mensaje}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                setMostrarModalNivel(false);
                router.push(`/?nivel=${datos.evaluacionNivel.nuevoNivel}`);
              }}
            >
              ¡Subir de nivel!
            </Button>
            <Button
              variant="outline"
              onClick={() => setMostrarModalNivel(false)}
            >
              Seguir en mi nivel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}