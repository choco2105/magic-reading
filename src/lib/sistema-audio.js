// Sistema de Audio para Magic Reading
// Incluye: Narración TTS, efectos de sonido, música de fondo

import { useState, useEffect, useRef } from 'react';

/**
 * HOOK para controlar el sistema de audio
 */
export function useAudioSystem() {
  const [audioHabilitado, setAudioHabilitado] = useState(true);
  const [narracionActiva, setNarracionActiva] = useState(false);
  const [volumen, setVolumen] = useState(0.7);
  
  const audioContextRef = useRef(null);
  const musicaFondoRef = useRef(null);
  
  useEffect(() => {
    // Inicializar Web Audio API
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    return () => {
      // Cleanup
      if (musicaFondoRef.current) {
        musicaFondoRef.current.pause();
      }
    };
  }, []);
  
  return {
    audioHabilitado,
    setAudioHabilitado,
    narracionActiva,
    setNarracionActiva,
    volumen,
    setVolumen,
    audioContext: audioContextRef.current
  };
}

/**
 * NARRACIÓN CON VOZ (Text-to-Speech)
 * Usando Web Speech API (GRATIS) o ElevenLabs (PREMIUM)
 */
export class NarradorVoz {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.vozActual = null;
    this.configurarVoz();
  }
  
  /**
   * Configurar voz en español apropiada para niños
   */
  configurarVoz() {
    if (!this.synth) return;
    
    const voces = this.synth.getVoices();
    
    // Buscar voces en español
    const vozEspanol = voces.find(voz => 
      voz.lang.startsWith('es') && 
      (voz.name.includes('Female') || voz.name.includes('Femenino'))
    ) || voces.find(voz => voz.lang.startsWith('es'));
    
    this.vozActual = vozEspanol || voces[0];
    
    console.log('🎤 Voz configurada:', this.vozActual?.name);
  }
  
  /**
   * Narrar texto con voz
   */
  narrar(texto, opciones = {}) {
    if (!this.synth) {
      console.warn('⚠️ Speech Synthesis no disponible');
      return null;
    }
    
    // Detener narración anterior
    this.detener();
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.voice = this.vozActual;
    utterance.rate = opciones.velocidad || 0.9; // Más lento para niños
    utterance.pitch = opciones.tono || 1.1; // Ligeramente más alto
    utterance.volume = opciones.volumen || 0.8;
    utterance.lang = 'es-ES';
    
    // Eventos
    utterance.onstart = () => {
      console.log('🎤 Narrando:', texto.substring(0, 50) + '...');
      if (opciones.onStart) opciones.onStart();
    };
    
    utterance.onend = () => {
      console.log('✅ Narración completada');
      if (opciones.onEnd) opciones.onEnd();
    };
    
    utterance.onerror = (error) => {
      console.error('❌ Error en narración:', error);
      if (opciones.onError) opciones.onError(error);
    };
    
    this.synth.speak(utterance);
    
    return utterance;
  }
  
  /**
   * Narrar por párrafos (para cuentos largos)
   */
  async narrarPorParrafos(parrafos, opciones = {}) {
    for (let i = 0; i < parrafos.length; i++) {
      await new Promise((resolve) => {
        this.narrar(parrafos[i], {
          ...opciones,
          onEnd: resolve
        });
      });
      
      // Pausa entre párrafos
      await new Promise(resolve => setTimeout(resolve, opciones.pausaEntre || 500));
    }
  }
  
  /**
   * Detener narración
   */
  detener() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  /**
   * Pausar narración
   */
  pausar() {
    if (this.synth) {
      this.synth.pause();
    }
  }
  
  /**
   * Reanudar narración
   */
  reanudar() {
    if (this.synth) {
      this.synth.resume();
    }
  }
}

/**
 * EFECTOS DE SONIDO
 * Librería de sonidos para acciones del usuario
 */
export class EfectosSonido {
  constructor() {
    this.sonidos = {};
    this.audioContext = null;
    this.cargarSonidos();
  }
  
  /**
   * Cargar librería de sonidos
   */
  async cargarSonidos() {
    // URLs de sonidos gratuitos (puedes usar Freesound, Zapsplat, etc.)
    const biblioteca = {
      // Sonidos de UI
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      page_turn: '/sounds/page-turn.mp3',
      
      // Sonidos de logros
      star: '/sounds/star.mp3',
      applause: '/sounds/applause.mp3',
      celebration: '/sounds/celebration.mp3',
      
      // Sonidos ambientales
      magic: '/sounds/magic.mp3',
      sparkle: '/sounds/sparkle.mp3',
      whoosh: '/sounds/whoosh.mp3'
    };
    
    // Pre-cargar sonidos
    for (const [nombre, url] of Object.entries(biblioteca)) {
      try {
        this.sonidos[nombre] = new Audio(url);
        this.sonidos[nombre].preload = 'auto';
      } catch (error) {
        console.warn(`⚠️ No se pudo cargar: ${nombre}`);
      }
    }
  }
  
  /**
   * Reproducir efecto de sonido
   */
  reproducir(nombre, volumen = 0.5) {
    const sonido = this.sonidos[nombre];
    
    if (!sonido) {
      console.warn(`⚠️ Sonido no encontrado: ${nombre}`);
      return;
    }
    
    try {
      sonido.volume = volumen;
      sonido.currentTime = 0;
      sonido.play();
    } catch (error) {
      console.error(`❌ Error reproduciendo ${nombre}:`, error);
    }
  }
  
  /**
   * Generar tono sintético (sin archivos)
   */
  generarTono(frecuencia, duracion, tipo = 'sine') {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frecuencia;
    oscillator.type = tipo;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duracion
    );
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duracion);
  }
  
  /**
   * Efectos predefinidos con tonos sintéticos
   */
  efectoClick() {
    this.generarTono(800, 0.05, 'square');
  }
  
  efectoSuccess() {
    this.generarTono(523, 0.1, 'sine'); // Do
    setTimeout(() => this.generarTono(659, 0.1, 'sine'), 100); // Mi
    setTimeout(() => this.generarTono(784, 0.2, 'sine'), 200); // Sol
  }
  
  efectoError() {
    this.generarTono(200, 0.3, 'sawtooth');
  }
  
  efectoMagic() {
    const frecuencias = [261, 329, 392, 523, 659, 784, 1046];
    frecuencias.forEach((freq, i) => {
      setTimeout(() => this.generarTono(freq, 0.1, 'sine'), i * 50);
    });
  }
}

/**
 * MÚSICA DE FONDO
 */
export class MusicaFondo {
  constructor() {
    this.audio = null;
    this.volumen = 0.3;
    this.pistas = {
      aventura: '/music/adventure.mp3',
      calma: '/music/calm.mp3',
      celebracion: '/music/celebration.mp3'
    };
  }
  
  /**
   * Reproducir música de fondo
   */
  reproducir(tipo = 'aventura', loop = true) {
    if (this.audio) {
      this.detener();
    }
    
    const url = this.pistas[tipo];
    if (!url) return;
    
    this.audio = new Audio(url);
    this.audio.volume = this.volumen;
    this.audio.loop = loop;
    
    this.audio.play().catch(error => {
      console.warn('⚠️ No se pudo reproducir música:', error);
    });
  }
  
  /**
   * Ajustar volumen
   */
  setVolumen(nuevoVolumen) {
    this.volumen = Math.max(0, Math.min(1, nuevoVolumen));
    if (this.audio) {
      this.audio.volume = this.volumen;
    }
  }
  
  /**
   * Fade in/out
   */
  fadeIn(duracion = 2000) {
    if (!this.audio) return;
    
    this.audio.volume = 0;
    const intervalo = 50;
    const pasos = duracion / intervalo;
    const incremento = this.volumen / pasos;
    
    const fade = setInterval(() => {
      if (this.audio.volume < this.volumen) {
        this.audio.volume = Math.min(this.volumen, this.audio.volume + incremento);
      } else {
        clearInterval(fade);
      }
    }, intervalo);
  }
  
  fadeOut(duracion = 2000) {
    if (!this.audio) return;
    
    const intervalo = 50;
    const pasos = duracion / intervalo;
    const decremento = this.audio.volume / pasos;
    
    const fade = setInterval(() => {
      if (this.audio.volume > 0) {
        this.audio.volume = Math.max(0, this.audio.volume - decremento);
      } else {
        this.detener();
        clearInterval(fade);
      }
    }, intervalo);
  }
  
  /**
   * Pausar/Reanudar
   */
  pausar() {
    if (this.audio) this.audio.pause();
  }
  
  reanudar() {
    if (this.audio) this.audio.play();
  }
  
  /**
   * Detener
   */
  detener() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}

/**
 * MANAGER PRINCIPAL DE AUDIO
 */
export class AudioManager {
  constructor() {
    this.narrador = new NarradorVoz();
    this.efectos = new EfectosSonido();
    this.musica = new MusicaFondo();
    this.habilitado = true;
  }
  
  /**
   * Habilitar/Deshabilitar todo el audio
   */
  setHabilitado(estado) {
    this.habilitado = estado;
    
    if (!estado) {
      this.narrador.detener();
      this.musica.detener();
    }
  }
  
  /**
   * Narrar cuento completo
   */
  narrarCuento(cuento, opciones = {}) {
    if (!this.habilitado) return;
    
    const parrafos = cuento.contenido.split('\n\n').filter(p => p.trim());
    
    // Reproducir música de fondo
    this.musica.reproducir('aventura');
    this.musica.fadeIn(3000);
    
    // Narrar párrafo por párrafo
    this.narrador.narrarPorParrafos(parrafos, {
      velocidad: opciones.velocidad || 0.9,
      pausaEntre: opciones.pausaEntre || 1000,
      onEnd: () => {
        this.efectos.reproducir('applause', 0.3);
        this.musica.fadeOut(2000);
        if (opciones.onFinalizado) opciones.onFinalizado();
      }
    });
  }
  
  /**
   * Cleanup
   */
  destruir() {
    this.narrador.detener();
    this.musica.detener();
  }
}

// Crear instancia global
let audioManager = null;

export function getAudioManager() {
  if (!audioManager && typeof window !== 'undefined') {
    audioManager = new AudioManager();
  }
  return audioManager;
}