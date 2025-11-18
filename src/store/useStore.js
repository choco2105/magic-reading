// Store global de la aplicación usando Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // ============ ESTADO DEL USUARIO ============
      usuario: null,
      
      setUsuario: (usuario) => set({ usuario }),
      
      cerrarSesion: () => set({ 
        usuario: null, 
        cuentoActual: null,
        progresoActual: null 
      }),
      
      // ============ CUENTO ACTUAL ============
      cuentoActual: null,
      
      setCuentoActual: (cuento) => {
        // Validar que el cuento tenga los datos mínimos necesarios
        if (!cuento || !cuento.titulo || !cuento.contenido || !cuento.preguntas) {
          console.error('❌ Intento de guardar cuento inválido:', cuento);
          return;
        }
        
        // Validar que las preguntas tengan formato correcto
        const preguntasValidas = cuento.preguntas.every(p => 
          p && p.pregunta && p.opciones && Array.isArray(p.opciones) && p.opciones.length === 4
        );
        
        if (!preguntasValidas) {
          console.error('❌ Preguntas del cuento inválidas');
          return;
        }
        
        console.log('✅ Guardando cuento válido en el store');
        set({ cuentoActual: cuento });
      },
      
      limpiarCuento: () => set({ cuentoActual: null, progresoActual: null }),
      
      // ============ PROGRESO ACTUAL ============
      progresoActual: {
        respuestasCorrectas: 0,
        respuestasIncorrectas: 0,
        preguntasRespondidas: [],
        tiempoInicio: null,
      },
      
      iniciarProgreso: () => set({
        progresoActual: {
          respuestasCorrectas: 0,
          respuestasIncorrectas: 0,
          preguntasRespondidas: [],
          tiempoInicio: Date.now(),
        }
      }),
      
      registrarRespuesta: (preguntaIndex, esCorrecta) => {
        const progreso = get().progresoActual;
        set({
          progresoActual: {
            ...progreso,
            respuestasCorrectas: esCorrecta 
              ? progreso.respuestasCorrectas + 1 
              : progreso.respuestasCorrectas,
            respuestasIncorrectas: !esCorrecta 
              ? progreso.respuestasIncorrectas + 1 
              : progreso.respuestasIncorrectas,
            preguntasRespondidas: [...progreso.preguntasRespondidas, preguntaIndex],
          }
        });
      },
      
      // ============ CONFIGURACIÓN ============
      configuracion: {
        sonidoActivado: true,
        animacionesActivadas: true,
        velocidadLectura: 'normal',
      },
      
      actualizarConfiguracion: (nuevaConfig) => set({
        configuracion: { ...get().configuracion, ...nuevaConfig }
      }),
      
      // ============ UI STATE ============
      cargando: false,
      setCargando: (estado) => set({ cargando: estado }),
      
      modal: {
        abierto: false,
        tipo: null,
        contenido: null,
      },
      
      abrirModal: (tipo, contenido) => set({
        modal: { abierto: true, tipo, contenido }
      }),
      
      cerrarModal: () => set({
        modal: { abierto: false, tipo: null, contenido: null }
      }),
    }),
    {
      name: 'magic-reading-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        configuracion: state.configuracion,
        // Solo persistir cuento si está completo
        cuentoActual: state.cuentoActual?.titulo && state.cuentoActual?.preguntas 
          ? state.cuentoActual 
          : null,
        progresoActual: state.progresoActual,
      }),
      // Validar al cargar desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.cuentoActual) {
          // Verificar que el cuento cargado sea válido
          const cuento = state.cuentoActual;
          if (!cuento.titulo || !cuento.preguntas || cuento.preguntas.length === 0) {
            console.warn('⚠️ Cuento en localStorage inválido, limpiando...');
            state.cuentoActual = null;
            state.progresoActual = {
              respuestasCorrectas: 0,
              respuestasIncorrectas: 0,
              preguntasRespondidas: [],
              tiempoInicio: null,
            };
          }
        }
      }
    }
  )
);

export default useStore;