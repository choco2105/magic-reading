'use client';
// Página de preguntas de comprensión lectora
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useStore from '@/store/useStore';
import PreguntaCard from '@/components/PreguntaCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PreguntasPage() {
  const router = useRouter();
  const { 
    usuario, 
    cuentoActual, 
    progresoActual,
    registrarRespuesta,
    limpiarCuento 
  } = useStore();
  
  // Recuperar pregunta actual del progreso persistido
  const preguntasRespondidas = progresoActual?.preguntasRespondidas || [];
  const [preguntaActual, setPreguntaActual] = useState(preguntasRespondidas.length);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  
  useEffect(() => {
    // Verificar que haya usuario y cuento
    if (!usuario || !cuentoActual) {
      toast.error('Primero debes leer un cuento');
      router.push('/');
      return;
    }
    
    // Si ya respondió todas, mostrar resultado
    if (preguntasRespondidas.length === cuentoActual.preguntas?.length) {
      finalizarCuento();
    }
  }, [usuario, cuentoActual, router]);
  
  if (!cuentoActual || !usuario) {
    return null;
  }
  
  const preguntas = cuentoActual.preguntas || [];
  const pregunta = preguntas[preguntaActual];
  
  // Manejar respuesta a una pregunta
  const handleRespuesta = (esCorrecta, indiceRespuesta) => {
    // Registrar respuesta en el store (se persiste automáticamente)
    registrarRespuesta(preguntaActual, esCorrecta);
    
    // Guardar respuesta local
    setRespuestas([...respuestas, {
      pregunta: preguntaActual,
      respuesta: indiceRespuesta,
      correcta: esCorrecta
    }]);
    
    // Avanzar a siguiente pregunta o mostrar resultado
    setTimeout(() => {
      if (preguntaActual < preguntas.length - 1) {
        setPreguntaActual(preguntaActual + 1);
      } else {
        finalizarCuento();
      }
    }, 2000);
  };
  
  // Finalizar cuento y guardar progreso
  const finalizarCuento = async () => {
    setGuardando(true);
    
    try {
      const tiempoTotal = progresoActual.tiempoInicio 
        ? Math.floor((Date.now() - progresoActual.tiempoInicio) / 1000)
        : 0;
      
      // Guardar progreso en la base de datos
      const response = await fetch('/api/guardar-progreso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: usuario.id,
          cuentoId: cuentoActual.id,
          nivel: cuentoActual.nivel,
          tema: cuentoActual.tema,
          respuestasCorrectas: progresoActual.respuestasCorrectas,
          respuestasIncorrectas: progresoActual.respuestasIncorrectas,
          totalPreguntas: preguntas.length,
          tiempoCompletado: tiempoTotal,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mostrar modal de resultado
        setMostrarResultado(true);
      } else {
        throw new Error(data.error);
      }
      
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      toast.error('Hubo un error al guardar tu progreso');
    } finally {
      setGuardando(false);
    }
  };
  
  // Manejar cierre del modal de resultado
  const handleCerrarResultado = () => {
    limpiarCuento();
    router.push('/');
  };
  
  const porcentajeProgreso = ((preguntaActual + 1) / preguntas.length) * 100;
  
  if (guardando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Guardando tu progreso..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Preguntas de comprensión
            </h1>
            <div className="text-sm text-gray-600">
              {preguntaActual + 1} / {preguntas.length}
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentajeProgreso}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        {/* Pregunta actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={preguntaActual}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <PreguntaCard
              pregunta={pregunta}
              numero={preguntaActual + 1}
              onRespuesta={handleRespuesta}
              respondida={preguntasRespondidas.includes(preguntaActual)}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Botón volver al cuento */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/cuento')}
          >
            ← Volver al cuento
          </Button>
        </div>
      </div>
      
      {/* Modal de resultado */}
      <Modal
        isOpen={mostrarResultado}
        onClose={handleCerrarResultado}
        title="¡Cuento completado!"
        size="md"
        showCloseButton={false}
      >
        <div className="text-center py-8">
          {/* Emoji según resultado */}
          <div className="text-8xl mb-6">
            {progresoActual.respuestasCorrectas === preguntas.length ? '🎉' : 
             progresoActual.respuestasCorrectas >= preguntas.length * 0.7 ? '😊' : '🤔'}
          </div>
          
          {/* Estadísticas */}
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {progresoActual.respuestasCorrectas === preguntas.length 
              ? '¡Perfecto!' 
              : progresoActual.respuestasCorrectas >= preguntas.length * 0.7
              ? '¡Muy bien!'
              : '¡Buen intento!'}
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {progresoActual.respuestasCorrectas}
                </div>
                <div className="text-sm text-gray-600">Correctas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {progresoActual.respuestasIncorrectas}
                </div>
                <div className="text-sm text-gray-600">Incorrectas</div>
              </div>
            </div>
          </div>
          
          {/* Mensaje motivacional */}
          <p className="text-gray-600 mb-8">
            {progresoActual.respuestasCorrectas === preguntas.length 
              ? '¡Eres un experto lector! Sigue así.' 
              : progresoActual.respuestasCorrectas >= preguntas.length * 0.7
              ? '¡Excelente trabajo! Cada vez lees mejor.'
              : '¡Sigue practicando! Cada cuento te hace mejor lector.'}
          </p>
          
          {/* Botones */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleCerrarResultado}
            >
              Leer otro cuento
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                limpiarCuento();
                router.push('/progreso');
              }}
            >
              Ver mi progreso
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}