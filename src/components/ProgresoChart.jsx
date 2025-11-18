'use client';
// Componente para mostrar estadísticas y progreso del usuario
import { motion } from 'framer-motion';
import Card from './ui/Card';

export default function ProgresoChart({ estadisticas, historial }) {
  // Datos por defecto si no hay estadísticas
  const stats = estadisticas || {
    totalCuentos: 0,
    promedioAciertos: 0,
    totalPuntos: 0,
    cuentosCompletados: 0,
    mejorRacha: 0,
  };
  
  // Calcular progreso por nivel
  const calcularProgresoNiveles = () => {
    if (!historial || historial.length === 0) {
      return { basico: 0, intermedio: 0, avanzado: 0 };
    }
    
    const conteo = { basico: 0, intermedio: 0, avanzado: 0 };
    historial.forEach(item => {
      if (item.completado && conteo[item.nivel] !== undefined) {
        conteo[item.nivel]++;
      }
    });
    
    return conteo;
  };
  
  const progresoNiveles = calcularProgresoNiveles();
  
  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de cuentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="md" className="text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalCuentos}
            </div>
            <div className="text-sm text-gray-600">Cuentos leídos</div>
          </Card>
        </motion.div>
        
        {/* Promedio de aciertos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="md" className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.promedioAciertos}%
            </div>
            <div className="text-sm text-gray-600">Promedio aciertos</div>
          </Card>
        </motion.div>
        
        {/* Total de puntos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="md" className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.totalPuntos}
            </div>
            <div className="text-sm text-gray-600">Puntos totales</div>
          </Card>
        </motion.div>
        
        {/* Mejor racha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card padding="md" className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-600">
              {stats.mejorRacha}
            </div>
            <div className="text-sm text-gray-600">Mejor racha</div>
          </Card>
        </motion.div>
      </div>
      
      {/* Progreso por nivel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card padding="lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Progreso por nivel
          </h3>
          
          <div className="space-y-4">
            {/* Básico */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  🌱 Básico
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progresoNiveles.basico} completados
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progresoNiveles.basico / 10) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                />
              </div>
            </div>
            
            {/* Intermedio */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  🌟 Intermedio
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progresoNiveles.intermedio} completados
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progresoNiveles.intermedio / 10) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                />
              </div>
            </div>
            
            {/* Avanzado */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  🚀 Avanzado
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progresoNiveles.avanzado} completados
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progresoNiveles.avanzado / 10) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="bg-gradient-to-r from-red-400 to-pink-600 h-3 rounded-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Historial reciente */}
      {historial && historial.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card padding="lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Últimos cuentos leídos
            </h3>
            
            <div className="space-y-3">
              {historial.slice(0, 5).map((item, index) => (
                <div 
                  key={item.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {item.tema || 'Cuento'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Nivel: {item.nivel} • {item.respuestasCorrectas}/{item.totalPreguntas} correctas
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {item.puntosObtenidos} pts
                    </div>
                    {item.completado && (
                      <div className="text-xs text-green-600">✓ Completado</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}