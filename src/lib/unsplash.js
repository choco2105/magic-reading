// Servicio para buscar imágenes en Unsplash

/**
 * Buscar imagen en Unsplash
 * @param {string} query - Términos de búsqueda
 * @param {string} orientation - portrait, landscape, squarish
 * @returns {Promise<Object>} Datos de la imagen
 */
export async function buscarImagen(query, orientation = 'landscape') {
  try {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      console.error('❌ Falta NEXT_PUBLIC_UNSPLASH_ACCESS_KEY en .env.local');
      return null;
    }
    
    // ✅ MEJORADO: Agregar palabras clave para obtener ilustraciones
    const querySegura = `${query} illustration cartoon drawing artwork colorful kids`;
    
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(querySegura)}&per_page=5&orientation=${orientation}&content_filter=high`;
    
    console.log(`🔍 Buscando imagen: "${querySegura}"`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error de Unsplash (${response.status}):`, errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // ✅ Buscar la más apropiada para niños (la primera suele ser la mejor)
      const imagen = data.results[0];
      
      console.log(`✅ Imagen encontrada: ${imagen.urls.regular}`);
      
      return {
        url: imagen.urls.regular,
        urlSmall: imagen.urls.small,
        urlThumb: imagen.urls.thumb,
        alt: imagen.alt_description || query,
        autor: imagen.user.name,
        autorUrl: imagen.user.links.html,
        downloadUrl: imagen.links.download_location
      };
    }
    
    console.warn(`⚠️ No se encontraron imágenes para: "${querySegura}"`);
    return null;
    
  } catch (error) {
    console.error('❌ Error buscando imagen:', error);
    return null;
  }
}

/**
 * Buscar múltiples imágenes
 * @param {Array<string>} queries - Array de búsquedas
 * @returns {Promise<Array<Object>>} Array de imágenes
 */
export async function buscarImagenes(queries) {
  try {
    console.log(`📸 Buscando ${queries.length} imágenes...`);
    const promesas = queries.map(query => buscarImagen(query));
    const imagenes = await Promise.all(promesas);
    const imagenesValidas = imagenes.filter(img => img !== null);
    console.log(`✅ ${imagenesValidas.length}/${queries.length} imágenes encontradas`);
    return imagenesValidas;
  } catch (error) {
    console.error('❌ Error buscando imágenes:', error);
    return [];
  }
}

/**
 * Registrar descarga en Unsplash (requerido por sus términos)
 * @param {string} downloadUrl - URL de descarga de la imagen
 */
export async function registrarDescarga(downloadUrl) {
  try {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey || !downloadUrl) return;
    
    await fetch(downloadUrl, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      }
    });
  } catch (error) {
    console.error('Error registrando descarga:', error);
  }
}