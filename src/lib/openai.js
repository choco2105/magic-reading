// ============================================
// GPT-5 NANO - VERSIÓN ULTRA EXPLÍCITA
// Énfasis EXTREMO en generar 3 párrafos
// ============================================

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// CONFIGURACIÓN
// ============================================

const MODELO = 'gpt-5-nano';
const MAX_TOKENS = 3000; // Aumentado aún más para asegurar que complete
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
    'Max', 'Luna', 'Rocky', 'Bella', 'Toby', 'Coco',
    'Bruno', 'Lola', 'Michi', 'Pelusa', 'Félix', 'Manchas',
    'Copito', 'Canela', 'Chocolate', 'Tambor', 'Pipo', 'Bolita'
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
// FUNCIÓN PRINCIPAL
// ============================================

export async function generarCuentoRapido(nivel, tema = null) {
  try {
    const timestamp = Date.now();
    
    const protagonista = seleccionarUnicos(NOMBRES_BANCO.protagonistas, 1)[0];
    const secundario = seleccionarUnicos(NOMBRES_BANCO.secundarios, 1)[0];
    const temaElegido = tema || TEMAS_ESPECIFICOS[Math.floor(Math.random() * TEMAS_ESPECIFICOS.length)];
    
    console.log(`⚡ Generando: "${temaElegido}"`);
    console.log(`👥 Personajes: ${protagonista} y ${secundario}`);
    
    const config = {
      basico: { palabrasPorParrafo: 50, preguntas: 3 },
      intermedio: { palabrasPorParrafo: 75, preguntas: 4 },
      avanzado: { palabrasPorParrafo: 100, preguntas: 5 }
    }[nivel] || { palabrasPorParrafo: 75, preguntas: 4 };
    
    // ============================================
    // PROMPT ULTRA EXPLÍCITO PARA GPT-5 NANO
    // ============================================
    const prompt = `Escribe un cuento infantil completo sobre: ${temaElegido}

🎭 PERSONAJES (usa estos nombres exactos):
- ${protagonista} (el/la protagonista, niño o niña de 8 años)
- ${secundario} (la mascota, un animal: perro, gato, conejo, etc.)

📖 ESTRUCTURA OBLIGATORIA DEL CUENTO:

Debes escribir TRES PÁRRAFOS COMPLETOS. Cada párrafo debe tener aproximadamente ${config.palabrasPorParrafo} palabras.

PÁRRAFO 1 (Inicio - ${config.palabrasPorParrafo} palabras):
- Presenta a ${protagonista} y ${secundario}
- Describe dónde están y qué hacen
- Introduce el problema o aventura

PÁRRAFO 2 (Desarrollo - ${config.palabrasPorParrafo} palabras):
- Describe el desafío principal
- Muestra cómo ${protagonista} y ${secundario} enfrentan el problema
- Agrega emoción y acción

PÁRRAFO 3 (Final - ${config.palabrasPorParrafo} palabras):
- Resuelve el problema
- Muestra el aprendizaje
- Final feliz y satisfactorio

⚠️ MUY IMPORTANTE: 
- Escribe TRES párrafos completos, no uno solo
- Cada párrafo debe tener ${config.palabrasPorParrafo} palabras aproximadamente
- Separa los párrafos con \\n\\n (doble salto de línea)
- NO pongas títulos como "PÁRRAFO 1" o "INICIO" en el texto

🎨 IMÁGENES (3 imágenes, una por cada párrafo):

Para cada imagen, describe EN INGLÉS lo que sucede, pero SIN usar los nombres ${protagonista} o ${secundario}. 
Usa en su lugar: "a boy", "a girl", "a dog", "a cat", "a rabbit", etc.

Ejemplo CORRECTO: "a curious girl and her loyal dog exploring a cave"
Ejemplo INCORRECTO: "${protagonista} and ${secundario} exploring" 

❓ PREGUNTAS (${config.preguntas} preguntas de comprensión):

Crea exactamente ${config.preguntas} preguntas sobre el cuento con:
- 4 opciones cada una
- Solo 1 respuesta correcta (indica el índice 0-3)
- Una explicación clara

📋 FORMATO JSON (Completa TODO este JSON):

{
  "titulo": "Un título atractivo para el cuento",
  "contenido": "Aquí va el PÁRRAFO 1 completo de ${config.palabrasPorParrafo} palabras.\\n\\nAquí va el PÁRRAFO 2 completo de ${config.palabrasPorParrafo} palabras.\\n\\nAquí va el PÁRRAFO 3 completo de ${config.palabrasPorParrafo} palabras.",
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
      "descripcion": "Un perro/gato/conejo leal y juguetón",
      "tipo": "secundario",
      "tipoVisual": "dog" o "cat" o "rabbit",
      "emoji": "🐶" o "🐱" o "🐰"
    }
  ],
  "imagenes": [
    {
      "prompt": "Children's book illustration, watercolor style: a boy/girl and a dog/cat [acción del párrafo 1], bright colors, friendly, safe for kids",
      "descripcion": "Descripción de lo que pasa en el párrafo 1",
      "momento": "inicio"
    },
    {
      "prompt": "Children's book illustration, watercolor style: a boy/girl and a dog/cat [acción del párrafo 2], exciting scene, vibrant colors, friendly, safe for kids",
      "descripcion": "Descripción de lo que pasa en el párrafo 2",
      "momento": "desarrollo"
    },
    {
      "prompt": "Children's book illustration, watercolor style: a boy/girl and a dog/cat [acción del párrafo 3], happy ending, warm colors, friendly, safe for kids",
      "descripcion": "Descripción de lo que pasa en el párrafo 3",
      "momento": "final"
    }
  ],
  "preguntas": [
    {
      "pregunta": "Pregunta sobre el inicio del cuento",
      "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "respuestaCorrecta": 0,
      "explicacion": "Explicación de por qué esta es la correcta"
    },
    {
      "pregunta": "Pregunta sobre el desarrollo",
      "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "respuestaCorrecta": 1,
      "explicacion": "Explicación de por qué esta es la correcta"
    },
    {
      "pregunta": "Pregunta sobre el final",
      "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "respuestaCorrecta": 2,
      "explicacion": "Explicación de por qué esta es la correcta"
    }
  ]
}

🔴 REGLAS CRÍTICAS (lee esto antes de responder):

1. El campo "contenido" DEBE tener TRES párrafos separados por \\n\\n
2. Cada párrafo debe tener aproximadamente ${config.palabrasPorParrafo} palabras
3. NO escribas solo un párrafo largo - deben ser TRES párrafos distintos
4. En los prompts de imágenes USA "a boy/girl", "a dog/cat" - NUNCA nombres propios
5. Genera exactamente ${config.preguntas} preguntas
6. Todos los campos deben estar completos - NO dejes nada vacío
7. El JSON debe ser válido y estar completo

Responde SOLO con el JSON completo, sin texto adicional antes o después.`;

    // ============================================
    // LLAMADA A API
    // ============================================
    const completion = await openai.chat.completions.create({
      model: MODELO,
      messages: [
        {
          role: 'system',
          content: `Eres un escritor experto de cuentos infantiles. DEBES escribir SIEMPRE exactamente TRES párrafos completos separados por \\n\\n en el campo "contenido". NO escribas un solo párrafo largo. Los tres párrafos deben estar claramente separados. Respondes ÚNICAMENTE con JSON válido y completo.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: MAX_TOKENS,
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
      console.error('Primeros 500 caracteres:', contenido.substring(0, 500));
      throw new Error('JSON inválido de OpenAI');
    }
    
    // ============================================
    // VALIDACIÓN MÁS PERMISIVA
    // ============================================
    if (!resultado.titulo || !resultado.contenido) {
      throw new Error('Falta título o contenido');
    }
    
    // Contar párrafos
    const parrafos = resultado.contenido.split('\n\n').filter(p => p.trim());
    
    console.log(`📊 Párrafos detectados: ${parrafos.length}`);
    
    if (parrafos.length === 1) {
      // Si solo hay 1 párrafo, dividirlo por ORACIONES COMPLETAS
      console.warn('⚠️ Solo 1 párrafo detectado. Dividiendo por oraciones...');
      
      const texto = parrafos[0];
      // Dividir por oraciones (. ! ?)
      const oraciones = texto.match(/[^.!?]+[.!?]+/g) || [texto];
      
      if (oraciones.length >= 3) {
        // Si hay 3+ oraciones, dividirlas en 3 grupos
        const oracionesPorParrafo = Math.ceil(oraciones.length / 3);
        
        const p1 = oraciones.slice(0, oracionesPorParrafo).join(' ').trim();
        const p2 = oraciones.slice(oracionesPorParrafo, oracionesPorParrafo * 2).join(' ').trim();
        const p3 = oraciones.slice(oracionesPorParrafo * 2).join(' ').trim();
        
        resultado.contenido = `${p1}\n\n${p2}\n\n${p3}`;
        console.log(`✅ Dividido en 3 párrafos (${oraciones.length} oraciones)`);
      } else {
        // Si hay menos de 3 oraciones, usar el texto original pero agregarlo 3 veces
        console.log('⚠️ Muy pocas oraciones, manteniendo texto original');
        resultado.contenido = texto;
      }
    } else if (parrafos.length === 2) {
      // Si hay 2 párrafos, dividir el más largo por ORACIONES
      console.warn('⚠️ Solo 2 párrafos detectados. Dividiendo el más largo por oraciones...');
      
      if (parrafos[0].length > parrafos[1].length) {
        // Dividir el primer párrafo
        const oraciones = parrafos[0].match(/[^.!?]+[.!?]+/g) || [parrafos[0]];
        
        if (oraciones.length >= 2) {
          const mitad = Math.ceil(oraciones.length / 2);
          const p1 = oraciones.slice(0, mitad).join(' ').trim();
          const p2 = oraciones.slice(mitad).join(' ').trim();
          resultado.contenido = `${p1}\n\n${p2}\n\n${parrafos[1]}`;
          console.log('✅ Dividido en 3 párrafos');
        } else {
          resultado.contenido = parrafos.join('\n\n');
        }
      } else {
        // Dividir el segundo párrafo
        const oraciones = parrafos[1].match(/[^.!?]+[.!?]+/g) || [parrafos[1]];
        
        if (oraciones.length >= 2) {
          const mitad = Math.ceil(oraciones.length / 2);
          const p2 = oraciones.slice(0, mitad).join(' ').trim();
          const p3 = oraciones.slice(mitad).join(' ').trim();
          resultado.contenido = `${parrafos[0]}\n\n${p2}\n\n${p3}`;
          console.log('✅ Dividido en 3 párrafos');
        } else {
          resultado.contenido = parrafos.join('\n\n');
        }
      }
    } else if (parrafos.length > 3) {
      // Si hay más de 3, tomar los primeros 3
      console.warn(`⚠️ ${parrafos.length} párrafos detectados. Tomando los primeros 3...`);
      resultado.contenido = parrafos.slice(0, 3).join('\n\n');
    } else {
      console.log('✅ 3 párrafos correctos');
    }
    
    // Validar preguntas
    if (!Array.isArray(resultado.preguntas)) {
      resultado.preguntas = [];
    }
    
    // Asegurar que hay suficientes preguntas
    while (resultado.preguntas.length < config.preguntas) {
      resultado.preguntas.push({
        pregunta: `¿Qué aprendiste del cuento? (Pregunta ${resultado.preguntas.length + 1})`,
        opciones: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        respuestaCorrecta: 0,
        explicacion: 'Esta es la respuesta correcta según el cuento.'
      });
    }
    
    // Validar cada pregunta
    for (let i = 0; i < resultado.preguntas.length; i++) {
      const p = resultado.preguntas[i];
      
      if (!p.pregunta || p.pregunta.trim() === '') {
        p.pregunta = `Pregunta ${i + 1} sobre el cuento`;
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
    
    // Validar imágenes
    if (!Array.isArray(resultado.imagenes) || resultado.imagenes.length < 3) {
      console.warn('⚠️ Faltan imágenes, generando por defecto...');
      resultado.imagenes = [
        {
          prompt: `Children's book illustration: a child and an animal at the beginning of an adventure, watercolor style, bright colors`,
          descripcion: 'Inicio de la aventura',
          momento: 'inicio'
        },
        {
          prompt: `Children's book illustration: a child and an animal facing a challenge, watercolor style, exciting scene`,
          descripcion: 'Desafío principal',
          momento: 'desarrollo'
        },
        {
          prompt: `Children's book illustration: a child and an animal celebrating, watercolor style, happy ending`,
          descripcion: 'Final feliz',
          momento: 'final'
        }
      ];
    }
    
    // Validar personajes
    if (!Array.isArray(resultado.personajes) || resultado.personajes.length < 2) {
      console.warn('⚠️ Faltan personajes, generando por defecto...');
      resultado.personajes = [
        {
          nombre: protagonista,
          descripcion: 'Niño/niña curioso de 8 años',
          tipo: 'protagonista',
          tipoVisual: Math.random() > 0.5 ? 'boy' : 'girl',
          emoji: Math.random() > 0.5 ? '👦' : '👧'
        },
        {
          nombre: secundario,
          descripcion: 'Mascota leal',
          tipo: 'secundario',
          tipoVisual: 'dog',
          emoji: '🐶'
        }
      ];
    }
    
    // Asegurar tipoVisual en personajes
    resultado.personajes = resultado.personajes.map((p) => {
      if (!p.tipoVisual) {
        if (p.tipo === 'protagonista') {
          p.tipoVisual = Math.random() > 0.5 ? 'boy' : 'girl';
          p.emoji = p.tipoVisual === 'boy' ? '👦' : '👧';
        } else {
          p.tipoVisual = 'dog';
          p.emoji = '🐶';
        }
      }
      return p;
    });
    
    const parrafosFinales = resultado.contenido.split('\n\n').filter(p => p.trim());
    
    console.log(`✅ Cuento generado en ${tiempo}ms`);
    console.log(`📖 "${resultado.titulo}"`);
    console.log(`📄 ${parrafosFinales.length} párrafos`);
    console.log(`🎭 ${resultado.personajes.map(p => p.nombre).join(', ')}`);
    console.log(`❓ ${resultado.preguntas.length} preguntas`);
    
    return {
      success: true,
      data: {
        ...resultado,
        nivel,
        duracionEstimada: 3,
        metadata: {
          modelo: MODELO,
          tokens: completion.usage.total_tokens,
          tiempoGeneracion: tiempo,
          parrafos: parrafosFinales.length
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw new Error(`Error al generar cuento: ${error.message}`);
  }
}
