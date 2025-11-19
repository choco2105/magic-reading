// Generador de imágenes OPTIMIZADO con DALL-E 3
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generar TODAS las imágenes con DALL-E 3 EN PARALELO
 * Tiempo: ~5-7 segundos (vs 15-20 segundos secuencial)
 * Costo: $0.12 por cuento (3 imágenes × $0.04)
 */
export async function generarImagenesHibridas(imagenesArray, personajes = []) {
  console.log('\n🎨 Generando imágenes con DALL-E 3 (paralelo)...');
  
  // Generar TODAS las imágenes al mismo tiempo
  const promesas = imagenesArray.map(async (item, i) => {
    try {
      console.log(`   ${i + 1}/${imagenesArray.length}: ${item.momento}...`);
      
      const promptMejorado = `Children's storybook illustration, vibrant watercolor style, friendly and safe for kids, high quality, detailed: ${item.prompt || item.descripcion}`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: promptMejorado,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      });
      
      console.log(`   ✅ Imagen ${i + 1} generada`);
      
      return {
        url: response.data[0].url,
        alt: item.descripcion || item.prompt,
        momento: item.momento,
        provider: 'DALL-E 3',
        costo: 0.04
      };
      
    } catch (error) {
      console.error(`   ❌ Error en imagen ${i + 1}:`, error.message);
      
      return {
        url: generarSVGFallback(item.momento, personajes),
        alt: item.descripcion || item.prompt,
        momento: item.momento,
        provider: 'SVG Fallback',
        costo: 0
      };
    }
  });
  
  // Esperar a que TODAS terminen
  const imagenes = await Promise.all(promesas);
  
  const costoTotal = imagenes.reduce((sum, img) => sum + img.costo, 0);
  console.log(`\n💰 Costo total: $${costoTotal.toFixed(3)}`);
  console.log(`✅ ${imagenes.length} imágenes generadas en paralelo\n`);
  
  return imagenes;
}

/**
 * SVG de respaldo (solo si DALL-E falla)
 */
function generarSVGFallback(momento, personajes) {
  const emojis = {
    inicio: '🌅',
    desarrollo: '✨',
    final: '🎉'
  };
  
  const nombres = personajes.map(p => p.nombre).join(' & ') || 'Aventura';
  const emoji = emojis[momento] || '📖';
  
  const svg = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#grad)"/>
  <text x="512" y="450" font-size="200" text-anchor="middle">${emoji}</text>
  <text x="512" y="600" font-size="48" text-anchor="middle" fill="white" font-weight="bold">${nombres}</text>
  <text x="512" y="660" font-size="32" text-anchor="middle" fill="white" opacity="0.9">${momento}</text>
</svg>`;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export default generarImagenesHibridas;