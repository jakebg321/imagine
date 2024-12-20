let audioContext = null;
const soundBuffers = {};
let isInitialized = false;

const createAudioContext = () => {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return true;
  } catch (error) {
    console.error('Failed to create audio context:', error);
    return false;
  }
};

const loadSound = async (name, url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers[name] = audioBuffer;
  } catch (error) {
    console.error(`Failed to load sound ${name}:`, error);
  }
};

export const soundEffects = {
  init: async () => {
    if (isInitialized) return;
    
    if (!createAudioContext()) {
      console.error('Failed to initialize audio context');
      return;
    }

    isInitialized = true;
    await loadSound('hit', '/hitMarker.mp3');
  },

  playSound: (name, volume = 1.0) => {
    if (!audioContext || !soundBuffers[name]) return;

    try {
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      source.buffer = soundBuffers[name];
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Resume audio context if it's suspended (browser requirement)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      source.start(0);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
};
