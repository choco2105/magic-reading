// API Route para obtener el historial de cuentos
import { NextResponse } from 'next/server';
import { obtenerHistorialCuentos } from '@/lib/db/models';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 20;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }
    
    // Obtener historial de cuentos
    const historial = await obtenerHistorialCuentos(userId, limit);
    
    if (!historial.success) {
      return NextResponse.json(
        { success: false, error: 'Error al obtener historial' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: historial.data,
    });
    
  } catch (error) {
    console.error('Error en /api/historial:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener el historial' 
      },
      { status: 500 }
    );
  }
}