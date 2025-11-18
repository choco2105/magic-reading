// API Route para guardar el progreso del usuario
import { NextResponse } from 'next/server';
import { guardarProgreso } from '@/lib/db/models';
import { calcularPuntos } from '@/lib/utils';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      cuentoId,
      nivel,
      tema,
      respuestasCorrectas,
      respuestasIncorrectas,
      totalPreguntas,
      tiempoCompletado,
    } = body;
    
    // Validación de datos requeridos
    if (!userId || !cuentoId || !nivel) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }
    
    // Validar que los números sean correctos
    if (
      respuestasCorrectas < 0 ||
      respuestasIncorrectas < 0 ||
      (respuestasCorrectas + respuestasIncorrectas) > totalPreguntas
    ) {
      return NextResponse.json(
        { success: false, error: 'Datos de respuestas inválidos' },
        { status: 400 }
      );
    }
    
    // Calcular puntos obtenidos
    const puntosObtenidos = calcularPuntos(
      respuestasCorrectas,
      totalPreguntas,
      nivel
    );
    
    // Determinar si completó el cuento (mínimo 60% de respuestas correctas)
    const porcentajeAciertos = (respuestasCorrectas / totalPreguntas) * 100;
    const completado = porcentajeAciertos >= 60;
    
    // Guardar progreso en base de datos
    const resultado = await guardarProgreso(userId, {
      cuentoId,
      nivel,
      tema,
      puntosObtenidos,
      respuestasCorrectas,
      respuestasIncorrectas,
      totalPreguntas,
      tiempoCompletado: tiempoCompletado || 0,
      completado,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        progresoId: resultado.progresoId,
        puntosObtenidos,
        completado,
        porcentajeAciertos: Math.round(porcentajeAciertos),
        mensaje: completado 
          ? '¡Felicidades! Has completado el cuento' 
          : 'Sigue intentando, puedes hacerlo mejor',
      }
    });
    
  } catch (error) {
    console.error('Error en /api/guardar-progreso:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al guardar el progreso' 
      },
      { status: 500 }
    );
  }
}