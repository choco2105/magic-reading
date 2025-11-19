'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCharacter from './AnimatedCharacter';
import { getAudioManager, getVoiceNarrator } from '@/lib/audio';

export default function CuentoDisplay({ cuento, onContinuar }) {
  const [parrafoActual, setParrafoActual] = useState(0);
  const [mostrarPersonajes, setMostrarPersonajes] = useState(true);
  const [imagenCargando, setImagenCargando] = useState(true);
  const [errorImagen, setErrorImagen] = useState(false);
  const [narrando, setNarrando] = useState(false);
  const [tamanoTexto, setTamanoTexto] = useState('grande');
  
  const audioManager = useRef(null);
  const narrator = useRef(null);
  
  // EXACTAMENTE 3 párrafos = 3 pantallas
  const parrafos = cuento?.contenido?.split('\n\n').filter(p => p.trim()).slice(0, 3) || [];
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioManager.current = getAudioManager();
      narrator.current = getVoiceNarrator();
    }
    
    return () => {
      if (narrator.current) {
        narrator.current.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    setParrafoActual(0);
    setImagenCargando(true);
    setErrorImagen(false);
    setNarrando(false);
    if (narrator.current) {
      narrator.current.stop();
    }
  }, [cuento?.id]);
  
  // COINCIDENCIA PERFECTA: Imagen según párrafo actual (0, 1, 2)
  const getImagenActual = () => {
    if (!cuento?.imagenes || cuento.imagenes.length === 0) return null;
    
    // Mapeo directo: párrafo 0 = inicio, párrafo 1 = desarrollo, párrafo 2 = final
    const momentos = ['inicio', 'desarrollo', 'final'];
    const momentoActual = momentos[parrafoActual];
    
    return cuento.imagenes.find(img => img.momento === momentoActual) || cuento.imagenes[parrafoActual] || cuento.imagenes[0];
  };
  
  const imagenActual = getImagenActual();
  
  useEffect(() => {
    setImagenCargando(true);
    setErrorImagen(false);
  }, [imagenActual?.url, parrafoActual]); // Recargar cuando cambia imagen O párrafo
  
  const siguienteParrafo = () => {
    if (audioManager.current) {
      audioManager.current.pageTurn();
    }
    
    if (parrafoActual < parrafos.length - 1) {
      setParrafoActual(parrafoActual + 1);
      if (narrator.current) {
        narrator.current.stop();
        setNarrando(false);
      }
    } else {
      if (audioManager.current) {
        audioManager.current.celebration();
      }
      onContinuar();
    }
  };
  
  const parrafoAnterior = () => {
    if (audioManager.current) {
      audioManager.current.click();
    }
    
    if (parrafoActual > 0) {
      setParrafoActual(parrafoActual - 1);
      if (narrator.current) {
        narrator.current.stop();
        setNarrando(false);
      }
    }
  };
  
  const narrarParrafoActual = () => {
    if (!narrator.current) return;
    
    if (narrando) {
      narrator.current.stop();
      setNarrando(false);
    } else {
      if (audioManager.current) {
        audioManager.current.magic();
      }
      setNarrando(true);
      narrator.current.narrate(parrafos[parrafoActual], {
        onEnd: () => setNarrando(false),
        onStart: () => setNarrando(true)
      });
    }
  };
  
  const tamanosTexto = {
    normal: 'text-xl md:text-2xl lg:text-3xl',
    grande: 'text-2xl md:text-3xl lg:text-4xl',
    extragrande: 'text-3xl md:text-4xl lg:text-5xl'
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 overflow-hidden pb-20">
      {/* Partículas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-30"
            animate={{
              x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
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
      
      {/* Personajes - OCULTOS EN MÓVIL */}
      <AnimatePresence>
        {mostrarPersonajes && cuento?.personajes && (
          <div className="hidden lg:block">
            {cuento.personajes[0] && (
              <AnimatedCharacter personaje={cuento.personajes[0]} posicion="left" delay={0.3} />
            )}
            {cuento.personajes[1] && (
              <AnimatedCharacter personaje={cuento.personajes[1]} posicion="right" delay={0.6} />
            )}
          </div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-8"
        >
          {/* Título */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-3 md:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg px-2">
            {cuento?.titulo}
          </h1>
          
          {/* Badges - MOSTRAR PANTALLA ACTUAL */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4 px-2">
            <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-sm md:text-base font-bold">
              📚 {cuento?.nivel}
            </span>
            <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm rounded-full shadow-lg text-sm md:text-base font-bold">
              📖 Pantalla {parrafoActual + 1}/3
            </span>
          </div>
          
          {/* Controles */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-2">
            {/* Tamaño texto */}
            <div className="flex items-center gap-1 bg-white/90 rounded-full shadow-lg px-2 py-1.5 md:px-3 md:py-2">
              <button
                onClick={() => {
                  setTamanoTexto('normal');
                  audioManager.current?.click();
                }}
                className={`px-2 py-1 md:px-3 md:py-2 rounded-full text-sm md:text-base font-bold transition-all ${
                  tamanoTexto === 'normal' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => {
                  setTamanoTexto('grande');
                  audioManager.current?.click();
                }}
                className={`px-2 py-1 md:px-3 md:py-2 rounded-full text-base md:text-lg font-bold transition-all ${
                  tamanoTexto === 'grande' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => {
                  setTamanoTexto('extragrande');
                  audioManager.current?.click();
                }}
                className={`px-2 py-1 md:px-3 md:py-2 rounded-full text-lg md:text-xl font-bold transition-all ${
                  tamanoTexto === 'extragrande' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
            </div>
            
            {/* Narrar */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={narrarParrafoActual}
              className={`px-4 py-2 md:px-5 md:py-3 rounded-full shadow-lg font-bold text-sm md:text-base transition-all ${
                narrando 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-white/90 hover:bg-white text-purple-600'
              }`}
            >
              {narrando ? '⏸️ Detener' : '🔊 Escuchar'}
            </motion.button>
            
            {/* Toggle personajes - SOLO DESKTOP */}
            <button
              onClick={() => {
                setMostrarPersonajes(!mostrarPersonajes);
                audioManager.current?.click();
              }}
              className="hidden lg:block px-4 py-2 md:px-5 md:py-3 bg-white/90 rounded-full shadow-lg font-bold text-sm md:text-base hover:bg-white transition-all"
            >
              {mostrarPersonajes ? '👁️ Ocultar' : '👁️‍🗨️ Mostrar'}
            </button>
          </div>
        </motion.div>
        
        {/* Contenido - STACK EN MÓVIL, GRID EN DESKTOP */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8">
          {/* Imagen - SINCRONIZADA CON PÁRRAFO */}
          {imagenActual?.url && (
            <motion.div
              key={`imagen-${parrafoActual}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative w-full aspect-video md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100"
            >
              {imagenCargando && !errorImagen && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 md:w-24 h-16 md:h-24 border-8 border-purple-600 border-t-transparent rounded-full"
                  />
                  <p className="text-purple-600 font-bold text-lg md:text-xl mt-4">
                    ✨ Cargando ilustración...
                  </p>
                </div>
              )}
              
              {!errorImagen ? (
                <motion.img
                  key={imagenActual.url}
                  src={imagenActual.url}
                  alt={imagenActual.alt}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imagenCargando ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImagenCargando(false)}
                  onError={() => {
                    setErrorImagen(true);
                    setImagenCargando(false);
                  }}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-8">
                  <div className="text-6xl md:text-8xl mb-4">
                    {parrafoActual === 0 && '🌅'}
                    {parrafoActual === 1 && '✨'}
                    {parrafoActual === 2 && '🎉'}
                  </div>
                  <p className="text-gray-600 font-bold text-xl md:text-2xl text-center">
                    {['Inicio', 'Desarrollo', 'Final'][parrafoActual]}
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Texto */}
          <motion.div 
            className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-12 min-h-[300px] md:min-h-[400px] flex flex-col border-4 border-purple-200"
            whileHover={{ scale: 1.02 }}
          >
            {/* Barra progreso */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-t-2xl md:rounded-t-3xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((parrafoActual + 1) / 3) * 100}%` }}
              />
            </div>
            
            <div className="flex-1 flex items-center justify-center py-6 md:py-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={parrafoActual}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className={`${tamanosTexto[tamanoTexto]} leading-relaxed text-gray-800 font-bold text-center`}
                >
                  {parrafos[parrafoActual]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            {/* Controles navegación */}
            <div className="flex justify-between items-center pt-4 md:pt-6 border-t-2 border-gray-200 gap-2 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={parrafoAnterior}
                disabled={parrafoActual === 0}
                className="flex items-center gap-1 md:gap-2 px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 disabled:opacity-40 text-white font-bold text-sm md:text-lg shadow-lg"
              >
                <span className="text-lg md:text-xl">←</span>
                <span className="hidden sm:inline">Anterior</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={siguienteParrafo}
                className="flex items-center gap-1 md:gap-2 px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold text-sm md:text-lg shadow-lg"
              >
                <span>{parrafoActual < 2 ? 'Siguiente' : '¡Preguntas!'}</span>
                <span className="text-lg md:text-xl">{parrafoActual < 2 ? '→' : '🎯'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}