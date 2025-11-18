// Servicio simplificado para generar imágenes con IA

/**
 * Generar imagen usando el API endpoint (más confiable)
 */
async function generarImagenLocal(prompt, momento, index) {
  try {
    console.log(`🎨 Generando imagen ${index + 1}: "${prompt.substring(0, 50)}..."`);
    
    // Simplificar el prompt drásticamente
    const palabrasClave = prompt
      .split(' ')
      .filter(p => p.length > 3)
      .slice(0, 10)
      .join(' ');
    
    const promptSimple = `children book ${palabrasClave} colorful illustration`;
    const seed = 1000 + index;
    
    // Construir URL más simple
    const params = new URLSearchParams({
      prompt: promptSimple,
      width: '800',
      height: '600',
      seed: seed.toString(),
      nologo: 'true'
    });
    
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSimple)}?${params}`;
    
    console.log(`   ✅ URL generada`);
    
    return {
      url: url,
      urlSmall: url,
      urlThumb: url,
      alt: prompt,
      autor: 'IA Generativa',
      autorUrl: '#',
      fuente: 'Pollinations',
      tipo: 'generada',
      momento: momento
    };
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return generarPlaceholder(prompt, momento, index);
  }
}

/**
 * Placeholder mejorado con emojis según el tema
 */
function generarPlaceholder(prompt, momento, index) {
  const configs = {
    inicio: { emoji: '🌟', bg: '8b5cf6', nombre: 'Inicio' },
    desarrollo: { emoji: '✨', bg: '3b82f6', nombre: 'Aventura' },
    final: { emoji: '🎉', bg: '10b981', nombre: 'Final' }
  };
  
  const config = configs[momento] || configs.inicio;
  
  return {
    url: `https://placehold.co/800x600/${config.bg}/ffffff?text=${config.emoji}+${config.nombre}&font=roboto`,
    urlSmall: `https://placehold.co/400x300/${config.bg}/ffffff?text=${config.emoji}&font=roboto`,
    urlThumb: `https://placehold.co/200x150/${config.bg}/ffffff?text=${config.emoji}&font=roboto`,
    alt: prompt,
    autor: 'Magic Reading',
    autorUrl: '#',
    fuente: 'Placeholder',
    tipo: 'placeholder',
    momento: momento
  };
}

/**
 * Generar MÚLTIPLES imágenes
 */
export async function generarImagenes(imagenesArray) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🎨 GENERANDO ${imagenesArray.length} ILUSTRACIONES`);
  console.log(`${'='.repeat(70)}`);
  
  const imagenes = [];
  
  for (let i = 0; i < imagenesArray.length; i++) {
    const item = imagenesArray[i];
    
    // Usar descripción o busqueda, lo que esté disponible
    const prompt = item.descripcion || item.busqueda || `scene ${i + 1}`;
    
    const imagen = await generarImagenLocal(prompt, item.momento, i);
    imagenes.push(imagen);
    
    // Pausa entre generaciones
    if (i < imagenesArray.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  const generadas = imagenes.filter(img => img.tipo === 'generada').length;
  
  console.log(`\n✅ ${generadas}/${imagenesArray.length} imágenes generadas`);
  console.log(`${'='.repeat(70)}\n`);
  
  return imagenes;
}

/**
 * Generar una sola imagen
 */
export async function generarImagen(prompt, momento = 'inicio', index = 0) {
  return generarImagenLocal(prompt, momento, index);
}