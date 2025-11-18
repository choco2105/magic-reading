// Modelos y operaciones CRUD para Firebase Firestore
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== USUARIOS ====================

/**
 * Crear o actualizar un usuario
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos del usuario
 */
export async function crearUsuario(userId, userData) {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const timestamp = Timestamp.now();
    
    await setDoc(userRef, {
      ...userData,
      nivelActual: userData.nivelActual || 'basico',
      puntosTotal: userData.puntosTotal || 0,
      cuentosCompletados: userData.cuentosCompletados || 0,
      fechaCreacion: timestamp,
      ultimaActividad: timestamp,
    }, { merge: true });
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw new Error('No se pudo crear el usuario');
  }
}

/**
 * Obtener datos de un usuario
 * @param {string} userId - ID del usuario
 */
export async function obtenerUsuario(userId) {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
    } else {
      return { success: false, error: 'Usuario no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw new Error('No se pudo obtener el usuario');
  }
}

// ==================== PROGRESO ====================

/**
 * Guardar progreso de un cuento
 * @param {string} userId - ID del usuario
 * @param {Object} progresoData - Datos del progreso
 */
export async function guardarProgreso(userId, progresoData) {
  try {
    const progresoRef = doc(collection(db, 'progreso'));
    const timestamp = Timestamp.now();
    
    const progreso = {
      userId,
      cuentoId: progresoData.cuentoId,
      nivel: progresoData.nivel,
      tema: progresoData.tema,
      puntosObtenidos: progresoData.puntosObtenidos,
      respuestasCorrectas: progresoData.respuestasCorrectas,
      respuestasIncorrectas: progresoData.respuestasIncorrectas,
      totalPreguntas: progresoData.totalPreguntas,
      tiempoCompletado: progresoData.tiempoCompletado || 0,
      completado: progresoData.completado || false,
      fecha: timestamp,
    };
    
    await setDoc(progresoRef, progreso);
    
    // Actualizar estadísticas del usuario
    await actualizarEstadisticasUsuario(userId, progreso);
    
    return { success: true, progresoId: progresoRef.id };
  } catch (error) {
    console.error('Error al guardar progreso:', error);
    throw new Error('No se pudo guardar el progreso');
  }
}

/**
 * Actualizar estadísticas generales del usuario
 * @param {string} userId - ID del usuario
 * @param {Object} progreso - Datos del progreso completado
 */
async function actualizarEstadisticasUsuario(userId, progreso) {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const nuevosPuntos = (userData.puntosTotal || 0) + progreso.puntosObtenidos;
      const nuevosCuentos = (userData.cuentosCompletados || 0) + (progreso.completado ? 1 : 0);
      
      await updateDoc(userRef, {
        puntosTotal: nuevosPuntos,
        cuentosCompletados: nuevosCuentos,
        ultimaActividad: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error);
  }
}

/**
 * Obtener progreso del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limitResults - Límite de resultados (default: 10)
 */
export async function obtenerProgreso(userId, limitResults = 10) {
  try {
    const progresoQuery = query(
      collection(db, 'progreso'),
      where('userId', '==', userId),
      orderBy('fecha', 'desc'),
      limit(limitResults)
    );
    
    const querySnapshot = await getDocs(progresoQuery);
    const progreso = [];
    
    querySnapshot.forEach((doc) => {
      progreso.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: progreso };
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    throw new Error('No se pudo obtener el progreso');
  }
}

// ==================== HISTORIAL DE CUENTOS ====================

/**
 * Guardar un cuento generado
 * @param {string} userId - ID del usuario
 * @param {Object} cuentoData - Datos del cuento
 */
export async function guardarCuento(userId, cuentoData) {
  try {
    const cuentoRef = doc(collection(db, 'cuentos'));
    const timestamp = Timestamp.now();
    
    await setDoc(cuentoRef, {
      userId,
      titulo: cuentoData.titulo,
      contenido: cuentoData.contenido,
      nivel: cuentoData.nivel,
      tema: cuentoData.tema,
      preguntas: cuentoData.preguntas,
      personajes: cuentoData.personajes || [],
      fecha: timestamp,
    });
    
    return { success: true, cuentoId: cuentoRef.id };
  } catch (error) {
    console.error('Error al guardar cuento:', error);
    throw new Error('No se pudo guardar el cuento');
  }
}

/**
 * Obtener historial de cuentos del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limitResults - Límite de resultados
 */
export async function obtenerHistorialCuentos(userId, limitResults = 20) {
  try {
    const cuentosQuery = query(
      collection(db, 'cuentos'),
      where('userId', '==', userId),
      orderBy('fecha', 'desc'),
      limit(limitResults)
    );
    
    const querySnapshot = await getDocs(cuentosQuery);
    const cuentos = [];
    
    querySnapshot.forEach((doc) => {
      cuentos.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: cuentos };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    throw new Error('No se pudo obtener el historial');
  }
}

/**
 * Obtener un cuento específico por ID
 * @param {string} cuentoId - ID del cuento
 */
export async function obtenerCuento(cuentoId) {
  try {
    const cuentoRef = doc(db, 'cuentos', cuentoId);
    const cuentoSnap = await getDoc(cuentoRef);
    
    if (cuentoSnap.exists()) {
      return { success: true, data: { id: cuentoSnap.id, ...cuentoSnap.data() } };
    } else {
      return { success: false, error: 'Cuento no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener cuento:', error);
    throw new Error('No se pudo obtener el cuento');
  }
}