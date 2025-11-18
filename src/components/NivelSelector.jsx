'use client';
// Selector de nivel educativo con animaciones
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Card from './ui/Card';
import useStore from '@/store/useStore';
import { obtenerEmojiNivel } from '@/lib/utils';

export default function NivelSelector({ onSelect, nivelActual }) {
  const router = useRouter();
  const store = useStore();
  
  const handleGenerarCuento = (nivelId) => {
    // Limpiar cuento anterior antes de navegar
    if (typeof window !== 'undefined') {
      store.limpiarCuento();
    }
    router.push(`/cuento?nivel=${nivelId}`);
  };
  
  const niveles = [
    {
      id: 'basico',
      titulo: 'Básico',
      descripcion: 'Para principiantes (6-8 años)',
      emoji: '🌱',
      color: 'from-green-400 to-green-600',
      caracteristicas: [
        'Palabras simples',
        'Oraciones cortas',
        '3 preguntas'
      ]
    },
    {
      id: 'intermedio',
      titulo: 'Intermedio',
      descripcion: 'Para lectores regulares (9-10 años)',
      emoji: '🌟',
      color: 'from-yellow-400 to-orange-500',
      caracteristicas: [
        'Vocabulario variado',
        'Historias más largas',
        '4 preguntas'
      ]
    },
    {
      id: 'avanzado',
      titulo: 'Avanzado',
      descripcion: 'Para lectores expertos (11-12 años)',
      emoji: '🚀',
      color: 'from-red-400 to-pink-600',
      caracteristicas: [
        'Vocabulario rico',
        'Tramas complejas',
        '5 preguntas'
      ]
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
      {niveles.map((nivel, index) => (
        <motion.div
          key={nivel.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 100 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card 
            onClick={() => onSelect(nivel.id)}
            className="cursor-pointer relative overflow-hidden h-full"
            padding="lg"
          >
            {/* Badge de nivel actual */}
            {nivelActual === nivel.id && (
              <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Actual
              </div>
            )}
            
            {/* Emoji grande */}
            <div className="text-6xl mb-4 text-center">
              {nivel.emoji}
            </div>
            
            {/* Título */}
            <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
              {nivel.titulo}
            </h3>
            
            {/* Descripción */}
            <p className="text-gray-600 text-center mb-6">
              {nivel.descripcion}
            </p>
            
            {/* Características */}
            <ul className="space-y-2 mb-6">
              {nivel.caracteristicas.map((caracteristica, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {caracteristica}
                </li>
              ))}
            </ul>
            
            {/* Botón */}
            <button
              onClick={() => handleGenerarCuento(nivel.id)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Generar cuento 📖
            </button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}