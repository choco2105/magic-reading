'use client';
import { motion } from 'framer-motion';

export default function AnimatedCharacter({ 
  personaje, 
  posicion = 'left', 
  delay = 0
}) {
  if (!personaje) return null;
  
  // GARANTIZAR que siempre sea un emoji bonito
  let emoji = personaje.emoji || '👤';
  
  // Si el emoji no es válido, usar uno por defecto según el tipo
  const emojisDefecto = {
    'protagonista': ['👧', '👦', '🧒', '👶', '🙋‍♀️', '🙋‍♂️'],
    'secundario': ['🐶', '🐱', '🐰', '🦊', '🐼', '🐻'],
    'animal': ['🦁', '🐯', '🐘', '🦒', '🐵', '🐨'],
    'mascota': ['🐶', '🐱', '🐹', '🐰', '🦜', '🐢'],
    'amigo': ['👧', '👦', '🧒', '👶', '🙋‍♀️', '🙋‍♂️']
  };
  
  // Si no hay emoji o no es un emoji válido, asignar uno
  if (!emoji || emoji === '👤' || emoji.length > 4) {
    const tipo = personaje.tipo || 'secundario';
    const opciones = emojisDefecto[tipo] || emojisDefecto['secundario'];
    emoji = opciones[Math.floor(Math.random() * opciones.length)];
  }
  
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
      }
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
      }
    }
  };
  
  const posicionStyles = {
    left: 'left-4 md:left-8',
    right: 'right-4 md:right-8'
  };
  
  return (
    <motion.div
      initial={variants[posicion].initial}
      animate={variants[posicion].animate}
      className={`fixed bottom-8 md:bottom-12 ${posicionStyles[posicion]} z-20 pointer-events-none`}
    >
      <div className="relative">
        {/* Emoji del personaje */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl md:text-8xl lg:text-9xl filter drop-shadow-2xl"
          style={{
            textShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          {emoji}
        </motion.div>
        
        {/* Nombre */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="absolute -top-6 md:-top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-2xl shadow-2xl border-4 border-purple-400">
            <p className="text-xs md:text-base lg:text-lg font-black text-purple-600">
              {personaje.nombre}
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-purple-400"></div>
          </div>
        </motion.div>
        
        {/* Brillo */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl -z-10"
        />
      </div>
    </motion.div>
  );
}