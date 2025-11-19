'use client';
// Componente para mostrar personajes animados (versión mejorada con emojis)
import { motion } from 'framer-motion';

export default function AnimatedCharacter({ 
  personaje, 
  posicion = 'left', 
  delay = 0
}) {
  // Mapeo de tipos de personajes a emojis
  const emojisPorTipo = {
    'protagonista': ['🧒', '👧', '🧑', '👦', '🙋‍♀️', '🙋‍♂️'],
    'secundario': ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼'],
    'animal': ['🦁', '🐯', '🐘', '🦒', '🐵', '🐨'],
    'maestro': ['👨‍🏫', '👩‍🏫', '🧙‍♂️', '🧙‍♀️', '👴', '👵'],
    'robot': ['🤖', '🦾', '🦿', '⚙️', '🔧', '🛸'],
    'astronauta': ['👨‍🚀', '👩‍🚀', '🚀', '🛰️', '🌟', '✨'],
    'default': ['😊', '🌟', '✨', '🎭', '🎨', '📚']
  };
  
  // Seleccionar emoji según tipo o nombre del personaje
  const tipo = personaje?.tipo || 'default';
  
  // Si el nombre contiene palabras clave, usar emoji específico
  let emojiSeleccionado;
  const nombreLower = (personaje?.nombre || '').toLowerCase();
  
  if (nombreLower.includes('luna') || nombreLower.includes('astronauta')) {
    emojiSeleccionado = '👩‍🚀';
  } else if (nombreLower.includes('cosmo') || nombreLower.includes('robot')) {
    emojiSeleccionado = '🤖';
  } else {
    const emojisDisponibles = emojisPorTipo[tipo] || emojisPorTipo.default;
    emojiSeleccionado = emojisDisponibles[Math.floor(Math.random() * emojisDisponibles.length)];
  }
  
  // Variantes de animación según posición
  const variants = {
    left: {
      initial: { x: -300, opacity: 0, rotate: -20 },
      animate: { 
        x: 0, 
        opacity: 1, 
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 15,
          delay
        }
      },
      exit: { x: -300, opacity: 0, rotate: -20 }
    },
    right: {
      initial: { x: 300, opacity: 0, rotate: 20 },
      animate: { 
        x: 0, 
        opacity: 1, 
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 15,
          delay
        }
      },
      exit: { x: 300, opacity: 0, rotate: 20 }
    }
  };
  
  const posicionStyles = {
    left: 'left-2 md:left-8',
    right: 'right-2 md:right-8'
  };
  
  return (
    <motion.div
      initial={variants[posicion].initial}
      animate={variants[posicion].animate}
      exit={variants[posicion].exit}
      className={`fixed bottom-4 md:bottom-8 ${posicionStyles[posicion]} z-20`}
      style={{ pointerEvents: 'none' }} // No bloquear clicks
    >
      <div className="relative">
        {/* Personaje emoji con animación de rebote */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 8, 0, -8, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-7xl md:text-9xl filter drop-shadow-2xl"
          style={{
            textShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          {emojiSeleccionado}
        </motion.div>
        
        {/* Nombre del personaje con diseño mejorado */}
        {personaje?.nombre && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: delay + 0.3, type: "spring" }}
            className="absolute -top-8 md:-top-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="relative">
              {/* Burbuja de diálogo */}
              <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-2xl border-4 border-purple-400 relative">
                <p className="text-xs md:text-lg font-black text-purple-600 whitespace-nowrap">
                  {personaje.nombre}
                </p>
                {/* Pico de la burbuja */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-400"></div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Efecto de brillo detrás */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl -z-10"
        />
      </div>
    </motion.div>
  );
}