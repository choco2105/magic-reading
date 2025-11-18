export function obtenerPromptPorNivel(nivel, tema = null) {
  const temasDefault = [
    'aventura en el bosque',
    'amistad entre animales',
    'exploración espacial',
    'viaje al fondo del mar',
    'magia y fantasía',
    'inventos científicos',
    'culturas del mundo',
    'protección del medio ambiente'
  ];
  
  const temaSeleccionado = tema || temasDefault[Math.floor(Math.random() * temasDefault.length)];
  
  const basePrompt = `Crea un cuento educativo sobre: "${temaSeleccionado}"`;
  
  const configuracionNivel = {
    basico: {
      edad: '6-8 años',
      vocabulario: 'simple y cotidiano',
      oraciones: 'cortas y directas (máximo 10 palabras)',
      longitud: '150-200 palabras',
      preguntas: 3,
    },
    intermedio: {
      edad: '9-10 años',
      vocabulario: 'variado con algunas palabras nuevas',
      oraciones: 'de longitud media (10-15 palabras)',
      longitud: '250-300 palabras',
      preguntas: 4,
    },
    avanzado: {
      edad: '11-12 años',
      vocabulario: 'rico y descriptivo',
      oraciones: 'complejas con subordinadas',
      longitud: '350-400 palabras',
      preguntas: 5,
    }
  };
  
  const config = configuracionNivel[nivel] || configuracionNivel.basico;
  
  return `${basePrompt}

🌍 IDIOMA OBLIGATORIO: ESPAÑOL PERFECTO
⚠️ CRÍTICO: TODO el cuento debe estar en ESPAÑOL (títulos, contenido, preguntas, explicaciones)
❌ EXCEPCIÓN: Solo el campo "busqueda" dentro de "imagenes" en INGLÉS

👥 PERSONAJES ÚNICOS:
⚠️ NO uses personajes repetitivos como "Luna y Orión"
✅ Crea nombres NUEVOS y CREATIVOS para cada cuento
✅ Usa nombres hispanos variados: Sofía, Miguel, Valentina, Diego, etc.
✅ O nombres de animales: Pelusa, Manchitas, Colita, etc.
✅ Los personajes deben ser DIFERENTES en cada cuento

REQUISITOS DEL CUENTO:
- Edad: ${config.edad}
- Vocabulario: ${config.vocabulario}
- Longitud: ${config.longitud}
- Preguntas: ${config.preguntas}
- Tema: ${temaSeleccionado}

PASO 2 - GENERAR DESCRIPCIONES VISUALES DETALLADAS:
⚠️ MUY IMPORTANTE: Cada imagen necesita una descripción visual DETALLADA en INGLÉS
✅ Las descripciones deben ser específicas al cuento que acabas de crear
✅ Incluir nombres de personajes, ambiente, colores, emociones
✅ Estilo: "children's book illustration", "colorful", "friendly", "storybook art"

FORMATO DE CADA IMAGEN:
{
  "busqueda": "short keywords in english",
  "descripcion": "DETAILED visual description in english: [character names] [specific action] [environment details] [colors] [mood], children's book illustration, colorful, friendly, storybook style",
  "momento": "inicio" | "desarrollo" | "final"
}

⚠️ CRÍTICO: Las descripciones deben ser ÚNICAS para cada cuento, no genéricas
✅ Incluir detalles específicos de TU cuento (nombres, lugares, objetos del cuento)
✅ Describir la ESCENA EXACTA que está pasando en ese momento del cuento
✅ Cada momento debe mostrar progresión: inicio (presentación) → desarrollo (acción) → final (conclusión)
✅ Las descripciones en INGLÉS son esenciales para que Unsplash/Dall-E encuentren imágenes correctas

FORMATO JSON OBLIGATORIO:
{
  "titulo": "El Título en Español",
  "tema": "${temaSeleccionado}",
  "contenido": "Todo el cuento en español...",
  "personajes": [
    {
      "nombre": "Nombre único en español",
      "descripcion": "Descripción en español",
      "tipo": "protagonista"
    }
  ],
  "imagenes": [
    {
      "busqueda": "short keywords in english",
      "descripcion": "DETAILED visual description in english: [character names] [specific action] [environment details] [colors] [mood], children's book illustration, colorful, friendly, storybook style",
      "momento": "inicio"
    }
  ],
  "preguntas": [
    {
      "pregunta": "Pregunta en español",
      "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
      "respuestaCorrecta": 0,
      "explicacion": "Explicación en español"
    }
  ]
}

Genera el cuento AHORA en español:`;
}