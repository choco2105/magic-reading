// API Route para generar cuentos con OpenAI + imágenes DALL-E
import { NextResponse } from 'next/server';
import { generarCuentoRapido } from '@/lib/openai';
import { guardarCuento } from '@/lib/db/models';
import { generarImagenesHibridas } from '@/lib/generador-imagenes';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nivel, tema, userId } = body;
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🎨 GENERANDO CUENTO CON GPT-4O-MINI + DALL-E`);
    console.log(`   Nivel: ${nivel}`);
    console.log(`   Tema: ${tema || 'aleatorio'}`);
    console.log(`   Usuario: ${userId}`);
    console.log(`${'='.repeat(70)}\n`);
    
    if (!nivel || !['basico', 'intermedio', 'avanzado'].includes(nivel)) {
      return NextResponse.json(
        { success: false, error: 'Nivel inválido' },
        { status: 400 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no identificado' },
        { status: 400 }
      );
    }
    
    // PASO 1: Generar cuento con GPT-4o-mini (RÁPIDO)
    console.log('⚡ PASO 1: Generando cuento con GPT-4o-mini...\n');
    const resultado = await generarCuentoRapido(nivel, tema);
    
    if (!resultado.success) {
      throw new Error('Error al generar cuento');
    }
    
    console.log('✅ CUENTO GENERADO:');
    console.log(`   Título: ${resultado.data.titulo}`);
    console.log(`   Personajes: ${resultado.data.personajes?.map(p => p.nombre).join(', ')}`);
    console.log(`   Tiempo: ${resultado.data.metadata?.tiempoGeneracion}ms`);
    console.log(`   Tokens: ${resultado.data.metadata?.tokens}`);
    
    // PASO 2: Generar imágenes con DALL-E (estrategia híbrida)
    console.log('\n🎨 PASO 2: Generando imágenes...');
    console.log('   - Imagen principal: DALL-E 3 ($0.04)');
    console.log('   - Imagen secundaria: Pollinations (gratis)');
    console.log('   - Imagen final: SVG personalizado (gratis)\n');
    
    const imagenesGeneradas = await generarImagenesHibridas(
      resultado.data.imagenes || [],
      resultado.data.personajes || []
    );
    
    console.log(`✅ ${imagenesGeneradas.length} imágenes generadas`);
    imagenesGeneradas.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.provider} - ${img.momento} - $${img.costo}`);
    });
    
    // Calcular costo total
    const costoTotal = imagenesGeneradas.reduce((sum, img) => sum + (img.costo || 0), 0);
    console.log(`\n💰 Costo total imágenes: $${costoTotal.toFixed(3)}`);
    
    // PASO 3: Combinar todo
    const cuentoCompleto = {
      ...resultado.data,
      imagenes: imagenesGeneradas
    };
    
    // PASO 4: Guardar en BD
    console.log('\n💾 PASO 3: Guardando en base de datos...');
    const cuentoGuardado = await guardarCuento(userId, {
      ...cuentoCompleto,
      nivel,
      tema: tema || resultado.data.tema,
    });
    
    console.log(`✅ Guardado con ID: ${cuentoGuardado.cuentoId}`);
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ CUENTO COMPLETO GENERADO EXITOSAMENTE`);
    console.log(`   Tiempo total: ${resultado.data.metadata?.tiempoGeneracion}ms`);
    console.log(`   Costo: $${costoTotal.toFixed(3)}`);
    console.log(`${'='.repeat(70)}\n`);
    
    return NextResponse.json({
      success: true,
      data: {
        ...cuentoCompleto,
        id: cuentoGuardado.cuentoId,
      }
    });
    
  } catch (error) {
    console.error('\n❌ ERROR EN GENERACIÓN:');
    console.error(error);
    console.error(`\n${'='.repeat(70)}\n`);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al generar el cuento'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}