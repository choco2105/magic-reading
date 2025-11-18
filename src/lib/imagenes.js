// Servicio unificado para buscar imágenes apropiadas para niños

/**
 * Buscar imagen en Pixabay (mejor para ilustraciones)
 */
async function buscarEnPixabay(query) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Falta PIXABAY_API_KEY');
      return null;
    }
    
    // Búsqueda específica de ilustraciones
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=illustration&category=education&safesearch=true&per_page=5&lang=en`;
    
    console.log(`🔍 Buscando en Pixabay: "${query}"`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`❌ Pixabay error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      const imagen = data.hits[0];
      console.log(`✅ Imagen Pixabay encontrada`);
      
      return {
        url: imagen.largeImageURL || imagen.webformatURL,
        urlSmall: imagen.webformatURL,
        urlThumb: imagen.previewURL,
        alt: query,
        autor: imagen.user || 'Pixabay',
        autorUrl: `https://pixabay.com/users/${imagen.user}-${imagen.user_id}/`,
        fuente: 'Pixabay'
      };
    }
    
    console.warn(`⚠️ No se encontraron resultados en Pixabay para: "${query}"`);
    return null;
    
  } catch (error) {
    console.error('❌ Error en Pixabay:', error.message);
    return null;
  }
}

/**
 * Buscar imagen en Pexels (alternativa)
 */
async function buscarEnPexels(query) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Falta PEXELS_API_KEY');
      return null;
    }
    
    const queryMejorado = `${query} illustration cartoon children`;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(queryMejorado)}&per_page=5&orientation=landscape`;
    
    console.log(`🔍 Buscando en Pexels: "${queryMejorado}"`);
    
    const response = await fetch(url, {
      headers: { 'Authorization': apiKey }
    });
    
    if (!response.ok) {
      console.error(`❌ Pexels error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      const foto = data.photos[0];
      console.log(`✅ Imagen Pexels encontrada`);
      
      return {
        url: foto.src.large,
        urlSmall: foto.src.medium,
        urlThumb: foto.src.small,
        alt: query,
        autor: foto.photographer || 'Pexels',
        autorUrl: foto.photographer_url || 'https://pexels.com',
        fuente: 'Pexels'
      };
    }
    
    console.warn(`⚠️ No se encontraron resultados en Pexels para: "${queryMejorado}"`);
    return null;
    
  } catch (error) {
    console.error('❌ Error en Pexels:', error.message);
    return null;
  }
}

/**
 * Generar imagen placeholder colorida e ilustrada
 */
function generarPlaceholder(query, momento) {
  const colores = {
    inicio: { bg: '8b5cf6', fg: 'ffffff' }, // Morado
    desarrollo: { bg: 'f59e0b', fg: 'ffffff' }, // Naranja
    final: { bg: '10b981', fg: 'ffffff' } // Verde
  };
  
  const color = colores[momento] || { bg: '8b5cf6', fg: 'ffffff' };
  const textoCorto = query.split(' ').slice(0, 3).join('+');
  
  console.log(`🎨 Generando placeholder para: "${query}"`);
  
  return {
    url: `https://placehold.co/800x600/${color.bg}/${color.fg}?text=${encodeURIComponent(textoCorto)}&font=roboto`,
    urlSmall: `https://placehold.co/400x300/${color.bg}/${color.fg}?text=${encodeURIComponent(textoCorto)}&font=roboto`,
    urlThumb: `https://placehold.co/200x150/${color.bg}/${color.fg}?text=${encodeURIComponent(textoCorto)}&font=roboto`,
    alt: query,
    autor: 'Magic Reading',
    autorUrl: '#',
    fuente: 'Placeholder'
  };
}

/**
 * Buscar imagen en múltiples fuentes (cascada con fallback)
 */
export async function buscarImagen(query, momento = 'inicio') {
  console.log(`\n🔍 Iniciando búsqueda: "${query}" (${momento})`);
  
  // Intentar Pixabay primero (mejor para ilustraciones)
  let imagen = await buscarEnPixabay(query);
  if (imagen) {
    console.log(`✅ Usando imagen de Pixabay\n`);
    return imagen;
  }
  
  // Si falla, intentar Pexels
  imagen = await buscarEnPexels(query);
  if (imagen) {
    console.log(`✅ Usando imagen de Pexels\n`);
    return imagen;
  }
  
  // Si todo falla, usar placeholder
  console.log(`⚠️ Usando placeholder\n`);
  return generarPlaceholder(query, momento);
}

/**
 * Buscar múltiples imágenes en paralelo
 */
export async function buscarImagenes(busquedasArray) {
  console.log(`\n📸 ========== BUSCANDO ${busquedasArray.length} IMÁGENES ==========`);
  
  const promesas = busquedasArray.map(item => 
    buscarImagen(item.busqueda, item.momento)
  );
  
  const imagenes = await Promise.all(promesas);
  
  const exitosas = imagenes.filter(img => img && img.fuente !== 'Placeholder').length;
  console.log(`\n✅ ========== RESULTADO: ${exitosas}/${busquedasArray.length} reales, ${busquedasArray.length - exitosas} placeholders ==========\n`);
  
  return imagenes;
}