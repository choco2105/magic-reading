// ============================================
// GPT-5 NANO - VERSIÓN MEJORADA CON PROMPT CORRECTO
// ============================================

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// CONFIGURACIÓN
// ============================================

const MODELO = 'gpt-5-nano';
const MAX_COMPLETION_TOKENS = 1500;
const REASONING_EFFORT = 'minimal';

// ============================================
// BANCOS DE DATOS MEJORADOS
// ============================================

const NOMBRES_BANCO = {
  protagonistas: [
    'Sofía', 'Miguel', 'Valentina', 'Diego', 'Emma', 'Mateo',
    'Lucía', 'Santiago', 'Isabella', 'Nicolás', 'Martina', 'Gabriel',
    'Camila', 'Daniel', 'Victoria', 'Alejandro', 'María', 'Sebastián'
  ],
  // ✅ NOMBRES NORMALES DE MASCOTAS (no raros)
  secundarios: [
    // Perros comunes
    'Max', 'Luna', 'Rocky', 'Bella', 'Toby', 'Coco',
    'Bruno', 'Lola', 'Rex', 'Mía', 'Zeus', 'Nala',
    // Gatos comunes
    'Michi', 'Pelusa', 'Garfield', 'Félix', 'Manchas', 'Bigotes',
    // Otros animales
    'Tambor', 'Copito', 'Pipo', 'Bolita', 'Canela', 'Chocolate'
  ]
};

const TEMAS_ESPECIFICOS = [
  'explorar una cueva mágica',
  'ayudar a un dragón bebé',
  'construir un robot amigable',
  'descubrir un jardín secreto',
  'salvar un bosque',
  'viajar en submarino',
  'encontrar un tesoro pirata',
  'organizar un concierto',
  'rescatar animales',
  'plantar árboles',
  'crear inventos reciclados',
  'descubrir fósiles',
  'viajar en globo',
  'ayudar aves migratorias',
  'cocinar recetas del mundo'
];

function seleccionarUnicos(array, cantidad) {
  const copia = [...array];
  const seleccionados = [];
  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccionados.push(copia.splice(idx, 1)[0]);
  }
  return seleccionados;
}

// ============================================
// FUNCIÓN PRINCIPAL CON PROMPT MEJORADO
// ============================================

export async function generarCuentoRapido(nivel, tema = null) {
  try {
    const timestamp = Date.now();
    
    const protagonista = seleccionarUnicos(NOMBRES_BANCO.protagonistas, 1)[0];
    const secundario = seleccionarUnicos(NOMBRES_BANCO.secundarios, 1)[0];
    const temaElegido = tema || TEMAS_ESPECIFICOS[Math.floor(Math.random() * TEMAS_ESPECIFICOS.length)];
    
    console.log(`⚡ Generando con GPT-5 NANO: "${temaElegido}"`);
    console.log(`👥 Personajes: ${protagonista} y ${secundario}`);
    
    const config = {
      basico: { palabrasPorParrafo: 40, preguntas: 3 },
      intermedio: { palabrasPorParrafo: 60, preguntas: 4 },
      avanzado: { palabrasPorParrafo: 80, preguntas: 5 }
    }[nivel] || { palabrasPorParrafo: 60, preguntas: 4 };
    
    // ============================================
    // PROMPT MEJORADO (basado en el original)
    // ============================================
    const prompt = `Crea un cuento infantil en español sobre: ${temaElegido}

PERSONAJES OBLIGATORIOS:
- ${protagonista} (protagonista humano: niño o niña)
- ${secundario} (mascota/animal: perro, gato, conejo, etc.)

⚠️ IMPORTANTE PARA PERSONAJES:
- El protagonista SIEMPRE es un niño/niña humano
- El secundario SIEMPRE es un animal/mascota
- Define claramente si es niño/niña y qué tipo de animal

⚠️ ESTRUCTURA CRÍTICA - EXACTAMENTE 3 PÁRRAFOS:
- Párrafo 1 (INICIO): ~${config.palabrasPorParrafo} palabras - Presentación de personajes y situación inicial
- Párrafo 2 (DESARROLLO): ~${config.palabrasPorParrafo} palabras - Desafío principal y acción
- Párrafo 3 (FINAL): ~${config.palabrasPorParrafo} palabras - Resolución y aprendizaje

⚠️ CRÍTICO: NO incluyas las etiquetas "INICIO:", "DESARROLLO:", "FINAL:" en el texto del cuento.
Solo escribe los 3 párrafos normales, separados con \\n\\n

IMPORTANTE: 
- SOLO 3 párrafos, separados con \\n\\n
- Cada párrafo debe ser una escena completa
- NO exceder los 3 párrafos
- NO incluir etiquetas como "INICIO:", "DESARROLLO:", "FINAL:" en el contenido

PREGUNTAS: ${config.preguntas} exactas

⚠️ CRÍTICO PARA IMÁGENES - USA TIPO DE PERSONAJE, NO NOMBRE:
- NO uses nombres en los prompts de imágenes
- USA: "a child", "a boy", "a girl", "a dog", "a cat", "a rabbit", etc.
- NUNCA: "${protagonista}", "${secundario}" (nombres confunden a DALL-E)
- Ejemplo CORRECTO: "a curious boy and his loyal dog playing"
- Ejemplo INCORRECTO: "Sofia and Perla playing"

FORMATO JSON (responde SOLO esto):
{
  "titulo": "Titulo del cuento",
  "contenido": "Primer párrafo aquí (${config.palabrasPorParrafo} palabras). La historia comienza de forma natural.\\n\\nSegundo párrafo aquí (${config.palabrasPorParrafo} palabras). Continúa la aventura sin etiquetas.\\n\\nTercer párrafo aquí (${config.palabrasPorParrafo} palabras). Final satisfactorio.",
  "tema": "${temaElegido}",
  "personajes": [
    {
      "nombre": "${protagonista}", 
      "descripcion": "Niño/niña curioso de 8 años", 
      "tipo": "protagonista", 
      "tipoVisual": "boy" o "girl",
      "emoji": "👦" o "👧"
    },
    {
      "nombre": "${secundario}", 
      "descripcion": "Describe el animal: perro leal, gato juguetón, etc.", 
      "tipo": "secundario", 
      "tipoVisual": "dog" o "cat" o "rabbit" o "bird" (tipo de animal en inglés),
      "emoji": "🐶" o "🐱" o "🐰" etc
    }
  ],
  "imagenes": [
    {
      "prompt": "Children's book illustration: a [boy/girl] and a [dog/cat/rabbit] [EXACT action from paragraph 1], bright cheerful colors, watercolor style, friendly, safe for kids",
      "descripcion": "Descripción EXACTA de lo que ocurre en el párrafo 1",
      "momento": "inicio"
    },
    {
      "prompt": "Children's book illustration: a [boy/girl] and a [dog/cat/rabbit] [EXACT action from paragraph 2], exciting moment, vibrant colors, watercolor style, friendly, safe for kids",
      "descripcion": "Descripción EXACTA de lo que ocurre en el párrafo 2",
      "momento": "desarrollo"
    },
    {
      "prompt": "Children's book illustration: a [boy/girl] and a [dog/cat/rabbit] [EXACT action from paragraph 3], happy ending, warm colors, watercolor style, friendly, safe for kids",
      "descripcion": "Descripción EXACTA de lo que ocurre en el párrafo 3",
      "momento": "final"
    }
  ],
  "preguntas": [
    {"pregunta": "¿Qué sucede en el inicio del cuento?", "opciones": ["A", "B", "C", "D"], "respuestaCorrecta": 0, "explicacion": "Explicación detallada con referencia al texto"},
    {"pregunta": "¿Cuál es el desafío principal?", "opciones": ["A", "B", "C", "D"], "respuestaCorrecta": 1, "explicacion": "Explicación detallada con referencia al texto"},
    {"pregunta": "¿Cómo se resuelve la situación?", "opciones": ["A", "B", "C", "D"], "respuestaCorrecta": 2, "explicacion": "Explicación detallada con referencia al texto"}
  ]
}

REGLAS ESTRICTAS:
1. EXACTAMENTE 3 párrafos (no más, no menos)
2. Personajes: protagonista = niño/niña humano, secundario = animal específico
3. En prompts de imágenes USA "a boy", "a girl", "a dog", "a cat" - NUNCA nombres propios
4. Cada imagen debe describir LITERALMENTE lo que pasa en su párrafo correspondiente
5. Las preguntas deben poder responderse CON el contenido del cuento
6. Explicaciones claras que CITEN partes del cuento
7. Genera EXACTAMENTE ${config.preguntas} preguntas
8. Cada pregunta DEBE tener el campo "pregunta" con texto válido
9. NO dejes campos vacíos
10. Define tipoVisual en cada personaje (boy/girl para humanos, dog/cat/rabbit/bird para animales)
11. ⚠️ MUY IMPORTANTE: NO incluyas "INICIO:", "DESARROLLO:", "FINAL:" en el contenido del cuento
12. El contenido debe ser solo los 3 párrafos narrativos, sin etiquetas`;

    // ============================================
    // LLAMADA A API
    // ============================================
    const completion = await openai.chat.completions.create({
      model: MODELO,
      messages: [
        {
          role: 'system',
          content: 'Eres escritor experto de cuentos infantiles. Creas historias en EXACTAMENTE 3 párrafos narrativos limpios, sin etiquetas como "INICIO:", "DESARROLLO:", "FINAL:". Las imágenes deben usar tipos genéricos (a boy, a girl, a dog, a cat) NUNCA nombres propios. El protagonista siempre es humano (niño o niña), el secundario siempre es animal. Respondes SOLO con JSON válido. NUNCA dejes campos vacíos. Cada pregunta DEBE tener texto en el campo pregunta.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: MAX_COMPLETION_TOKENS,
      reasoning_effort: REASONING_EFFORT,
      response_format: { type: 'json_object' }
    });
    
    const tiempo = Date.now() - timestamp;
    let contenido = completion.choices[0].message.content;
    contenido = contenido.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let resultado;
    try {
      resultado = JSON.parse(contenido);
    } catch (parseError) {
      console.error('❌ Error JSON:', parseError.message);
      throw new Error('JSON inválido de OpenAI');
    }
    
    // ============================================
    // VALIDACIÓN
    // ============================================
    if (!resultado.titulo || !resultado.contenido) {
      throw new Error('Falta título o contenido');
    }
    
    // LIMPIAR cualquier etiqueta que haya quedado
    resultado.contenido = resultado.contenido
      .replace(/INICIO:\s*/gi, '')
      .replace(/DESARROLLO:\s*/gi, '')
      .replace(/FINAL:\s*/gi, '')
      .replace(/Párrafo \d+:\s*/gi, '');
    
    const parrafos = resultado.contenido.split('\n\n').filter(p => p.trim());
    if (parrafos.length !== 3) {
      console.warn(`⚠️ Ajustando párrafos: ${parrafos.length} -> 3`);
      if (parrafos.length > 3) {
        resultado.contenido = parrafos.slice(0, 3).join('\n\n');
      } else {
        throw new Error(`Cuento inválido: solo ${parrafos.length} párrafos`);
      }
    }
    
    if (!Array.isArray(resultado.preguntas) || resultado.preguntas.length < config.preguntas) {
      throw new Error(`Faltan preguntas: ${resultado.preguntas?.length || 0} de ${config.preguntas}`);
    }
    
    // Validar preguntas
    for (let i = 0; i < resultado.preguntas.length; i++) {
      const p = resultado.preguntas[i];
      
      if (!p.pregunta || p.pregunta.trim() === '') {
        if (Array.isArray(p.opciones) && p.opciones.length > 0) {
          p.pregunta = `¿${p.opciones[0]}?`;
          p.opciones = ['Sí', 'No', 'Tal vez', 'No sé'];
        } else {
          p.pregunta = `Pregunta ${i + 1} sobre el cuento`;
          p.opciones = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
        }
      }
      
      if (!Array.isArray(p.opciones) || p.opciones.length !== 4) {
        p.opciones = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
      }
      
      if (typeof p.respuestaCorrecta !== 'number' || p.respuestaCorrecta < 0 || p.respuestaCorrecta > 3) {
        p.respuestaCorrecta = 0;
      }
      
      if (!p.explicacion || p.explicacion.trim() === '') {
        p.explicacion = 'Esta es la respuesta correcta según el cuento.';
      }
    }
    
    resultado.preguntas = resultado.preguntas.slice(0, config.preguntas);
    
    if (!resultado.imagenes || resultado.imagenes.length < 3) {
      throw new Error('Faltan imágenes');
    }
    
    if (!resultado.personajes || resultado.personajes.length < 2) {
      throw new Error('Faltan personajes');
    }
    
    // Asegurar tipoVisual
    resultado.personajes = resultado.personajes.map((p, idx) => {
      if (!p.tipoVisual) {
        if (p.tipo === 'protagonista') {
          p.tipoVisual = Math.random() > 0.5 ? 'boy' : 'girl';
          p.emoji = p.tipoVisual === 'boy' ? '👦' : '👧';
        } else {
          const animalTypes = {
            '🐶': 'dog', '🐕': 'dog',
            '🐱': 'cat', '🐈': 'cat', 
            '🐰': 'rabbit', '🐇': 'rabbit',
            '🐦': 'bird', '🦜': 'bird',
            '🐻': 'bear', '🦊': 'fox',
            '🐼': 'panda', '🐨': 'koala'
          };
          p.tipoVisual = animalTypes[p.emoji] || 'dog';
        }
      }
      return p;
    });
    
    // ============================================
    // MÉTRICAS
    // ============================================
    const tokensUsados = completion.usage.total_tokens;
    const costoInput = (completion.usage.prompt_tokens / 1000000) * 0.050;
    const costoOutput = (completion.usage.completion_tokens / 1000000) * 0.400;
    const costoTotal = costoInput + costoOutput;
    
    const costoMiniInput = (completion.usage.prompt_tokens / 1000000) * 0.150;
    const costoMiniOutput = (completion.usage.completion_tokens / 1000000) * 0.600;
    const costoMiniTotal = costoMiniInput + costoMiniOutput;
    const ahorro = ((costoMiniTotal - costoTotal) / costoMiniTotal * 100).toFixed(1);
    
    console.log(`✅ Cuento generado con GPT-5 NANO en ${tiempo}ms`);
    console.log(`📖 "${resultado.titulo}"`);
    console.log(`📄 ${parrafos.length} párrafos limpios (sin etiquetas)`);
    console.log(`🎭 ${resultado.personajes.map(p => p.nombre).join(', ')}`);
    console.log(`❓ ${resultado.preguntas.length} preguntas`);
    console.log(`📊 Tokens: ${tokensUsados}`);
    console.log(`💰 Costo: $${costoTotal.toFixed(6)}`);
    console.log(`🎉 AHORRO: ${ahorro}% vs gpt-4o-mini`);
    
    return {
      success: true,
      data: {
        ...resultado,
        nivel,
        duracionEstimada: 3,
        metadata: {
          modelo: MODELO,
          tokens: tokensUsados,
          tiempoGeneracion: tiempo,
          parrafos: parrafos.length,
          costoGeneracion: costoTotal,
          ahorroVsMini: ahorro + '%'
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw new Error(`Error al generar cuento: ${error.message}`);
  }
}
