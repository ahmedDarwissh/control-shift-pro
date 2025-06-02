// utils/sounds.ts
export const playFahlawySound = (type: 'toastSuccess' | 'toastInfo' | 'toastAlert' | 'taskComplete' | 'countdownTick' | 'countdownEnd') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime); 

    switch (type) {
      case 'toastSuccess':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'toastInfo':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.25);
        break;
      case 'toastAlert':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'taskComplete':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            gain2.gain.setValueAtTime(0.07, audioContext.currentTime);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1300, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.1);
        }, 100);
        break;
      case 'countdownTick':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'countdownEnd':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
    }
  } catch (e) {
    console.warn("Web Audio API not supported or failed to play sound:", e);
  }
};
