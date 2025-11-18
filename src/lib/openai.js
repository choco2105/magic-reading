// Configuración de OpenAI para generar cuentos educativos EN ESPAÑOL
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generarCuento(nivel, tema = null) {
  try {
    const { obtenerPromptPorNivel } = await import('./prompts.js');
    const prompt = obtenerPromptPorNivel(nivel, tema);
    
    console.log('📝 Enviando prompt a OpenAI (ESPAÑOL con descripciones visuales)...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un escritor experto de cuentos educativos para niños hispanohablantes de 6-12 años. IMPORTANTE: Debes escribir TODO en ESPAÑOL perfecto (títulos, contenido, preguntas). Además, generas descripciones visuales DETALLADAS en inglés para cada escena del cuento que servirán para generar ilustraciones con IA. Respondes en formato JSON.'
        },
        {
          role: 'user',
          content: `IDIOMA: Español para el cuento, inglés para descripciones de imágenes.\n\n${prompt}`
        }
      ],
      temperature: 0.9,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });
    
    console.log('✅ Respuesta recibida de OpenAI');
    
    const contenido = completion.choices[0].message.content;
    const resultado = JSON.parse(contenido);
    
    if (!resultado.titulo || !resultado.contenido || !resultado.preguntas) {
      throw new Error('Respuesta incompleta de OpenAI');
    }
    
    // Asegurar que hay descripciones de imágenes
    if (!resultado.imagenes || resultado.imagenes.length === 0) {
      console.warn('⚠️ Generando descripciones de imágenes por defecto...');
      resultado.imagenes = generarDescripcionesDeImagenes(resultado);
    }
    
    console.log(`✅ Cuento generado con ${resultado.imagenes?.length || 0} descripciones de imágenes`);
    
    return {
      success: true,
      data: {
        ...resultado,
        nivel,
        tema: tema || resultado.tema || 'General',
        duracionEstimada: calcularDuracionLectura(resultado.contenido),
      }
    };
    
  } catch (error) {
    console.error('❌ Error al generar cuento:', error);
    throw new Error('No se pudo generar el cuento');
  }
}

/**
 * Generar descripciones visuales para las imágenes si OpenAI no las proporciona
 */
function generarDescripcionesDeImagenes(resultado) {
  const personajes = resultado.personajes?.map(p => p.nombre).join(' ') || 'characters';
  const temaSimple = (resultado.tema || 'adventure').split(' ')[0];
  
  return [
    {
      busqueda: `${personajes} start`,
      descripcion: `${personajes} beginning their ${temaSimple} adventure in a colorful illustrated scene`,
      momento: 'inicio'
    },
    {
      busqueda: `${personajes} adventure`,
      descripcion: `${personajes} during exciting ${temaSimple} moment with vibrant colors`,
      momento: 'desarrollo'
    },
    {
      busqueda: `${personajes} happy`,
      descripcion: `${personajes} celebrating at the end with joyful expressions`,
      momento: 'final'
    }
  ];
}

function calcularDuracionLectura(texto) {
  return Math.ceil(texto.split(' ').length / 150);
}

export async function generarPreguntaAdicional(contenido) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Genera preguntas EN ESPAÑOL. Responde en JSON.'
        },
        {
          role: 'user',
          content: `Cuento: ${contenido}\n\nGenera 1 pregunta en español con formato JSON.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}