// Servicio para generar imágenes con IA basadas en descripciones del cuento

/**
 * Generar imagen con Pollinations.ai (GRATIS, SIN API KEY)
 * Esta es la opción más confiable y no requiere configuración
 */
async function generarConPollinations(prompt) {
  try {
    // Mejorar el prompt para obtener ilustraciones infantiles
    const promptMejorado = `children's book illustration, colorful, friendly, ${prompt}, digital art, vibrant colors, safe for kids, cartoon style`;
    
    // Pollinations usa URLs directas sin necesidad de API
    const seed = Math.floor(Math.random() * 10000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptMejorado)}?width=1024&height=768&seed=${seed}&nologo=true`;
    
    console.log(`🎨 Generando con Pollinations: "${prompt}"`);
    
    // Verificar que la imagen se puede cargar
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`✅ Imagen generada exitosamente`);
      return {
        url: url,
        urlSmall: url.replace('1024', '512').replace('768', '384'),
        urlThumb: url.replace('1024', '256').replace('768', '192'),
        alt: prompt,
        autor: 'Pollinations AI',
        autorUrl: 'https://pollinations.ai',
        fuente: 'Pollinations',
        tipo: 'generada'
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error con Pollinations:', error.message);
    return null;
  }
}

/**
 * Generar imagen con Hugging Face (requiere API key gratuita)
 */
async function generarConHuggingFace(prompt) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ Falta HUGGINGFACE_API_KEY');
      return null;
    }
    
    const promptMejorado = `children illustration, colorful, friendly, ${prompt}, storybook art, digital painting, vibrant, cute, safe for kids`;
    
    console.log(`🎨 Generando con Hugging Face: "${prompt}"`);
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: promptMejorado,
          options: { wait_for_model: true }
        }),
      }
    );
    
    if (!response.ok) {
      console.error(`❌ Hugging Face error: ${response.status}`);
      return null;
    }
    
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    console.log(`✅ Imagen generada con Hugging Face`);
    
    return {
      url: imageUrl,
      urlSmall: imageUrl,
      urlThumb: imageUrl,
      alt: prompt,
      autor: 'Hugging Face AI',
      autorUrl: 'https://huggingface.co',
      fuente: 'Hugging Face',
      tipo: 'generada'
    };
    
  } catch (error) {
    console.error('❌ Error con Hugging Face:', error.message);
    return null;
  }
}

/**
 * Generar imagen con Segmind (alternativa gratuita)
 */
async function generarConSegmind(prompt) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SEGMIND_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ Falta SEGMIND_API_KEY');
      return null;
    }
    
    const promptMejorado = `illustration for children's book, ${prompt}, colorful, friendly, cartoon style, digital art`;
    
    console.log(`🎨 Generando con Segmind: "${prompt}"`);
    
    const response = await fetch('https://api.segmind.com/v1/sd1.5-txt2img', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: promptMejorado,
        negative_prompt: 'scary, dark, violent, inappropriate, realistic photo',
        samples: 1,
        width: 1024,
        height: 768,
      })
    });
    
    if (!response.ok) {
      console.error(`❌ Segmind error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.image) {
      console.log(`✅ Imagen generada con Segmind`);
      return {
        url: data.image,
        urlSmall: data.image,
        urlThumb: data.image,
        alt: prompt,
        autor: 'Segmind AI',
        autorUrl: 'https://segmind.com',
        fuente: 'Segmind',
        tipo: 'generada'
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Error con Segmind:', error.message);
    return null;
  }
}

/**
 * Placeholder ilustrado como fallback
 */
function generarPlaceholder(prompt, momento) {
  const colores = {
    inicio: { bg: '8b5cf6', fg: 'ffffff', emoji: '📖' },
    desarrollo: { bg: '3b82f6', fg: 'ffffff', emoji: '🎯' },
    final: { bg: '10b981', fg: 'ffffff', emoji: '🌟' }
  };
  
  const config = colores[momento] || colores.inicio;
  const textoCorto = prompt.split(' ').slice(0, 3).join('+');
  
  return {
    url: `https://placehold.co/1024x768/${config.bg}/${config.fg}?text=${config.emoji}+${encodeURIComponent(textoCorto)}&font=roboto`,
    urlSmall: `https://placehold.co/512x384/${config.bg}/${config.fg}?text=${config.emoji}&font=roboto`,
    urlThumb: `https://placehold.co/256x192/${config.bg}/${config.fg}?text=${config.emoji}&font=roboto`,
    alt: prompt,
    autor: 'Magic Reading',
    autorUrl: '#',
    fuente: 'Placeholder',
    tipo: 'placeholder'
  };
}

/**
 * Generar UNA imagen con cascada de servicios
 */
export async function generarImagen(prompt, momento = 'inicio') {
  console.log(`\n🖼️  Generando imagen: "${prompt}" (${momento})`);
  
  // 1. Intentar con Pollinations (más confiable, no requiere API key)
  let imagen = await generarConPollinations(prompt);
  if (imagen) {
    console.log(`   ✅ Generada con Pollinations\n`);
    return imagen;
  }
  
  // 2. Intentar con Hugging Face (si hay API key)
  imagen = await generarConHuggingFace(prompt);
  if (imagen) {
    console.log(`   ✅ Generada con Hugging Face\n`);
    return imagen;
  }
  
  // 3. Intentar con Segmind (si hay API key)
  imagen = await generarConSegmind(prompt);
  if (imagen) {
    console.log(`   ✅ Generada con Segmind\n`);
    return imagen;
  }
  
  // 4. Fallback a placeholder
  console.log(`   ⚠️  Usando placeholder\n`);
  return generarPlaceholder(prompt, momento);
}

/**
 * Generar MÚLTIPLES imágenes en paralelo
 */
export async function generarImagenes(imagenesArray) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎨 GENERANDO ${imagenesArray.length} IMÁGENES CON IA`);
  console.log(`${'='.repeat(60)}`);
  
  const promesas = imagenesArray.map((item, index) => {
    const prompt = item.descripcion || item.busqueda || `scene ${index + 1}`;
    return generarImagen(prompt, item.momento);
  });
  
  const imagenes = await Promise.all(promesas);
  
  const generadas = imagenes.filter(img => img.tipo === 'generada').length;
  const placeholders = imagenes.length - generadas;
  
  console.log(`\n✅ RESULTADO: ${generadas} generadas, ${placeholders} placeholders`);
  console.log(`${'='.repeat(60)}\n`);
  
  return imagenes;
}