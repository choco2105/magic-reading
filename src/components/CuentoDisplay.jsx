'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCharacter from './AnimatedCharacter';
import { getAudioManager } from '@/lib/sistema-audio';

export default function CuentoDisplayMejorado({ cuento, onContinuar }) {
  const [parrafoActual, setParrafoActual] = useState(0);
  const [mostrarPersonajes, setMostrarPersonajes] = useState(true);
  const [imagenCargando, setImagenCargando] = useState(true);
  const [errorImagen, setErrorImagen] = useState(false);
  const [narrando, setNarrando] = useState(false);
  const [tamanoTexto, setTamanoTexto] = useState('normal'); // pequeño, normal, grande
  
  const audioManager = useRef(null);
  const parrafos = cuento?.contenido?.split('\n\n').filter(p => p.trim()) || [];
  
  // Inicializar audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioManager.current = getAudioManager();
    }
    
    return () => {
      if (audioManager.current) {
        audioManager.current.narrador.detener();
      }
    };
  }, []);
  
  // Reset cuando cambia el cuento
  useEffect(() => {
    setParrafoActual(0);
    setImagenCargando(true);
    setErrorImagen(false);
    setNarrando(false);
  }, [cuento?.id]);
  
  // Obtener imagen actual
  const getImagenActual = () => {
    if (!cuento?.imagenes || cuento.imagenes.length === 0) return null;
    
    const progreso = (parrafoActual + 1) / parrafos.length;
    
    if (progreso < 0.4) {
      return cuento.imagenes.find(img => img.momento === 'inicio') || cuento.imagenes[0];
    } else if (progreso < 0.8) {
      return cuento.imagenes.find(img => img.momento === 'desarrollo') || cuento.imagenes[1];
    } else {
      return cuento.imagenes.find(img => img.momento === 'final') || cuento.imagenes[2];
    }
  };
  
  const imagenActual = getImagenActual();
  
  // Reset loading cuando cambia la imagen
  useEffect(() => {
    setImagenCargando(true);
    setErrorImagen(false);
  }, [imagenActual?.url, cuento?.id]);
  
  // Navegación
  const siguienteParrafo = () => {
    if (audioManager.current) {
      audioManager.current.efectos.efectoClick();
    }
    
    if (parrafoActual < parrafos.length - 1) {
      setParrafoActual(parrafoActual + 1);
      setNarrando(false);
    } else {
      if (audioManager.current) {
        audioManager.current.efectos.efectoSuccess();
      }
      onContinuar();
    }
  };
  
  const parrafoAnterior = () => {
    if (audioManager.current) {
      audioManager.current.efectos.efectoClick();
    }
    
    if (parrafoActual > 0) {
      setParrafoActual(parrafoActual - 1);
      setNarrando(false);
    }
  };
  
  // Narrar párrafo actual
  const narrarParrafoActual = () => {
    if (!audioManager.current) return;
    
    if (narrando) {
      audioManager.current.narrador.detener();
      setNarrando(false);
    } else {
      setNarrando(true);
      audioManager.current.narrador.narrar(parrafos[parrafoActual], {
        velocidad: 0.85,
        onEnd: () => setNarrando(false),
        onError: () => setNarrando(false)
      });
    }
  };
  
  // Tamaños de texto
  const tamanosTexto = {
    pequeño: 'text-lg md:text-xl',
    normal: 'text-2xl md:text-3xl lg:text-4xl',
    grande: 'text-3xl md:text-4xl lg:text-5xl'
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Partículas mágicas de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-40"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>
      
      {/* Personajes animados */}
      <AnimatePresence>
        {mostrarPersonajes && cuento?.personajes && cuento.personajes.length > 0 && (
          <>
            {cuento.personajes[0] && (
              <AnimatedCharacter personaje={cuento.personajes[0]} posicion="left" delay={0.3} />
            )}
            {cuento.personajes[1] && (
              <AnimatedCharacter personaje={cuento.personajes[1]} posicion="right" delay={0.6} />
            )}
          </>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10">
        {/* Header con título y controles */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          {/* Título */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
            {cuento?.titulo}
          </h1>
          
          {/* Badges y controles */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-sm md:text-base font-semibold">
              📚 {cuento?.nivel}
            </span>
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-sm md:text-base font-semibold">
              ⏱️ {cuento?.duracionEstimada} min
            </span>
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-sm md:text-base font-semibold">
              📖 {parrafoActual + 1}/{parrafos.length}
            </span>
          </div>
          
          {/* Controles de accesibilidad */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Control de tamaño de texto */}
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-3 py-2">
              <button
                onClick={() => setTamanoTexto('pequeño')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  tamanoTexto === 'pequeño' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTamanoTexto('normal')}
                className={`px-2 py-1 rounded text-sm font-bold transition-colors ${
                  tamanoTexto === 'normal' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTamanoTexto('grande')}
                className={`px-2 py-1 rounded text-base font-bold transition-colors ${
                  tamanoTexto === 'grande' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
            </div>
            
            {/* Botón narrar */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={narrarParrafoActual}
              className={`px-4 py-2 rounded-full shadow-lg font-bold transition-all ${
                narrando 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/90 hover:bg-white text-purple-600'
              }`}
            >
              {narrando ? '⏸️ Detener' : '🔊 Narrar'}
            </motion.button>
            
            {/* Toggle personajes */}
            <button
              onClick={() => setMostrarPersonajes(!mostrarPersonajes)}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg font-bold text-sm hover:bg-white transition-all"
            >
              {mostrarPersonajes ? '👁️ Ocultar' : '👁️‍🗨️ Mostrar'}
            </button>
          </div>
        </motion.div>
        
        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Imagen */}
          {imagenActual?.url && (
            <motion.div
              key={`imagen-${cuento?.id}-${imagenActual.momento}-${parrafoActual}`}
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100"
            >
              {/* Loading */}
              {imagenCargando && !errorImagen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative w-24 h-24 mb-4"
                  >
                    <div className="absolute inset-0 border-8 border-purple-200 rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent"></div>
                  </motion.div>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-purple-600 font-bold text-xl"
                  >
                    ✨ Creando ilustración mágica...
                  </motion.p>
                </motion.div>
              )}
              
              {!errorImagen ? (
                <>
                  <motion.img
                    key={`img-${cuento?.id}-${imagenActual.momento}`}
                    src={imagenActual.url}
                    alt={imagenActual.alt || 'Ilustración del cuento'}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imagenCargando ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImagenCargando(false)}
                    onError={() => {
                      setErrorImagen(true);
                      setImagenCargando(false);
                    }}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Badge de fuente */}
                  {!imagenCargando && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold"
                    >
                      🎨 {imagenActual.provider || 'IA'}
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-4"
                  >
                    {imagenActual.momento === 'inicio' && '🌟'}
                    {imagenActual.momento === 'desarrollo' && '✨'}
                    {imagenActual.momento === 'final' && '🎉'}
                  </motion.div>
                  <p className="text-gray-600 font-bold text-2xl text-center">
                    {imagenActual.momento === 'inicio' && '¡Comienza la aventura!'}
                    {imagenActual.momento === 'desarrollo' && '¡Emocionante momento!'}
                    {imagenActual.momento === 'final' && '¡Final feliz!'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Texto */}
          <motion.div 
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 min-h-[400px] relative flex flex-col border-4 border-purple-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Progreso visual */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-t-3xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((parrafoActual + 1) / parrafos.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex-1 flex items-center justify-center py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={parrafoActual}
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-full"
                >
                  <p className={`${tamanosTexto[tamanoTexto]} leading-relaxed text-gray-800 font-medium text-center`}>
                    {parrafos[parrafoActual]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Controles de navegación mejorados */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200 gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={parrafoAnterior}
                disabled={parrafoActual === 0}
                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base md:text-lg shadow-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Anterior</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={siguienteParrafo}
                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold text-base md:text-lg shadow-lg hover:shadow-2xl transition-all"
              >
                {parrafoActual < parrafos.length - 1 ? (
                  <>
                    <span>Siguiente</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>¡A las preguntas!</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}