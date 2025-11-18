'use client';
// Página principal - Registro/Login y selección de nivel
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useStore from '@/store/useStore';
import NivelSelector from '@/components/NivelSelector';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { crearUsuario } from '@/lib/db/models';
import { generarIdUnico, validarEdad, sanitizarNombre, obtenerNivelPorEdad } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const { usuario, setUsuario } = useStore();
  
  const [paso, setPaso] = useState(1); // 1: registro, 2: selección de nivel
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
  });
  const [cargando, setCargando] = useState(false);
  
  // Si ya hay usuario, ir a paso 2
  useEffect(() => {
    if (usuario) {
      setPaso(2);
    }
  }, [usuario]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar nombre
    const nombreLimpio = sanitizarNombre(formData.nombre);
    if (nombreLimpio.length < 2) {
      toast.error('Por favor ingresa un nombre válido');
      return;
    }
    
    // Validar edad
    const validacion = validarEdad(formData.edad);
    if (!validacion.valido) {
      toast.error(validacion.error);
      return;
    }
    
    setCargando(true);
    
    try {
      // Generar ID único para el usuario
      const userId = generarIdUnico();
      const edad = parseInt(formData.edad);
      const nivelRecomendado = obtenerNivelPorEdad(edad);
      
      // Crear usuario en Firebase
      await crearUsuario(userId, {
        nombre: nombreLimpio,
        edad: edad,
        nivelActual: nivelRecomendado,
      });
      
      // Guardar en store
      setUsuario({
        id: userId,
        nombre: nombreLimpio,
        edad: edad,
        nivelActual: nivelRecomendado,
      });
      
      toast.success(`¡Bienvenido ${nombreLimpio}! 🎉`);
      setPaso(2);
      
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error('Hubo un error. Por favor intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };
  
  // Manejar selección de nivel
  const handleNivelSeleccionado = (nivel) => {
    // Actualizar nivel del usuario
    setUsuario({
      ...usuario,
      nivelActual: nivel
    });
    
    // Redirigir a la página del cuento
    router.push(`/cuento?nivel=${nivel}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Decoraciones de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Logo y título */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-4">
          <span className="text-gradient">Magic Reading</span>
        </h1>
        <p className="text-xl text-gray-600">
          ✨ Cuentos mágicos que te enseñan a leer ✨
        </p>
      </motion.div>
      
      {/* Paso 1: Registro */}
      {paso === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ¡Empecemos! 🚀
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cómo te llamas?
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              
              {/* Campo edad */}
              <div>
                <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuántos años tienes?
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  placeholder="Tu edad"
                  min="6"
                  max="12"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              
              {/* Botón enviar */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={cargando}
                className="w-full"
              >
                {cargando ? 'Cargando...' : '¡Comenzar aventura! 🎈'}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
      
      {/* Paso 2: Selección de nivel */}
      {paso === 2 && usuario && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl relative z-10"
        >
          {/* Saludo personalizado */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Hola {usuario.nombre}! 👋
            </h2>
            <p className="text-lg text-gray-600">
              Elige el nivel que más te guste para comenzar
            </p>
          </div>
          
          {/* Selector de nivel */}
          <NivelSelector 
            onSelect={handleNivelSeleccionado}
            nivelActual={usuario.nivelActual}
          />
          
          {/* Botón para ver progreso */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/progreso')}
            >
              Ver mi progreso
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Botón de debug (solo visible en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => {
              if (confirm('¿Limpiar todos los datos guardados?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded shadow-lg"
          >
            🗑️ Limpiar datos
          </button>
        </div>
      )}
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-sm text-gray-500 relative z-10"
      >
        <p>Creado con 💜 para niños curiosos</p>
      </motion.footer>
    </div>
  );
}