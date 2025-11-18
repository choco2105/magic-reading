// API Route para obtener el progreso del usuario
import { NextResponse } from 'next/server';
import { obtenerProgreso, obtenerUsuario } from '@/lib/db/models';
import { evaluarSubidaNivel } from '@/lib/utils';

export async function GET(request) {
  try {
    // Obtener userId de los query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }
    
    console.log(`📊 Cargando progreso para usuario: ${userId}`);
    
    // Obtener progreso del usuario
    const progreso = await obtenerProgreso(userId, limit);
    
    if (!progreso.success) {
      console.warn('No se pudo obtener progreso:', progreso.error);
      // Retornar estructura vacía en lugar de error
      return NextResponse.json({
        success: true,
        data: {
          progreso: [],
          usuario: null,
          evaluacionNivel: {
            deberiaSubir: false,
            mensaje: 'Completa algunos cuentos para empezar'
          },
          estadisticas: {
            totalCuentos: 0,
            promedioAciertos: 0,
            totalPuntos: 0,
            cuentosCompletados: 0,
            mejorRacha: 0,
          }
        }
      });
    }
    
    // Obtener datos del usuario
    const usuario = await obtenerUsuario(userId);
    
    // Evaluar si debe subir de nivel
    const evaluacionNivel = evaluarSubidaNivel(
      progreso.data,
      usuario.data?.nivelActual || 'basico'
    );
    
    // Calcular estadísticas
    const estadisticas = calcularEstadisticas(progreso.data);
    
    console.log(`✅ Progreso cargado: ${progreso.data.length} registros`);
    
    return NextResponse.json({
      success: true,
      data: {
        progreso: progreso.data,
        usuario: usuario.data,
        evaluacionNivel,
        estadisticas,
      }
    });
    
  } catch (error) {
    console.error('❌ Error en /api/obtener-progreso:', error);
    
    // En lugar de error 500, retornar datos vacíos
    return NextResponse.json({
      success: true,
      data: {
        progreso: [],
        usuario: null,
        evaluacionNivel: {
          deberiaSubir: false,
          mensaje: 'Error al cargar datos'
        },
        estadisticas: {
          totalCuentos: 0,
          promedioAciertos: 0,
          totalPuntos: 0,
          cuentosCompletados: 0,
          mejorRacha: 0,
        }
      }
    });
  }
}

/**
 * Calcular estadísticas del progreso
 */
function calcularEstadisticas(progreso) {
  if (!progreso || progreso.length === 0) {
    return {
      totalCuentos: 0,
      promedioAciertos: 0,
      totalPuntos: 0,
      cuentosCompletados: 0,
      mejorRacha: 0,
    };
  }
  
  const totalCuentos = progreso.length;
  const cuentosCompletados = progreso.filter(p => p.completado).length;
  const totalPuntos = progreso.reduce((sum, p) => sum + (p.puntosObtenidos || 0), 0);
  
  // Calcular promedio de aciertos
  const sumaAciertos = progreso.reduce((sum, p) => {
    return sum + (p.respuestasCorrectas / p.totalPreguntas);
  }, 0);
  const promedioAciertos = Math.round((sumaAciertos / totalCuentos) * 100);
  
  // Calcular mejor racha (cuentos completados consecutivos)
  let rachaActual = 0;
  let mejorRacha = 0;
  progreso.forEach(p => {
    if (p.completado) {
      rachaActual++;
      mejorRacha = Math.max(mejorRacha, rachaActual);
    } else {
      rachaActual = 0;
    }
  });
  
  return {
    totalCuentos,
    promedioAciertos,
    totalPuntos,
    cuentosCompletados,
    mejorRacha,
  };
}