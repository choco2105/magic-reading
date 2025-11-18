// API Route para generar cuentos con OpenAI e imágenes generadas por IA
import { NextResponse } from 'next/server';
import { generarCuento } from '@/lib/openai';
import { guardarCuento } from '@/lib/db/models';
import { generarImagenes } from '@/lib/generador-imagenes';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nivel, tema, userId } = body;
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🎨 INICIANDO GENERACIÓN DE CUENTO CON IMÁGENES IA`);
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
    
    // PASO 1: Generar cuento con OpenAI
    console.log('📝 PASO 1: Generando cuento con OpenAI...\n');
    const resultado = await generarCuento(nivel, tema);
    
    if (!resultado.success) {
      throw new Error('Error al generar cuento');
    }
    
    console.log('✅ CUENTO GENERADO:');
    console.log(`   Título: ${resultado.data.titulo}`);
    console.log(`   Personajes: ${resultado.data.personajes?.map(p => p.nombre).join(', ')}`);
    console.log(`   Descripciones de imágenes: ${resultado.data.imagenes?.length || 0}`);
    
    // PASO 2: Generar imágenes con IA
    console.log('\n📸 PASO 2: Generando imágenes con IA...\n');
    const imagenesGeneradas = await generarImagenes(resultado.data.imagenes || []);
    
    // PASO 3: Combinar todo
    const cuentoCompleto = {
      ...resultado.data,
      imagenes: resultado.data.imagenes?.map((img, index) => ({
        ...img,
        ...imagenesGeneradas[index],
      })) || imagenesGeneradas
    };
    
    console.log(`✅ ${cuentoCompleto.imagenes.length} imágenes listas\n`);
    
    // PASO 4: Guardar en BD
    console.log('💾 PASO 3: Guardando en base de datos...');
    const cuentoGuardado = await guardarCuento(userId, {
      ...cuentoCompleto,
      nivel,
      tema: tema || resultado.data.tema,
    });
    
    console.log(`✅ Guardado con ID: ${cuentoGuardado.cuentoId}`);
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ CUENTO COMPLETO GENERADO EXITOSAMENTE`);
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