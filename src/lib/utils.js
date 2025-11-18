// Funciones de utilidad para la aplicación

/**
 * Calcular puntos obtenidos según respuestas correctas
 * @param {number} correctas - Respuestas correctas
 * @param {number} total - Total de preguntas
 * @param {string} nivel - Nivel del cuento
 * @returns {number} Puntos calculados
 */
export function calcularPuntos(correctas, total, nivel) {
  const porcentaje = (correctas / total) * 100;
  const multiplicadorNivel = {
    basico: 1,
    intermedio: 1.5,
    avanzado: 2
  };
  
  const puntosBase = Math.round((porcentaje / 100) * 100);
  const multiplicador = multiplicadorNivel[nivel] || 1;
  
  return Math.round(puntosBase * multiplicador);
}

/**
 * Determinar si el usuario debe subir de nivel
 * @param {Array} historial - Historial de progreso
 * @param {string} nivelActual - Nivel actual del usuario
 * @returns {Object} Recomendación de nivel
 */
export function evaluarSubidaNivel(historial, nivelActual) {
  if (historial.length < 5) {
    return { 
      deberiaSubir: false, 
      mensaje: 'Completa al menos 5 cuentos para evaluar tu progreso' 
    };
  }
  
  // Analizar últimos 5 cuentos del nivel actual
  const ultimosCuentos = historial
    .filter(h => h.nivel === nivelActual)
    .slice(0, 5);
    
  if (ultimosCuentos.length < 5) {
    return { deberiaSubir: false, mensaje: 'Sigue practicando en este nivel' };
  }
  
  // Calcular promedio de aciertos
  const promedioAciertos = ultimosCuentos.reduce((acc, h) => {
    return acc + (h.respuestasCorrectas / h.totalPreguntas);
  }, 0) / ultimosCuentos.length;
  
  // Si el promedio es mayor a 85%, recomendar subir de nivel
  if (promedioAciertos >= 0.85) {
    const siguienteNivel = {
      basico: 'intermedio',
      intermedio: 'avanzado',
      avanzado: 'avanzado' // Ya está en el nivel máximo
    };
    
    if (nivelActual === 'avanzado') {
      return { 
        deberiaSubir: false, 
        mensaje: '¡Felicidades! Ya estás en el nivel máximo' 
      };
    }
    
    return {
      deberiaSubir: true,
      nuevoNivel: siguienteNivel[nivelActual],
      mensaje: `¡Excelente trabajo! Tienes un ${Math.round(promedioAciertos * 100)}% de aciertos. ¿Quieres intentar el nivel ${siguienteNivel[nivelActual]}?`
    };
  }
  
  return { 
    deberiaSubir: false, 
    mensaje: `Sigue practicando. Tienes un ${Math.round(promedioAciertos * 100)}% de aciertos` 
  };
}

/**
 * Formatear fecha en español
 * @param {Date|Timestamp} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatearFecha(fecha) {
  if (!fecha) return '';
  
  // Convertir Timestamp de Firebase a Date
  const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
  
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('es-ES', opciones);
}

/**
 * Generar ID único para sesión
 * @returns {string} ID único
 */
export function generarIdUnico() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validar edad del usuario
 * @param {number} edad - Edad ingresada
 * @returns {Object} Resultado de validación
 */
export function validarEdad(edad) {
  const edadNum = parseInt(edad);
  
  if (isNaN(edadNum)) {
    return { valido: false, error: 'Por favor ingresa una edad válida' };
  }
  
  if (edadNum < 6) {
    return { valido: false, error: 'Magic Reading es para niños de 6 años en adelante' };
  }
  
  if (edadNum > 12) {
    return { valido: false, error: 'Magic Reading está diseñado para niños de hasta 12 años' };
  }
  
  return { valido: true };
}

/**
 * Obtener nivel recomendado según edad
 * @param {number} edad - Edad del niño
 * @returns {string} Nivel recomendado
 */
export function obtenerNivelPorEdad(edad) {
  if (edad <= 8) return 'basico';
  if (edad <= 10) return 'intermedio';
  return 'avanzado';
}

/**
 * Sanitizar nombre de usuario
 * @param {string} nombre - Nombre ingresado
 * @returns {string} Nombre sanitizado
 */
export function sanitizarNombre(nombre) {
  return nombre
    .trim()
    .replace(/[^a-zA-ZáéíóúñÑ\s]/g, '')
    .substring(0, 50);
}

/**
 * Obtener color según nivel
 * @param {string} nivel - Nivel del cuento
 * @returns {string} Clase de Tailwind para el color
 */
export function obtenerColorNivel(nivel) {
  const colores = {
    basico: 'bg-green-500',
    intermedio: 'bg-yellow-500',
    avanzado: 'bg-red-500'
  };
  
  return colores[nivel] || colores.basico;
}

/**
 * Obtener emoji según nivel
 * @param {string} nivel - Nivel del cuento
 * @returns {string} Emoji representativo
 */
export function obtenerEmojiNivel(nivel) {
  const emojis = {
    basico: '🌱',
    intermedio: '🌟',
    avanzado: '🚀'
  };
  
  return emojis[nivel] || emojis.basico;
}