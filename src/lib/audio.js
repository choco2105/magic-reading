// Sistema de Audio REAL y FUNCIONAL
'use client';

/**
 * GESTOR DE EFECTOS DE SONIDO
 */
export class AudioManager {
  constructor() {
    if (typeof window === 'undefined') return;
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.5;
  }
  
  /**
   * Generar tono (sin archivos externos)
   */
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  /**
   * EFECTOS PREDEFINIDOS
   */
  
  // Click en botones
  click() {
    this.playTone(800, 0.05, 'square', 0.2);
  }
  
  // Respuesta correcta
  success() {
    this.playTone(523, 0.1, 'sine', 0.3); // Do
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 100); // Mi
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.4), 200); // Sol
  }
  
  // Respuesta incorrecta
  error() {
    this.playTone(200, 0.2, 'sawtooth', 0.2);
  }
  
  // Cambio de página
  pageTurn() {
    this.playTone(400, 0.08, 'sine', 0.15);
    setTimeout(() => this.playTone(300, 0.08, 'sine', 0.15), 80);
  }
  
  // Efecto mágico
  magic() {
    const notes = [261, 329, 392, 523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'sine', 0.2), i * 50);
    });
  }
  
  // Celebración
  celebration() {
    const melody = [523, 659, 784, 1046, 784, 659, 523];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.3), i * 100);
    });
  }
  
  // Ajustar volumen global
  setVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }
}

/**
 * NARRADOR DE VOZ (Text-to-Speech)
 */
export class VoiceNarrator {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.voice = null;
    this.setupVoice();
  }
  
  setupVoice() {
    if (!this.synth) return;
    
    // Esperar a que se carguen las voces
    const setVoice = () => {
      const voices = this.synth.getVoices();
      
      // Buscar voz en español (preferiblemente femenina para niños)
      this.voice = voices.find(v => 
        v.lang.startsWith('es') && (v.name.includes('Female') || v.name.includes('Google'))
      ) || voices.find(v => v.lang.startsWith('es')) || voices[0];
      
      console.log('🎤 Voz seleccionada:', this.voice?.name);
    };
    
    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.onvoiceschanged = setVoice;
    }
  }
  
  /**
   * Narrar texto
   */
  narrate(text, options = {}) {
    if (!this.synth) return;
    
    this.stop();
    
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.voice = this.voice;
    this.currentUtterance.rate = options.rate || 0.85; // Más lento para niños
    this.currentUtterance.pitch = options.pitch || 1.1; // Más agudo
    this.currentUtterance.volume = options.volume || 0.8;
    this.currentUtterance.lang = 'es-ES';
    
    if (options.onEnd) {
      this.currentUtterance.onend = options.onEnd;
    }
    
    if (options.onStart) {
      this.currentUtterance.onstart = options.onStart;
    }
    
    this.synth.speak(this.currentUtterance);
  }
  
  /**
   * Detener narración
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  /**
   * Pausar
   */
  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }
  
  /**
   * Reanudar
   */
  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
  
  /**
   * Verificar si está narrando
   */
  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }
}

/**
 * HOOK para usar el sistema de audio
 */
let audioManagerInstance = null;
let voiceNarratorInstance = null;

export function getAudioManager() {
  if (!audioManagerInstance && typeof window !== 'undefined') {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}

export function getVoiceNarrator() {
  if (!voiceNarratorInstance && typeof window !== 'undefined') {
    voiceNarratorInstance = new VoiceNarrator();
  }
  return voiceNarratorInstance;
}