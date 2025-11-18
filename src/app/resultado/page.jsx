'use client';
// Página de resultados después de responder las preguntas
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useStore from '@/store/useStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import confetti from 'canvas-confetti';

function ResultadoContent() {
  const router = useRouter();
  const { 
    usuario, 
    cuentoActual, 
    progresoActual, 
    limpiarCuento 
  } = useStore();
  
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  
  // Calcular estadísticas
  const totalPreguntas = cuentoActual?.preguntas?.length || 0;
  const respuestasCorrectas = progresoActual?.respuestasCorrectas || 0;
  const respuestasIncorrectas = progresoActual?.respuestasIncorrectas || 0;
  const porcentaje = totalPreguntas > 0 
    ? Math.round((respuestasCorrectas / totalPreguntas) * 100) 
    : 0;
  
  // Tiempo de lectura
  const tiempoInicio = progresoActual?.tiempoInicio;
  const tiempoTotal = tiempoInicio 
    ? Math.round((Date.now() - tiempoInicio) / 1000 / 60) 
    : 0;
  
  // Determinar nivel de logro
  const getNivelLogro = () => {
    if (porcentaje >= 90) return { texto: '¡Excelente!', emoji: '🌟', color: 'from-yellow-400 to-orange-400' };
    if (porcentaje >= 70) return { texto: '¡Muy bien!', emoji: '⭐', color: 'from-blue-400 to-purple-400' };
    if (porcentaje >= 50) return { texto: '¡Buen trabajo!', emoji: '👍', color: 'from-green-400 to-teal-400' };
    return { texto: '¡Sigue practicando!', emoji: '💪', color: 'from-pink-400 to-purple-400' };
  };
  
  const logro = getNivelLogro();
  
  // Efectos al cargar
  useEffect(() => {
    if (!usuario) {
      router.push('/');
      return;
    }
    
    if (!cuentoActual || totalPreguntas === 0) {
      router.push('/');
      return;
    }
    
    // Mostrar animación después de un momento
    setTimeout(() => setMostrarAnimacion(true), 500);
    
    // Confetti si el resultado es bueno
    if (porcentaje >= 70) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 1000);
    }
  }, [usuario, cuentoActual, totalPreguntas, porcentaje, router]);
  
  const handleNuevoCuento = () => {
    limpiarCuento();
    router.push('/');
  };
  
  const handleVerProgreso = () => {
    router.push('/progreso');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header con animación */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">{logro.emoji}</div>
          <h1 className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${logro.color} mb-2`}>
            {logro.texto}
          </h1>
          <p className="text-xl text-gray-600">
            Has completado: <span className="font-bold text-purple-600">{cuentoActual?.titulo}</span>
          </p>
        </motion.div>
        
        {/* Tarjeta de resultados */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: mostrarAnimacion ? 1 : 0, scale: mostrarAnimacion ? 1 : 0.9 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
        >
          {/* Círculo de progreso */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              {/* Círculo de fondo */}
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Círculo de progreso */}
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 552" }}
                  animate={{ 
                    strokeDasharray: mostrarAnimacion 
                      ? `${(porcentaje / 100) * 552} 552` 
                      : "0 552" 
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {/* Gradiente */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Porcentaje en el centro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {porcentaje}%
                  </motion.div>
                  <p className="text-sm text-gray-500 font-medium">Aciertos</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Estadísticas detalladas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Correctas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-green-50 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {respuestasCorrectas}
              </div>
              <p className="text-sm text-gray-600">Correctas</p>
            </motion.div>
            
            {/* Incorrectas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-red-50 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-2">❌</div>
              <div className="text-3xl font-bold text-red-600 mb-1">
                {respuestasIncorrectas}
              </div>
              <p className="text-sm text-gray-600">Incorrectas</p>
            </motion.div>
            
            {/* Tiempo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-purple-50 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {tiempoTotal}
              </div>
              <p className="text-sm text-gray-600">Minutos</p>
            </motion.div>
          </div>
          
          {/* Mensaje motivacional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center mb-8"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              {porcentaje >= 90 && '🎉 ¡Increíble! Tienes una excelente comprensión lectora. ¡Sigue así!'}
              {porcentaje >= 70 && porcentaje < 90 && '⭐ ¡Muy bien hecho! Entendiste muy bien la historia.'}
              {porcentaje >= 50 && porcentaje < 70 && '👍 ¡Buen trabajo! Con un poco más de práctica serás excelente.'}
              {porcentaje < 50 && '💪 ¡No te rindas! La práctica hace al maestro. Intenta otro cuento.'}
            </p>
          </motion.div>
          
          {/* Detalles del cuento */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📖 Detalles del cuento</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Nivel:</span>
                <span className="font-semibold text-gray-700 capitalize">{cuentoActual?.nivel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Tema:</span>
                <span className="font-semibold text-gray-700">{cuentoActual?.tema}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Personajes:</span>
                <span className="font-semibold text-gray-700">
                  {cuentoActual?.personajes?.map(p => p.nombre).join(', ') || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Duración:</span>
                <span className="font-semibold text-gray-700">{cuentoActual?.duracionEstimada} min</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          {/* Leer otro cuento */}
          <button
            onClick={handleNuevoCuento}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Leer otro cuento
          </button>
          
          {/* Ver progreso */}
          <button
            onClick={handleVerProgreso}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-purple-600 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl border-2 border-purple-200 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ver mi progreso
          </button>
        </motion.div>
        
        {/* Mensaje adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            ¿Quieres mejorar? Intenta leer cuentos de diferentes niveles 📚
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Calculando resultados..." />
      </div>
    }>
      <ResultadoContent />
    </Suspense>
  );
}