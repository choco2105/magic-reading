// 🎨 GENERADOR DE IMÁGENES CON DALL-E 3 (OpenAI)
// Usas la misma API key que ya tienes para GPT

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // La misma que ya tienes
});

/**
 * Generar imagen con DALL-E 3
 * Costo: $0.040 por imagen de 1024x1024
 * Calidad: EXCELENTE para cuentos infantiles
 */
export async function generarConDALLE3(prompt, size = '1024x1024', quality = 'standard') {
  try {
    console.log('🎨 Generando con DALL-E 3...');
    
    // Mejorar prompt para niños
    const promptMejorado = `Children's storybook illustration, friendly cartoon style, colorful and vibrant, safe for kids, high quality: ${prompt}`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: promptMejorado,
      n: 1,
      size: size, // '1024x1024', '1024x1792', '1792x1024'
      quality: quality, // 'standard' ($0.040) o 'hd' ($0.080)
      style: 'vivid' // 'vivid' (más creativo) o 'natural'
    });
    
    const imageUrl = response.data[0].url;
    
    console.log('✅ Imagen DALL-E generada');
    
    return {
      url: imageUrl,
      provider: 'DALL-E 3',
      model: 'dall-e-3',
      tipo: 'generada',
      costo: quality === 'hd' ? 0.080 : 0.040
    };
    
  } catch (error) {
    console.error('❌ Error con DALL-E:', error.message);
    
    // Fallback a Pollinations si falla
    return generarFallback(prompt);
  }
}

/**
 * Generar imagen con DALL-E 2 (más barato)
 * Costo: $0.020 por imagen de 1024x1024
 * Calidad: BUENA (menos detallada que DALL-E 3)
 */
export async function generarConDALLE2(prompt, size = '1024x1024') {
  try {
    console.log('🎨 Generando con DALL-E 2...');
    
    const promptMejorado = `Children's book illustration, cartoon style, colorful: ${prompt}`;
    
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: promptMejorado.substring(0, 1000), // DALL-E 2 límite 1000 chars
      n: 1,
      size: size // '256x256', '512x512', '1024x1024'
    });
    
    console.log('✅ Imagen DALL-E 2 generada');
    
    return {
      url: response.data[0].url,
      provider: 'DALL-E 2',
      model: 'dall-e-2',
      tipo: 'generada',
      costo: 0.020
    };
    
  } catch (error) {
    console.error('❌ Error con DALL-E 2:', error);
    return generarFallback(prompt);
  }
}

/**
 * Fallback gratuito si DALL-E falla
 */
function generarFallback(prompt) {
  const seed = prompt.length + Date.now();
  const promptSimple = prompt.split(' ').slice(0, 10).join(' ');
  
  return {
    url: `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSimple)}?width=1024&height=768&seed=${seed}&nologo=true`,
    provider: 'Pollinations (Fallback)',
    tipo: 'fallback',
    costo: 0
  };
}

/**
 * ESTRATEGIA HÍBRIDA: DALL-E + Pollinations
 * - Imagen principal (inicio): DALL-E 3 (alta calidad)
 * - Imágenes secundarias: Pollinations (gratis)
 * - Final: SVG personalizado
 * 
 * Costo total: ~$0.04 por cuento (solo 1 imagen DALL-E)
 */
export async function generarImagenesHibridas(imagenesArray, personajes = []) {
  const imagenes = [];
  
  for (let i = 0; i < imagenesArray.length; i++) {
    const item = imagenesArray[i];
    let imagen;
    
    if (i === 0 && item.momento === 'inicio') {
      // Primera imagen: DALL-E 3 (mejor calidad)
      imagen = await generarConDALLE3(item.descripcion, '1024x1024', 'standard');
      
    } else if (item.momento === 'final') {
      // Última imagen: SVG personalizado (gratis)
      imagen = generarSVGCelebracion(item.descripcion, personajes);
      
    } else {
      // Resto: Pollinations (gratis)
      const seed = 1000 + i;
      imagen = {
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(item.descripcion)}?width=1024&height=768&seed=${seed}&nologo=true&model=flux`,
        provider: 'Pollinations',
        tipo: 'generada',
        costo: 0
      };
    }
    
    imagenes.push({
      ...imagen,
      alt: item.descripcion,
      momento: item.momento
    });
  }
  
  const costoTotal = imagenes.reduce((sum, img) => sum + (img.costo || 0), 0);
  console.log(`💰 Costo total imágenes: $${costoTotal.toFixed(3)}`);
  
  return imagenes;
}

/**
 * ESTRATEGIA TODO GRATIS: Solo Pollinations + SVG
 * Costo: $0
 */
export async function generarImagenesGratis(imagenesArray, personajes = []) {
  const imagenes = [];
  
  for (let i = 0; i < imagenesArray.length; i++) {
    const item = imagenesArray[i];
    const seed = 1000 + i;
    
    let imagen;
    
    if (item.momento === 'final') {
      // Final: SVG personalizado
      imagen = generarSVGCelebracion(item.descripcion, personajes);
    } else {
      // Resto: Pollinations mejorado
      const promptMejorado = `children's book illustration, cute style, ${item.descripcion}`;
      imagen = {
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(promptMejorado)}?width=1024&height=768&seed=${seed}&nologo=true&enhance=true&model=flux`,
        provider: 'Pollinations AI',
        tipo: 'generada',
        costo: 0
      };
    }
    
    imagenes.push({
      ...imagen,
      alt: item.descripcion,
      momento: item.momento
    });
  }
  
  console.log('✅ Todas las imágenes generadas GRATIS');
  return imagenes;
}

/**
 * SVG Celebración personalizado
 */
function generarSVGCelebracion(titulo, personajes) {
  const personajesTexto = personajes.map(p => p.nombre).join(' & ');
  
  const svg = `
<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-final" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="1024" height="768" fill="url(#grad-final)"/>
  
  <!-- Estrellas decorativas -->
  <text x="100" y="100" font-size="60" filter="url(#glow)">⭐</text>
  <text x="900" y="150" font-size="50" filter="url(#glow)">✨</text>
  <text x="150" y="650" font-size="55" filter="url(#glow)">💫</text>
  <text x="850" y="700" font-size="50" filter="url(#glow)">🌟</text>
  
  <!-- Emoji principal -->
  <text x="512" y="300" font-size="200" text-anchor="middle" filter="url(#glow)">🎉</text>
  
  <!-- Texto -->
  <text x="512" y="430" font-size="48" font-weight="bold" text-anchor="middle" fill="white" filter="url(#glow)">¡Final Feliz!</text>
  <text x="512" y="500" font-size="32" text-anchor="middle" fill="white" opacity="0.9">${personajesTexto}</text>
  
  <!-- Confeti -->
  <circle cx="200" cy="200" r="8" fill="#ff6b6b"/>
  <circle cx="824" cy="250" r="6" fill="#4ecdc4"/>
  <circle cx="300" cy="500" r="7" fill="#ffe66d"/>
  <circle cx="724" cy="500" r="9" fill="#a8e6cf"/>
</svg>
  `.trim();
  
  return {
    url: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
    provider: 'SVG Personalizado',
    tipo: 'svg',
    costo: 0
  };
}

/**
 * CONFIGURACIÓN RECOMENDADA
 */
export const ESTRATEGIAS = {
  // Mejor calidad (costo: ~$0.04/cuento)
  premium: generarImagenesHibridas,
  
  // 100% gratis
  gratis: generarImagenesGratis,
  
  // Solo DALL-E (costo: ~$0.12/cuento)
  dalle_solo: async (imagenesArray) => {
    return Promise.all(
      imagenesArray.map(item => generarConDALLE3(item.descripcion))
    );
  }
};

// Exportar estrategia por defecto
export default ESTRATEGIAS.gratis; // Cambia a 'premium' si quieres usar DALL-E