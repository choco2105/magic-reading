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
 * Limpiar datos antes de guardar en Firebase
 * Elimina campos que empiezan/terminan con __ y otros caracteres prohibidos
 */
function limpiarDatosFirebase(datos) {
  if (!datos || typeof datos !== 'object') return datos;
  
  if (Array.isArray(datos)) {
    return datos.map(item => limpiarDatosFirebase(item));
  }
  
  const datosLimpios = {};
  
  for (const [key, value] of Object.entries(datos)) {
    // Ignorar campos que empiezan/terminan con __
    if (key.startsWith('__') || key.endsWith('__')) {
      console.warn(`⚠️ Campo ignorado (inválido para Firebase): ${key}`);
      continue;
    }
    
    // Limpiar recursivamente si es objeto o array
    if (value && typeof value === 'object') {
      datosLimpios[key] = limpiarDatosFirebase(value);
    } else {
      datosLimpios[key] = value;
    }
  }
  
  return datosLimpios;
}

export async function guardarCuento(userId, cuentoData) {
  try {
    const cuentoRef = doc(collection(db, 'cuentos'));
    const timestamp = Timestamp.now();
    
    // Limpiar datos antes de guardar
    const datosLimpios = limpiarDatosFirebase({
      userId,
      titulo: cuentoData.titulo,
      contenido: cuentoData.contenido,
      nivel: cuentoData.nivel,
      tema: cuentoData.tema,
      preguntas: cuentoData.preguntas,
      personajes: cuentoData.personajes || [],
      fecha: timestamp,
    });
    
    console.log('💾 Guardando cuento en Firebase...');
    
    await setDoc(cuentoRef, datosLimpios);
    
    console.log(`✅ Cuento guardado con ID: ${cuentoRef.id}`);
    
    return { success: true, cuentoId: cuentoRef.id };
  } catch (error) {
    console.error('❌ Error al guardar cuento:', error);
    console.error('Detalles:', error.code, error.message);
    throw new Error('No se pudo guardar el cuento');
  }
}

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