'use client';
// Componente para mostrar el cuento con animaciones de texto e imágenes
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCharacter from './AnimatedCharacter';
import Image from 'next/image';

export default function CuentoDisplay({ cuento, onContinuar }) {
  const [parrafoActual, setParrafoActual] = useState(0);
  const [mostrarPersonajes, setMostrarPersonajes] = useState(true);
  const [errorImagen, setErrorImagen] = useState(false);
  
  // Dividir el contenido en párrafos
  const parrafos = cuento?.contenido?.split('\n\n').filter(p => p.trim()) || [];
  
  // Determinar qué imagen mostrar según el progreso
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
  
  const siguienteParrafo = () => {
    if (parrafoActual < parrafos.length - 1) {
      setParrafoActual(parrafoActual + 1);
    } else {
      onContinuar();
    }
  };
  
  const parrafoAnterior = () => {
    if (parrafoActual > 0) {
      setParrafoActual(parrafoActual - 1);
    }
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 md:p-8 overflow-hidden">
      {/* Personajes animados */}
      <AnimatePresence>
        {mostrarPersonajes && cuento?.personajes && cuento.personajes.length > 0 && (
          <>
            {cuento.personajes[0] && (
              <AnimatedCharacter 
                personaje={cuento.personajes[0]} 
                posicion="left"
                delay={0.3}
              />
            )}
            {cuento.personajes[1] && (
              <AnimatedCharacter 
                personaje={cuento.personajes[1]} 
                posicion="right"
                delay={0.6}
              />
            )}
          </>
        )}
      </AnimatePresence>
      
      {/* Contenedor principal del cuento */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Título del cuento */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            {cuento?.titulo}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-white rounded-full shadow">
              📚 {cuento?.nivel}
            </span>
            <span className="px-3 py-1 bg-white rounded-full shadow">
              ⏱️ {cuento?.duracionEstimada} min
            </span>
          </div>
        </motion.div>
        
        {/* Layout con imagen y texto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagen del cuento */}
          {imagenActual?.url && (
            <motion.div
              key={`${imagenActual.momento}-${parrafoActual}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100"
            >
              {!errorImagen ? (
                <>
                  <Image
                    src={imagenActual.url}
                    alt={imagenActual.alt || 'Ilustración del cuento'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={() => {
                      console.error('❌ Error al cargar imagen:', imagenActual.url);
                      setErrorImagen(true);
                    }}
                    unoptimized={imagenActual.fuente === 'Placeholder'}
                  />
                  
                  {/* Crédito del autor */}
                  {imagenActual.autor && imagenActual.fuente !== 'Placeholder' && (
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      <a 
                        href={imagenActual.autorUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        📷 {imagenActual.autor}
                      </a>
                      {' '}• {imagenActual.fuente}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-600">Ilustración del cuento</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Contenido del cuento */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 min-h-[400px] relative flex flex-col"
          >
            {/* Indicador de progreso */}
            <div className="absolute top-4 right-4 text-sm text-gray-500 bg-purple-100 px-3 py-1 rounded-full font-semibold">
              {parrafoActual + 1} / {parrafos.length}
            </div>
            
            {/* Párrafo actual con animación */}
            <div className="flex-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={parrafoActual}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none"
                >
                  <p className="text-xl md:text-2xl leading-relaxed text-gray-800">
                    {parrafos[parrafoActual]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Botones de navegación */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={parrafoAnterior}
                disabled={parrafoActual === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              
              <button
                onClick={siguienteParrafo}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all"
              >
                {parrafoActual < parrafos.length - 1 ? (
                  <>
                    Siguiente
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Responder preguntas
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Botón para ocultar/mostrar personajes */}
        <div className="text-center">
          <button
            onClick={() => setMostrarPersonajes(!mostrarPersonajes)}
            className="text-sm text-gray-600 hover:text-gray-800 underline font-medium px-4 py-2 rounded-lg hover:bg-white/50 transition-all"
          >
            {mostrarPersonajes ? '👁️ Ocultar personajes' : '👁️‍🗨️ Mostrar personajes'}
          </button>
        </div>
      </div>
    </div>
  );
}