// Prompts OPTIMIZADOS para cuentos únicos y diversos

/**
 * Temas diversos y específicos
 */
const TEMAS_ESPECIFICOS = [
  // Naturaleza y animales
  'expedición en la selva amazónica',
  'aventura en un arrecife de coral',
  'migración de mariposas monarca',
  'rescate de animales marinos',
  
  // Ciencia y tecnología
  'construir un robot ayudante',
  'viaje al centro de un volcán',
  'experimento de ciencias divertido',
  'misión a la estación espacial',
  
  // Cultura y arte
  'festival de música tradicional',
  'creación de un mural comunitario',
  'descubrimiento arqueológico',
  'cocina internacional para niños',
  
  // Valores y emociones
  'superar el miedo a la oscuridad',
  'hacer nuevos amigos en la escuela',
  'resolver un misterio en el vecindario',
  'cuidar una mascota especial',
  
  // Fantasía y creatividad
  'biblioteca mágica de cuentos',
  'jardín de plantas parlantes',
  'ciudad submarina perdida',
  'circo de las estrellas'
];

/**
 * Obtener prompt optimizado según nivel
 */
export function obtenerPromptOptimizado(nivel, tema = null, nombresPersonajes = []) {
  // Seleccionar tema específico si no se proporciona
  const temaEspecifico = tema || TEMAS_ESPECIFICOS[Math.floor(Math.random() * TEMAS_ESPECIFICOS.length)];
  
  // Nombres de personajes proporcionados
  const nombres = nombresPersonajes.length > 0 
    ? nombresPersonajes.join(' y ')
    : 'dos amigos';
  
  const configuraciones = {
    basico: {
      edad: '6-8 años',
      palabras: '150-180',
      oraciones: 'muy cortas (máximo 8 palabras)',
      vocabulario: 'cotidiano y simple',
      preguntas: 3,
      complejidad: 'muy básica, conceptos concretos'
    },
    intermedio: {
      edad: '9-10 años',
      palabras: '250-280',
      oraciones: 'medias (8-12 palabras)',
      vocabulario: 'variado con palabras nuevas explicadas en contexto',
      preguntas: 4,
      complejidad: 'moderada, algunos conceptos abstractos'
    },
    avanzado: {
      edad: '11-12 años',
      palabras: '350-380',
      oraciones: 'complejas con subordinadas (12-15 palabras)',
      vocabulario: 'rico y descriptivo',
      preguntas: 5,
      complejidad: 'avanzada, pensamiento crítico'
    }
  };
  
  const config = configuraciones[nivel] || configuraciones.basico;
  
  return `🎯 MISIÓN: Crear un cuento ÚNICO y MEMORABLE sobre: "${temaEspecifico}"

👥 PERSONAJES OBLIGATORIOS (USA ESTOS NOMBRES):
- Protagonistas: ${nombres}
- ⚠️ CRÍTICO: NO cambies estos nombres. NO uses "Luna y Orión" ni otros nombres genéricos.

🌍 IDIOMA: Español perfecto en TODO excepto campo "busqueda" (inglés para imágenes)

📖 ESPECIFICACIONES DEL CUENTO:
- Edad objetivo: ${config.edad}
- Longitud: ${config.palabras} palabras
- Oraciones: ${config.oraciones}
- Vocabulario: ${config.vocabulario}
- Complejidad: ${config.complejidad}

✨ CREATIVIDAD:
- Historia ORIGINAL - evita tramas comunes
- Giro sorpresivo pero apropiado para niños
- Mensaje educativo integrado naturalmente
- Final satisfactorio y positivo

🎨 DESCRIPCIONES VISUALES (para generar ilustraciones):
⚠️ MUY IMPORTANTE: Crea 3 descripciones DETALLADAS en INGLÉS para ilustraciones

FORMATO de cada imagen:
{
  "busqueda": "3-5 keywords in english",
  "descripcion": "DETAILED scene description in english: [exact character names from story] [specific action happening] [environment with colors and details] [emotional atmosphere] [art style: children's book illustration, watercolor, friendly, colorful]",
  "momento": "inicio" | "desarrollo" | "final"
}

📋 PREGUNTAS DE COMPRENSIÓN (${config.preguntas} preguntas):
- Variadas: comprensión literal, inferencia, vocabulario, causa-efecto
- 4 opciones cada una, solo 1 correcta
- Explicación educativa para cada respuesta

🎯 FORMATO JSON ESTRICTO:
{
  "titulo": "Título llamativo en español",
  "tema": "${temaEspecifico}",
  "contenido": "Historia completa en español, dividida en párrafos cortos",
  "personajes": [
    {
      "nombre": "${nombresPersonajes[0] || 'Primer personaje'}",
      "descripcion": "Descripción del personaje",
      "tipo": "protagonista"
    },
    {
      "nombre": "${nombresPersonajes[1] || 'Segundo personaje'}",
      "descripcion": "Descripción del personaje",
      "tipo": "secundario"
    }
  ],
  "imagenes": [
    {
      "busqueda": "keywords for image search",
      "descripcion": "Detailed visual description with character names, actions, environment, colors, mood, art style",
      "momento": "inicio"
    },
    {
      "busqueda": "keywords for image search",
      "descripcion": "Detailed visual description with character names, actions, environment, colors, mood, art style",
      "momento": "desarrollo"
    },
    {
      "busqueda": "keywords for image search",
      "descripcion": "Detailed visual description with character names, actions, environment, colors, mood, art style",
      "momento": "final"
    }
  ],
  "preguntas": [
    {
      "pregunta": "Pregunta en español",
      "opciones": ["A", "B", "C", "D"],
      "respuestaCorrecta": 0,
      "explicacion": "Por qué es correcta"
    }
  ],
  "mensajeEducativo": "Lección o valor del cuento"
}

⚠️ RECUERDA:
- USA los nombres de personajes proporcionados: ${nombres}
- Cada cuento debe ser DIFERENTE y ÚNICO
- Descripciones de imágenes DETALLADAS en inglés
- TODO el contenido en español excepto descripciones de imágenes

¡Genera el cuento AHORA!`;
}

/**
 * Obtener tema aleatorio único
 */
export function obtenerTemaAleatorio() {
  return TEMAS_ESPECIFICOS[Math.floor(Math.random() * TEMAS_ESPECIFICOS.length)];
}

/**
 * Validar que el cuento no repita patrones comunes
 */
export function validarOriginalidad(cuento, historialTitulos = []) {
  // Verificar que no repita títulos anteriores
  if (historialTitulos.includes(cuento.titulo)) {
    return {
      valido: false,
      error: 'Título duplicado'
    };
  }
  
  // Verificar que no use personajes repetitivos
  const personajesRepetitivos = ['Luna', 'Orión', 'Estrella y Cometa'];
  const tienePersonajesRepetitivos = cuento.personajes?.some(p => 
    personajesRepetitivos.some(rep => p.nombre.includes(rep))
  );
  
  if (tienePersonajesRepetitivos) {
    return {
      valido: false,
      error: 'Personajes repetitivos detectados'
    };
  }
  
  return { valido: true };
}