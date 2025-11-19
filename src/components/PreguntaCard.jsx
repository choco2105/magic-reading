'use client';
// Tarjeta individual para cada pregunta
import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import confetti from 'canvas-confetti';

export default function PreguntaCard({ 
  pregunta, 
  numero, 
  onRespuesta,
  respondida = false 
}) {
  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  
  // Validación: si no hay pregunta, no renderizar
  if (!pregunta || !pregunta.pregunta || !pregunta.opciones) {
    console.error('❌ PreguntaCard: datos de pregunta inválidos', pregunta);
    return (
      <Card padding="lg" className="mb-6">
        <div className="text-center text-red-600">
          <p className="font-bold">Error: No se pudo cargar la pregunta</p>
          <p className="text-sm">Por favor, intenta generar un nuevo cuento</p>
        </div>
      </Card>
    );
  }
  
  const handleSeleccion = (index) => {
    if (respondida || mostrarResultado) return;
    
    setSeleccionada(index);
    setMostrarResultado(true);
    
    // Notificar al componente padre
    const esCorrecta = index === pregunta.respuestaCorrecta;
    
    // Confetti si la respuesta es correcta
    if (esCorrecta) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Esperar 1.5 segundos antes de avanzar
    setTimeout(() => {
      onRespuesta(esCorrecta, index);
    }, 1500);
  };
  
  const getColorOpcion = (index) => {
    if (!mostrarResultado) {
      return seleccionada === index 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50';
    }
    
    // Mostrar resultado
    if (index === pregunta.respuestaCorrecta) {
      return 'border-green-500 bg-green-50';
    }
    
    if (seleccionada === index && index !== pregunta.respuestaCorrecta) {
      return 'border-red-500 bg-red-50';
    }
    
    return 'border-gray-200 bg-gray-50';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card padding="lg" className="mb-6">
        {/* Número de pregunta */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {numero}
          </div>
          <h3 className="text-xl font-bold text-gray-800 flex-1">
            {pregunta.pregunta}
          </h3>
        </div>
        
        {/* Opciones */}
        <div className="space-y-3">
          {pregunta.opciones.map((opcion, index) => (
            <motion.button
              key={index}
              onClick={() => handleSeleccion(index)}
              disabled={respondida || mostrarResultado}
              whileHover={{ scale: mostrarResultado ? 1 : 1.02 }}
              whileTap={{ scale: mostrarResultado ? 1 : 0.98 }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getColorOpcion(index)} disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3">
                {/* Letra de la opción */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  mostrarResultado && index === pregunta.respuestaCorrecta
                    ? 'bg-green-500 text-white'
                    : mostrarResultado && seleccionada === index
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                
                {/* Texto de la opción */}
                <span className="flex-1 text-gray-800">
                  {opcion}
                </span>
                
                {/* Icono de correcto/incorrecto */}
                {mostrarResultado && (
                  <div>
                    {index === pregunta.respuestaCorrecta ? (
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : seleccionada === index ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Explicación (solo si ya respondió) */}
        {mostrarResultado && pregunta.explicacion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
          >
            <p className="text-sm text-blue-800">
              <span className="font-bold">💡 Explicación: </span>
              {pregunta.explicacion}
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}