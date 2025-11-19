'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import confetti from 'canvas-confetti';
import { getAudioManager } from '@/lib/audio';

export default function PreguntaCard({ 
  pregunta, 
  numero, 
  onRespuesta,
  respondida = false 
}) {
  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const audioManager = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioManager.current = getAudioManager();
    }
  }, []);
  
  if (!pregunta || !pregunta.pregunta || !pregunta.opciones) {
    return (
      <Card padding="lg" className="mb-6">
        <div className="text-center text-red-600">
          <p className="font-bold text-xl">❌ Error al cargar pregunta</p>
        </div>
      </Card>
    );
  }
  
  const handleSeleccion = (index) => {
    if (respondida || mostrarResultado) return;
    
    setSeleccionada(index);
    setMostrarResultado(true);
    
    const esCorrecta = index === pregunta.respuestaCorrecta;
    
    // Sonidos
    if (audioManager.current) {
      if (esCorrecta) {
        audioManager.current.success();
      } else {
        audioManager.current.error();
      }
    }
    
    // Confetti si es correcta
    if (esCorrecta) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#ec4899', '#3b82f6', '#10b981']
      });
    }
    
    setTimeout(() => {
      onRespuesta(esCorrecta, index);
    }, 1500);
  };
  
  const getColorOpcion = (index) => {
    if (!mostrarResultado) {
      return seleccionada === index 
        ? 'border-purple-500 bg-purple-50 scale-105' 
        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:scale-105';
    }
    
    if (index === pregunta.respuestaCorrecta) {
      return 'border-green-500 bg-green-50 scale-105';
    }
    
    if (seleccionada === index) {
      return 'border-red-500 bg-red-50 scale-105';
    }
    
    return 'border-gray-200 bg-gray-50';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card padding="lg" className="mb-6 shadow-2xl">
        {/* Número de pregunta */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {numero}
          </motion.div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-800 flex-1">
            {pregunta.pregunta}
          </h3>
        </div>
        
        {/* Opciones */}
        <div className="space-y-4">
          {pregunta.opciones.map((opcion, index) => (
            <motion.button
              key={index}
              onClick={() => handleSeleccion(index)}
              disabled={respondida || mostrarResultado}
              whileHover={{ scale: mostrarResultado ? 1 : 1.02 }}
              whileTap={{ scale: mostrarResultado ? 1 : 0.98 }}
              className={`w-full text-left p-5 md:p-6 rounded-2xl border-4 transition-all ${getColorOpcion(index)} disabled:cursor-not-allowed shadow-lg`}
            >
              <div className="flex items-center gap-4">
                {/* Letra */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                  mostrarResultado && index === pregunta.respuestaCorrecta
                    ? 'bg-green-500 text-white'
                    : mostrarResultado && seleccionada === index
                    ? 'bg-red-500 text-white'
                    : 'bg-purple-200 text-purple-700'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                
                {/* Texto */}
                <span className="flex-1 text-lg md:text-xl font-bold text-gray-800">
                  {opcion}
                </span>
                
                {/* Icono */}
                {mostrarResultado && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {index === pregunta.respuestaCorrecta ? (
                      <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : seleccionada === index ? (
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Explicación */}
        {mostrarResultado && pregunta.explicacion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg"
          >
            <p className="text-base md:text-lg text-blue-800 font-semibold">
              <span className="font-black">💡 Explicación:</span> {pregunta.explicacion}
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}