// Sistema OpenAI FINAL
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODELO = 'gpt-4o-mini';
const MAX_TOKENS = 2500;

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

export async function generarCuentoRapido(nivel, tema = null) {
  try {
    const timestamp = Date.now();
    
    const protagonista = seleccionarUnicos(NOMBRES_BANCO.protagonistas, 1)[0];
    const secundario = seleccionarUnicos(NOMBRES_BANCO.secundarios, 1)[0];
    const temaElegido = tema || TEMAS_ESPECIFICOS[Math.floor(Math.random() * TEMAS_ESPECIFICOS.length)];
    
    console.log(`⚡ Generando: "${temaElegido}"`);
    console.log(`👥 Personajes: ${protagonista} y ${secundario}`);
    
    const config = {
      basico: { palabras: 140, preguntas: 3 },
      intermedio: { palabras: 220, preguntas: 4 },
      avanzado: { palabras: 300, preguntas: 5 }
    }[nivel] || { palabras: 220, preguntas: 4 };
    
    const prompt = `Crea un cuento infantil en español sobre: ${temaElegido}

PERSONAJES:
- ${protagonista} (protagonista)
- ${secundario} (amigo/mascota)

LONGITUD: ${config.palabras} palabras
PREGUNTAS: ${config.preguntas} exactas

IMPORTANTE: El contenido DEBE tener parrafos separados con doble salto de linea.

FORMATO JSON (responde SOLO esto):
{
  "titulo": "Titulo del cuento",
  "contenido": "Primer parrafo aqui.\\n\\nSegundo parrafo aqui.\\n\\nTercer parrafo aqui.",
  "tema": "${temaElegido}",
  "personajes": [
    {"nombre": "${protagonista}", "descripcion": "Nino curioso", "tipo": "protagonista", "emoji": "👦"},
    {"nombre": "${secundario}", "descripcion": "Mascota fiel", "tipo": "secundario", "emoji": "🐶"}
  ],
  "imagenes": [
    {"prompt": "Children illustration ${protagonista} ${secundario} beginning bright", "momento": "inicio"},
    {"prompt": "Children illustration ${protagonista} ${secundario} exciting moment", "momento": "desarrollo"},
    {"prompt": "Children illustration ${protagonista} ${secundario} happy ending", "momento": "final"}
  ],
  "preguntas": [
    {"pregunta": "Primera pregunta del cuento", "opciones": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"], "respuestaCorrecta": 0, "explicacion": "Porque A es correcta"},
    {"pregunta": "Segunda pregunta del cuento", "opciones": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"], "respuestaCorrecta": 1, "explicacion": "Porque B es correcta"},
    {"pregunta": "Tercera pregunta del cuento", "opciones": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"], "respuestaCorrecta": 2, "explicacion": "Porque C es correcta"},
    {"pregunta": "Cuarta pregunta del cuento", "opciones": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"], "respuestaCorrecta": 3, "explicacion": "Porque D es correcta"}
  ]
}

REGLAS:
1. Genera EXACTAMENTE ${config.preguntas} preguntas
2. Divide el contenido en 3-4 parrafos separados con \\n\\n
3. Cada pregunta DEBE tener el campo "pregunta" con texto
4. NO dejes campos vacios
5. Responde SOLO JSON sin markdown`;

    const completion = await openai.chat.completions.create({
      model: MODELO,
      messages: [
        {
          role: 'system',
          content: 'Eres escritor de cuentos infantiles en español. Respondes SOLO con JSON válido. NUNCA dejes campos vacios. Cada pregunta DEBE tener texto en el campo pregunta.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.85,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' }
    });
    
    const tiempo = Date.now() - timestamp;
    let contenido = completion.choices[0].message.content;
    contenido = contenido.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('📄 Respuesta recibida:', contenido.substring(0, 150) + '...');
    
    let resultado;
    try {
      resultado = JSON.parse(contenido);
    } catch (parseError) {
      console.error('❌ Error JSON:', parseError.message);
      throw new Error('JSON inválido de OpenAI');
    }
    
    if (!resultado.titulo || !resultado.contenido) {
      throw new Error('Falta título o contenido');
    }
    
    if (!Array.isArray(resultado.preguntas) || resultado.preguntas.length < config.preguntas) {
      throw new Error(`Faltan preguntas: ${resultado.preguntas?.length || 0} de ${config.preguntas}`);
    }
    
    // Validar cada pregunta SIN lanzar error, solo corregir
    for (let i = 0; i < resultado.preguntas.length; i++) {
      const p = resultado.preguntas[i];
      
      // Si falta pregunta, usar las opciones
      if (!p.pregunta || p.pregunta.trim() === '') {
        if (Array.isArray(p.opciones) && p.opciones.length > 0) {
          p.pregunta = p.opciones[0]; // Usar primera opción como pregunta
          p.opciones = ['Sí', 'No', 'Tal vez', 'No sé']; // Opciones genéricas
        } else {
          p.pregunta = `Pregunta ${i + 1} sobre el cuento`;
          p.opciones = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
        }
      }
      
      // Asegurar opciones válidas
      if (!Array.isArray(p.opciones) || p.opciones.length !== 4) {
        p.opciones = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
      }
      
      // Asegurar respuesta correcta válida
      if (typeof p.respuestaCorrecta !== 'number' || p.respuestaCorrecta < 0 || p.respuestaCorrecta > 3) {
        p.respuestaCorrecta = 0;
      }
      
      // Asegurar explicación
      if (!p.explicacion || p.explicacion.trim() === '') {
        p.explicacion = 'Esta es la respuesta correcta.';
      }
    }
    
    resultado.preguntas = resultado.preguntas.slice(0, config.preguntas);
    
    if (!resultado.imagenes || resultado.imagenes.length < 3) {
      throw new Error('Faltan imágenes');
    }
    
    if (!resultado.personajes || resultado.personajes.length < 2) {
      throw new Error('Faltan personajes');
    }
    
    console.log(`✅ Cuento generado en ${tiempo}ms`);
    console.log(`📖 "${resultado.titulo}"`);
    console.log(`🎭 ${resultado.personajes.map(p => p.nombre).join(', ')}`);
    console.log(`❓ ${resultado.preguntas.length} preguntas`);
    
    return {
      success: true,
      data: {
        ...resultado,
        nivel,
        duracionEstimada: Math.ceil(resultado.contenido.split(' ').length / 150),
        metadata: {
          modelo: MODELO,
          tokens: completion.usage.total_tokens,
          tiempoGeneracion: tiempo
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw new Error(`Error al generar cuento: ${error.message}`);
  }
}