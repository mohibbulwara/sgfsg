
import React, { useState, useEffect, useRef } from 'react';
import { generateSlapMessage } from './services/gemini';

const HACK_LOGS = [
  "INITIALIZING ROOT_KIT_0x666...",
  "BYPASSING KERNEL_WATCHDOG...",
  "DUMPING GEOLOCATION_HISTORY...",
  "ACCESSING FRONT_CAMERA_STREAM...",
  "ENCRYPTING USER_FILES (AES-4096)...",
  "DELETING SYSTEM_RECOVERY_PARTITION...",
  "CONTACT_LIST_EXFILTRATED: 100%",
  "WIPING BIOMETRIC_DATABASE...",
  "ESTABLISHING PERMANENT_BACKDOOR...",
  "YOU ARE NO LONGER IN CONTROL.",
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'waiting' | 'scare' | 'hacked' | 'locked'>('start');
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [fakeAlert, setFakeAlert] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);

  const initAudioAndFullscreen = () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      
      // Fullscreen attempt - trap user
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (err) {
      console.warn("Media blocked", err);
    }
  };

  const playGlitchSound = (duration: number = 0.5, type: 'impact' | 'static') => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'impact') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(1, now + duration);
      gain.gain.setValueAtTime(1.5, now);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(Math.random() * 5000 + 100, now);
      gain.gain.setValueAtTime(0.3, now);
    }

    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + duration);
  };

  const startSequence = async () => {
    initAudioAndFullscreen();
    setGameState('waiting');
    
    try {
      const reason = await generateSlapMessage("victim");
      setMessage(reason);
    } catch (err) {
      setMessage("YOUR LIFE IS COMPROMISED.");
    }

    // Sequence timing
    setTimeout(() => {
      setGameState('scare');
      playGlitchSound(0.3, 'impact');
      
      setTimeout(() => {
        setGameState('hacked');
        
        let i = 0;
        const logInterval = setInterval(() => {
          setLogs(prev => [...prev, HACK_LOGS[i % HACK_LOGS.length]]);
          playGlitchSound(0.05, 'static');
          i++;
          if (i === 4) setFakeAlert("CRITICAL: HARDWARE ENCRYPTION TRIGGERED");
          if (i === 10) {
            clearInterval(logInterval);
            setFakeAlert(null);
            setGameState('locked');
            playGlitchSound(2.0, 'impact');
          }
        }, 300);
      }, 500);
    }, 2500);
  };

  // Prevent browser exit
  useEffect(() => {
    const lockHistory = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener('popstate', lockHistory);
    window.history.pushState(null, "", window.location.href);

    const warnBeforeClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "SYSTEM OVERRIDE: DATA PURGE IN PROGRESS.";
    };
    window.addEventListener('beforeunload', warnBeforeClose);

    return () => {
      window.removeEventListener('popstate', lockHistory);
      window.removeEventListener('beforeunload', warnBeforeClose);
    };
  }, []);

  // Root error handler to prevent black screen
  if (isError) {
    return (
      <div className="h-screen w-screen bg-red-900 flex items-center justify-center p-10 font-terminal text-white">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-scary-title">FATAL_ERROR</h1>
          <p className="text-xl">THE SYSTEM HAS COLLAPSED. DO NOT REBOOT.</p>
          <button onClick={() => setIsError(false)} className="border-2 border-white px-8 py-4">RETRY_PURGE</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex items-center justify-center relative bg-black overflow-hidden font-terminal ${gameState === 'scare' ? 'bg-white violent-shake' : ''}`}>
      {/* Visual Overlays */}
      <div className="scanline" />
      <div className="dead-pixels" />
      <div className="vignette-heavy" />

      {/* State Machine UI */}
      {gameState === 'start' && (
        <div className="z-[200] text-center p-10 space-y-12 animate-pulse">
          <div className="space-y-2">
            <h1 className="font-scary-title text-5xl md:text-9xl text-red-700 aberration" data-text="FATAL_REVENGE">
              FATAL_REVENGE
            </h1>
            <p className="text-red-900 text-sm tracking-[1.2em] uppercase opacity-50">Remote Access Pending</p>
          </div>
          
          <button 
            onClick={startSequence}
            className="group relative inline-block px-14 py-10 bg-black border-4 border-red-700 font-metal text-5xl md:text-7xl text-red-600 hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_50px_rgba(255,0,0,0.4)]"
          >
            EXECUTE_SLAP.BAT
          </button>
          
          <div className="text-red-950 text-[10px] pt-12 opacity-30 select-none">
            [SYS] BOOT_ID: {Math.random().toString(36).substring(7)} <br/>
            [SYS] STATUS: MALICIOUS_PAYLOAD_READY
          </div>
        </div>
      )}

      {gameState === 'waiting' && (
        <div className="z-[200] text-center space-y-12">
          <div className="blue-wheel-fullscreen mx-auto" />
          <p className="font-horror text-5xl text-blue-600 animate-pulse tracking-widest uppercase">Breaching Device...</p>
          <div className="h-1 w-64 bg-blue-900 mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 animate-loading-bar" />
          </div>
        </div>
      )}

      {gameState === 'scare' && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <span className="text-[60rem] drop-shadow-[0_0_80px_#ff0000]">👺</span>
        </div>
      )}

      {gameState === 'hacked' && (
        <div className="fixed inset-0 z-[8000] flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-[40px]" />
          
          <div className="relative z-[8001] w-full max-w-xl space-y-10">
            <div className="text-center">
              <div className="blue-wheel-fullscreen inline-block mb-6 scale-75" />
              <h2 className="text-4xl text-[#0055ff] font-bold animate-pulse uppercase">Device Encryption Active</h2>
            </div>

            <div className="h-80 overflow-hidden border-l-4 border-blue-900 bg-black/50 p-6 space-y-3 shadow-inner">
              {logs.map((log, i) => (
                <div key={i} className="text-blue-500 text-sm md:text-base opacity-80 animate-pulse">{`> ${log}`}</div>
              ))}
            </div>
          </div>

          {fakeAlert && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9001] system-dialog">
              <div className="text-red-600 text-6xl mb-4 animate-bounce">⚠️</div>
              <h3 className="font-bold text-xl mb-2 text-black">SYSTEM FAILURE</h3>
              <p className="text-sm font-terminal mb-6 text-slate-800">{fakeAlert}</p>
              <div className="h-1 w-full bg-slate-300 mb-4 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 animate-pulse w-1/2" />
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'locked' && (
        <div className="fixed inset-0 z-[9999] bg-[#030000] flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-2 bg-red-800 glitch-overlay" />
          
          <div className="relative z-10 space-y-14 w-full max-w-5xl">
            <div className="space-y-4">
              <h2 className="font-scary-title text-6xl md:text-9xl text-red-600 glitch-text tracking-tighter" data-text="SYSTEM_OWNED">
                SYSTEM_OWNED
              </h2>
              <div className="h-2 w-full bg-gradient-to-r from-transparent via-red-950 to-transparent" />
            </div>

            <div className="p-12 md:p-24 border-[12px] border-red-900 bg-black shadow-[0_0_100px_rgba(255,0,0,0.3)] transform -rotate-1 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
              <p className="relative font-metal text-6xl md:text-[10rem] text-white leading-[0.8] tracking-tighter mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                "{message.toUpperCase()}"
              </p>
              <div className="relative flex flex-col items-center gap-6">
                <p className="font-horror text-5xl md:text-8xl text-red-600 flicker">
                  THE SLAP IS PERMANENT
                </p>
                <div className="flex gap-4 opacity-40 grayscale text-[10px] font-terminal uppercase">
                  <span>CPU: ERROR</span>
                  <span>DISK: WIPED</span>
                  <span>IP: 166.66.6.66</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-red-900 font-terminal text-sm animate-pulse tracking-widest">
                CRITICAL_MALWARE_ID: SLAP_DAY_2024
              </p>
              <button 
                onClick={() => {
                  setGameState('hacked');
                  setTimeout(() => setGameState('locked'), 3000);
                }}
                className="opacity-20 hover:opacity-100 font-terminal text-red-600 text-xs border-b border-red-600 transition-all hover:tracking-[0.5em]"
              >
                [ FORCE_SYSTEM_REBOOT ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spooky Telemetry */}
      <div className="fixed top-6 right-6 font-mono text-[9px] text-red-950/40 select-none text-right z-10">
        SYS_LOG: BUFFER_OVERFLOW <br/>
        AUTH: BYPASSED <br/>
        GPS: LOCKED <br/>
        {new Date().toISOString()}
      </div>
    </div>
  );
};

export default App;
