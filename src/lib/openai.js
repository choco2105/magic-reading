// ============================================
// GPT-5 NANO - CONFIGURACIÓN CORRECTA
// ============================================

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// CONFIGURACIÓN OPTIMIZADA PARA GPT-5 NANO
// ============================================

const MODELO = 'gpt-5-nano';

// GPT-5 Nano usa max_completion_tokens en vez de max_tokens
const MAX_COMPLETION_TOKENS = 2500;



// Reasoning effort para máxima velocidad
const REASONING_EFFORT = 'minimal';

// ============================================
// BANCOS DE DATOS
// ============================================

const NOMBRES_BANCO = {
  protagonistas: [
    'Sofía', 'Miguel', 'Valentina', 'Diego', 'Emma', 'Mateo',
    'Lucía', 'Santiago', 'Isabella', 'Nicolás', 'Martina', 'Gabriel',
    'Camila', 'Daniel', 'Victoria', 'Alejandro', 'María', 'Sebastián'
  ],
  secundarios: [
    'Estrella', 'Max', 'Luna', 'Toby', 'Nieve', 'Bruno',
    'Chispa', 'Rocky', 'Perla', 'Coco', 'Miel', 'Simba'
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
// FUNCIÓN PRINCIPAL CON GPT-5 NANO
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
    
    const prompt = `Cuento infantil: ${temaElegido}

PERSONAJES: ${protagonista} (niño/niña), ${secundario} (animal)

ESTRUCTURA (3 párrafos, ${config.palabrasPorParrafo} palabras c/u):
1. INICIO: Presentación
2. DESARROLLO: Desafío  
3. FINAL: Resolución

IMÁGENES (en inglés, sin nombres):
- inicio: "a boy/girl and a dog/cat [acción]"
- desarrollo: "a boy/girl and a dog/cat [acción]" 
- final: "a boy/girl and a dog/cat [acción]"

PREGUNTAS: ${config.preguntas} con explicaciones breves

JSON:
{
  "titulo": "...",
  "contenido": "párrafo1\\n\\npárrafo2\\n\\npárrafo3",
  "tema": "${temaElegido}",
  "personajes": [
    {"nombre": "${protagonista}", "descripcion": "...", "tipo": "protagonista", "tipoVisual": "boy/girl", "emoji": "👦/👧"},
    {"nombre": "${secundario}", "descripcion": "...", "tipo": "secundario", "tipoVisual": "dog/cat/etc", "emoji": "🐶/🐱/etc"}
  ],
  "imagenes": [
    {"prompt": "children's illustration: a [tipo] and a [tipo] [acción], watercolor", "descripcion": "...", "momento": "inicio"},
    {"prompt": "children's illustration: a [tipo] and a [tipo] [acción], watercolor", "descripcion": "...", "momento": "desarrollo"},
    {"prompt": "children's illustration: a [tipo] and a [tipo] [acción], watercolor", "descripcion": "...", "momento": "final"}
  ],
  "preguntas": [
    {"pregunta": "...", "opciones": ["A","B","C","D"], "respuestaCorrecta": 0, "explicacion": "..."}
  ]
}`;

    // ============================================
    // LLAMADA A GPT-5 NANO CON PARÁMETROS CORRECTOS
    // ============================================
    const completion = await openai.chat.completions.create({
      model: MODELO,
      messages: [
        {
          role: 'system',
          content: 'Escritor infantil. 3 párrafos exactos. Personajes: humano + animal. Imágenes en inglés sin nombres. JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: TEMPERATURE,
      
      // ⚠️ CRÍTICO: GPT-5 usa max_completion_tokens, NO max_tokens
      max_completion_tokens: MAX_COMPLETION_TOKENS,
      
      // Parámetro especial de GPT-5 Nano para máxima velocidad
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
    // VALIDACIÓN Y CORRECCIÓN
    // ============================================
    if (!resultado.titulo || !resultado.contenido) {
      throw new Error('Falta título o contenido');
    }
    
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
    
    // Validar y corregir preguntas
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
    // MÉTRICAS Y AHORRO
    // ============================================
    const tokensUsados = completion.usage.total_tokens;
    const costoInput = (completion.usage.prompt_tokens / 1000000) * 0.050;
    const costoOutput = (completion.usage.completion_tokens / 1000000) * 0.400;
    const costoTotal = costoInput + costoOutput;
    
    // Calcular ahorro vs gpt-4o-mini
    const costoMiniInput = (completion.usage.prompt_tokens / 1000000) * 0.150;
    const costoMiniOutput = (completion.usage.completion_tokens / 1000000) * 0.600;
    const costoMiniTotal = costoMiniInput + costoMiniOutput;
    const ahorro = ((costoMiniTotal - costoTotal) / costoMiniTotal * 100).toFixed(1);
    
    console.log(`✅ Cuento generado con GPT-5 NANO en ${tiempo}ms`);
    console.log(`📖 "${resultado.titulo}"`);
    console.log(`📄 ${parrafos.length} párrafos`);
    console.log(`🎭 ${resultado.personajes.map(p => p.nombre).join(', ')}`);
    console.log(`❓ ${resultado.preguntas.length} preguntas`);
    console.log(`📊 Tokens: ${tokensUsados} (${completion.usage.prompt_tokens} in + ${completion.usage.completion_tokens} out)`);
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
