'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Cargando...', 
  playSound = false 
}) {
  const audioRef = useRef(null);
  const [etapa, setEtapa] = useState(0);
  
  const etapas = [
    { emoji: '✍️', texto: 'Escribiendo tu cuento mágico...', duracion: 3000 },
    { emoji: '🎨', texto: 'Creando ilustraciones hermosas...', duracion: 10000 },
    { emoji: '✨', texto: '¡Casi listo! Dando toques finales...', duracion: 5000 },
  ];
  
  useEffect(() => {
    // Ciclo de etapas
    const timers = [];
    let tiempoAcumulado = 0;
    
    etapas.forEach((e, index) => {
      timers.push(
        setTimeout(() => {
          setEtapa(index);
        }, tiempoAcumulado)
      );
      tiempoAcumulado += e.duracion;
    });
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);
  
  useEffect(() => {
    // Audio
    if (playSound && typeof window !== 'undefined') {
      audioRef.current = new Audio('/espera.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log('Audio bloqueado por navegador'));
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [playSound]);
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  const emojis = ['✨', '🌟', '💫', '⭐', '🎨', '📚', '🎭', '🦄'];
  
  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-lg mx-auto px-4">
      {/* Círculo giratorio */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`${sizes[size]} relative`}
        >
          <div className="absolute inset-0 rounded-full border-8 border-purple-200"></div>
          <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-purple-600 border-r-pink-600"></div>
        </motion.div>
        
        {/* Emojis flotantes */}
        {emojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl md:text-3xl"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [0, Math.cos(i * Math.PI / 4) * 70, 0],
              y: [0, Math.sin(i * Math.PI / 4) * 70, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        ))}
        
        {/* Emoji central */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {etapas[etapa]?.emoji}
        </motion.div>
      </div>
      
      {/* Texto con etapas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={etapa}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-3">
            {etapas[etapa]?.texto}
          </p>
          
          {/* Indicador de progreso por etapa */}
          <div className="flex justify-center gap-2">
            {etapas.map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= etapa ? 'bg-purple-500' : 'bg-gray-300'
                }`}
                animate={{
                  scale: i === etapa ? [1, 1.3, 1] : 1
                }}
                transition={{
                  duration: 0.6,
                  repeat: i === etapa ? Infinity : 0
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Barra de progreso */}
      <motion.div
        className="w-full max-w-md h-3 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      
      {/* Emojis decorativos */}
      <motion.div
        className="flex gap-3 text-2xl md:text-3xl"
        animate={{
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <span>✨</span>
        <span>📖</span>
        <span>✨</span>
      </motion.div>
      
      {/* Tips mientras espera */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p className="text-xs md:text-sm text-gray-500 italic max-w-xs">
          💡 Tip: Las mejores historias toman su tiempo
        </p>
      </motion.div>
    </div>
  );
}