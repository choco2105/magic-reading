// Servicio para generar imágenes con IA basadas en descripciones del cuento

/**
 * Limpiar prompt para URLs seguras
 */
function limpiarPrompt(texto) {
  return texto
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, ' ')      // Normalizar espacios
    .trim()
    .substring(0, 200);         // Limitar longitud
}

/**
 * Generar imagen con Pollinations.ai (GRATIS, SIN API KEY)
 */
async function generarConPollinations(prompt, seed) {
  try {
    // Simplificar prompt para evitar caracteres problemáticos
    const promptSimple = limpiarPrompt(prompt);
    const promptMejorado = `childrens book illustration colorful friendly ${promptSimple} digital art vibrant safe for kids cartoon style`;
    
    // URL más simple y confiable
    const width = 800;
    const height = 600;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptMejorado)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
    
    console.log(`🎨 Generando imagen ${seed}...`);
    console.log(`   Prompt: "${promptSimple}"`);
    
    return {
      url: url,
      urlSmall: url,
      urlThumb: url,
      alt: prompt,
      autor: 'Pollinations AI',
      autorUrl: 'https://pollinations.ai',
      fuente: 'Pollinations',
      tipo: 'generada',
      seed: seed
    };
    
  } catch (error) {
    console.error('❌ Error con Pollinations:', error.message);
    return null;
  }
}

/**
 * Placeholder mejorado
 */
function generarPlaceholder(prompt, momento, seed) {
  const emojis = {
    inicio: '🌟',
    desarrollo: '✨',
    final: '🎉'
  };
  
  const colores = {
    inicio: { bg: '8b5cf6', fg: 'ffffff' },
    desarrollo: { bg: '3b82f6', fg: 'ffffff' },
    final: { bg: '10b981', fg: 'ffffff' }
  };
  
  const emoji = emojis[momento] || '📖';
  const color = colores[momento] || colores.inicio;
  
  return {
    url: `https://placehold.co/800x600/${color.bg}/${color.fg}?text=${emoji}+Ilustracion&font=roboto`,
    urlSmall: `https://placehold.co/400x300/${color.bg}/${color.fg}?text=${emoji}&font=roboto`,
    urlThumb: `https://placehold.co/200x150/${color.bg}/${color.fg}?text=${emoji}&font=roboto`,
    alt: prompt,
    autor: 'Magic Reading',
    autorUrl: '#',
    fuente: 'Placeholder',
    tipo: 'placeholder'
  };
}

/**
 * Generar UNA imagen con mejor manejo de errores
 */
export async function generarImagen(prompt, momento = 'inicio', index = 0) {
  const seed = Math.floor(Math.random() * 100000) + index * 1000;
  
  console.log(`\n🖼️  Imagen ${index + 1}: "${prompt.substring(0, 50)}..." (${momento})`);
  
  try {
    const imagen = await generarConPollinations(prompt, seed);
    
    if (imagen) {
      console.log(`   ✅ URL generada exitosamente\n`);
      return imagen;
    }
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
  
  console.log(`   ⚠️  Usando placeholder\n`);
  return generarPlaceholder(prompt, momento, seed);
}

/**
 * Generar MÚLTIPLES imágenes secuencialmente (más confiable que paralelo)
 */
export async function generarImagenes(imagenesArray) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🎨 GENERANDO ${imagenesArray.length} IMÁGENES CON IA`);
  console.log(`${'='.repeat(70)}`);
  
  const imagenes = [];
  
  for (let i = 0; i < imagenesArray.length; i++) {
    const item = imagenesArray[i];
    const prompt = item.descripcion || item.busqueda || `scene ${i + 1}`;
    
    const imagen = await generarImagen(prompt, item.momento, i);
    imagenes.push(imagen);
    
    // Pequeña pausa entre generaciones
    if (i < imagenesArray.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  const generadas = imagenes.filter(img => img.tipo === 'generada').length;
  const placeholders = imagenes.length - generadas;
  
  console.log(`\n✅ RESULTADO: ${generadas} generadas con IA, ${placeholders} placeholders`);
  console.log(`${'='.repeat(70)}\n`);
  
  return imagenes;
}