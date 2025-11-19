// Sistema OpenAI OPTIMIZADO - Más rápido y económico
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * USAR GPT-4O-MINI - 60% más rápido y 80% más barato que GPT-3.5-turbo
 * Latencia: ~500ms vs ~2000ms
 * Costo: $0.15/1M tokens vs $0.50/1M tokens
 */
const MODELO_RAPIDO = 'gpt-4o-mini'; // ⚡ Mucho más rápido
const MAX_TOKENS_OPTIMIZADO = 1800; // Reducido de 2500

/**
 * Lista de nombres diversos para evitar repetición
 */
const NOMBRES_DIVERSOS = {
  niños: [
    'Sofía', 'Miguel', 'Valentina', 'Diego', 'Isabella', 'Mateo',
    'Camila', 'Santiago', 'Lucía', 'Sebastián', 'Emma', 'Nicolás',
    'María', 'Daniel', 'Martina', 'Alejandro', 'Victoria', 'Gabriel'
  ],
  niñas: [
    'Luna', 'Estrella', 'Aurora', 'Marina', 'Celeste', 'Coral',
    'Iris', 'Jade', 'Perla', 'Rosa', 'Violeta', 'Dalia'
  ],
  animales: [
    'Manchitas', 'Pelusa', 'Colita', 'Ojitos', 'Patitas', 'Bigotes',
    'Orejas', 'Brillante', 'Saltarín', 'Veloz', 'Travieso', 'Amigo'
  ],
  fantasia: [
    'Zephyr', 'Nova', 'Atlas', 'Phoenix', 'Orion', 'Celeste',
    'Kai', 'Aria', 'Leo', 'Maya', 'Finn', 'Nora'
  ]
};

/**
 * Seleccionar nombres aleatorios evitando repetición
 */
function seleccionarNombresUnicos(categoria = 'niños', cantidad = 2) {
  const nombres = [...NOMBRES_DIVERSOS[categoria]];
  const seleccionados = [];
  
  for (let i = 0; i < cantidad && nombres.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * nombres.length);
    seleccionados.push(nombres.splice(randomIndex, 1)[0]);
  }
  
  return seleccionados;
}

/**
 * GENERAR CUENTO OPTIMIZADO - Más rápido y sin repeticiones
 */
export async function generarCuentoRapido(nivel, tema = null) {
  try {
    const timestamp = Date.now();
    
    // Seleccionar nombres únicos antes de generar
    const nombresProtagonistas = seleccionarNombresUnicos('niños', 2);
    
    const { obtenerPromptOptimizado } = await import('./prompts.js');
    const prompt = obtenerPromptOptimizado(nivel, tema, nombresProtagonistas);
    
    console.log(`⚡ Generando con ${MODELO_RAPIDO} (ultra-rápido)...`);
    console.log(`👥 Nombres únicos: ${nombresProtagonistas.join(', ')}`);
    
    const completion = await openai.chat.completions.create({
      model: MODELO_RAPIDO,
      messages: [
        {
          role: 'system',
          content: `Eres un escritor experto de cuentos infantiles educativos en ESPAÑOL.

REGLAS CRÍTICAS:
1. TODO en español perfecto (títulos, contenido, preguntas)
2. USA LOS NOMBRES PROPORCIONADOS - NO inventes otros
3. Descripciones de imágenes en inglés (solo campo "busqueda")
4. Responde en formato JSON estricto
5. Crea historias ÚNICAS - evita tramas repetitivas

ESTILO: Alegre, educativo, apropiado para niños, inspirador.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.95, // Mayor creatividad para evitar repetición
      max_tokens: MAX_TOKENS_OPTIMIZADO,
      response_format: { type: 'json_object' },
      // Parámetros de optimización
      frequency_penalty: 0.7, // ⚡ Reduce repeticiones
      presence_penalty: 0.6    // ⚡ Fomenta variedad
    });
    
    const tiempoTranscurrido = Date.now() - timestamp;
    console.log(`✅ Respuesta en ${tiempoTranscurrido}ms`);
    
    const contenido = completion.choices[0].message.content;
    const resultado = JSON.parse(contenido);
    
    // Validación estricta
    if (!resultado.titulo || !resultado.contenido || !resultado.preguntas) {
      throw new Error('Respuesta incompleta de OpenAI');
    }
    
    // Validar que las preguntas tengan el formato correcto
    if (!validarPreguntas(resultado.preguntas)) {
      throw new Error('Formato de preguntas inválido');
    }
    
    // Asegurar descripciones de imágenes
    if (!resultado.imagenes || resultado.imagenes.length < 3) {
      console.warn('⚠️ Generando descripciones de imágenes...');
      resultado.imagenes = generarDescripcionesVisuales(resultado, nombresProtagonistas);
    }
    
    console.log(`✅ Cuento generado: "${resultado.titulo}"`);
    console.log(`   Personajes: ${resultado.personajes?.map(p => p.nombre).join(', ')}`);
    console.log(`   Imágenes: ${resultado.imagenes.length}`);
    console.log(`   Tokens: ${completion.usage.total_tokens}`);
    
    return {
      success: true,
      data: {
        ...resultado,
        nivel,
        tema: tema || resultado.tema || 'General',
        duracionEstimada: calcularDuracionLectura(resultado.contenido),
        metadata: {
          modelo: MODELO_RAPIDO,
          tokens: completion.usage.total_tokens,
          tiempoGeneracion: tiempoTranscurrido
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error al generar cuento:', error);
    throw new Error(`No se pudo generar el cuento: ${error.message}`);
  }
}

/**
 * Validar formato de preguntas
 */
function validarPreguntas(preguntas) {
  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    return false;
  }
  
  return preguntas.every(p => 
    p &&
    typeof p.pregunta === 'string' &&
    Array.isArray(p.opciones) &&
    p.opciones.length === 4 &&
    typeof p.respuestaCorrecta === 'number' &&
    p.respuestaCorrecta >= 0 &&
    p.respuestaCorrecta <= 3 &&
    typeof p.explicacion === 'string'
  );
}

/**
 * Generar descripciones visuales detalladas para imágenes
 */
function generarDescripcionesVisuales(cuento, nombresPersonajes) {
  const personajes = nombresPersonajes.join(' and ');
  const tema = cuento.tema || 'adventure';
  
  return [
    {
      busqueda: `${personajes} beginning adventure`,
      descripcion: `Children's book illustration: ${personajes} starting their ${tema} journey, excited expressions, bright morning light, colorful and inviting scene, watercolor style, friendly atmosphere`,
      momento: 'inicio'
    },
    {
      busqueda: `${personajes} exciting moment`,
      descripcion: `Children's book illustration: ${personajes} in the middle of ${tema} adventure, dynamic action, vibrant colors, engaging background, storybook art style, magical atmosphere`,
      momento: 'desarrollo'
    },
    {
      busqueda: `${personajes} happy ending`,
      descripcion: `Children's book illustration: ${personajes} celebrating success at sunset, joyful smiles, warm colors, triumphant mood, beautiful landscape, heartwarming scene, storybook finale`,
      momento: 'final'
    }
  ];
}

/**
 * Calcular duración estimada de lectura
 */
function calcularDuracionLectura(texto) {
  const palabras = texto.split(/\s+/).length;
  const palabrasPorMinuto = 150; // Niños leen ~100-200 palabras/min
  return Math.ceil(palabras / palabrasPorMinuto);
}

/**
 * GENERAR PREGUNTA ADICIONAL (si se necesita)
 */
export async function generarPreguntaExtra(contenido, preguntasExistentes) {
  try {
    const completion = await openai.chat.completions.create({
      model: MODELO_RAPIDO,
      messages: [
        {
          role: 'system',
          content: 'Genera preguntas de comprensión lectora en español. Responde en JSON.'
        },
        {
          role: 'user',
          content: `Cuento: ${contenido}

Preguntas existentes: ${JSON.stringify(preguntasExistentes)}

Genera 1 pregunta NUEVA y DIFERENTE con este formato JSON:
{
  "pregunta": "Pregunta en español",
  "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  "respuestaCorrecta": 0,
  "explicacion": "Explicación en español"
}`
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generando pregunta:', error);
    throw error;
  }
}