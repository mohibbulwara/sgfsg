
import React, { useState, useEffect, useRef } from 'react';
import { generateSlapMessage } from './services/gemini';

const DESTRUCTION_STAGES = [
  { folder: "/sdcard/DCIM/Camera", count: "1,244 photos" },
  { folder: "/data/data/com.whatsapp/databases", count: "89 databases" },
  { folder: "/data/data/com.android.chrome/app_tabs", count: "42 sessions" },
  { folder: "/sdcard/WhatsApp/Media", count: "5,601 files" },
  { folder: "/data/data/com.instagram.android/cache", count: "1.2 GB" },
  { folder: "/data/system/users/0/fpdata", count: "Biometric Root" },
  { folder: "/data/data/com.android.vending/purchase_history", count: "Full Access" },
  { folder: "/system/priv-app/Settings", count: "Override Active" },
  { folder: "/data/data/com.bank.app/keys", count: "ENCRYPTED" },
  { folder: "/data/data/com.crypto.wallet/seed", count: "EXFILTRATED" },
];

const HACK_LOGS = [
  "ROOTING ANDROID_V14_KERNEL...",
  "BYPASSING KNOX_SECURITY...",
  "DUMPING IMEI & SERIAL_NUMBER...",
  "UPLOADING CLOUD_BACKUP_TOKENS...",
  "SIM_CARD_CLONING: IN_PROGRESS...",
  "ACCESSING_FRONT_PANE_MIC...",
  "THERMAL_LIMIT: REMOVED",
  "CPU_CORE_0_VOLTAGE: 1.45V",
  "WIPING_BOOTLOADER_SIGNATURE...",
  "DELETING_FACTORY_RESET_IMAGE...",
  "ESTABLISHING_REVERSE_SHELL...",
  "YOUR_PHONE_IS_A_ZOMBIE_NODE.",
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'waiting' | 'scare' | 'hacking' | 'wiping' | 'locked'>('start');
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [wipeProgress, setWipeProgress] = useState(0);
  const [currentFolder, setCurrentFolder] = useState("");
  const [fakeAlert, setFakeAlert] = useState<string | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const initAudioAndFullscreen = () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (err) {
      console.warn("Blocked by browser policy", err);
    }
  };

  const playHeavySound = (freq: number, dur: number, type: OscillatorType = 'sawtooth') => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1, ctx.currentTime + dur);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  };

  const startDestruction = async () => {
    initAudioAndFullscreen();
    setGameState('waiting');
    
    // Predetermine the terrifying fate
    const fate = await generateSlapMessage("victim");
    setMessage(fate);

    setTimeout(() => {
      setGameState('scare');
      playHeavySound(50, 0.4, 'square');
      
      setTimeout(() => {
        setGameState('hacking');
        let i = 0;
        const logInt = setInterval(() => {
          setLogs(prev => [...prev, HACK_LOGS[i % HACK_LOGS.length]].slice(-10));
          playHeavySound(Math.random() * 2000 + 100, 0.05, 'sawtooth');
          i++;
          if (i === 4) setFakeAlert("SYSTEM: SECURITY POLICY VIOLATION. FRONT CAMERA ENABLED.");
          if (i === 8) setFakeAlert("THERMAL: BATTERY TEMPERATURE 85°C. SHUTDOWN PREVENTED.");
          if (i >= HACK_LOGS.length) {
            clearInterval(logInt);
            setFakeAlert(null);
            setGameState('wiping');
            startWipingSequence();
          }
        }, 400);
      }, 500);
    }, 2500);
  };

  const startWipingSequence = () => {
    let folderIdx = 0;
    const wipeInt = setInterval(() => {
      setWipeProgress(p => {
        const next = p + 1;
        if (next % 10 === 0 && folderIdx < DESTRUCTION_STAGES.length) {
          setCurrentFolder(DESTRUCTION_STAGES[folderIdx].folder + " (" + DESTRUCTION_STAGES[folderIdx].count + ")");
          folderIdx++;
          playHeavySound(20, 0.5, 'sine');
        }
        if (next >= 100) {
          clearInterval(wipeInt);
          setTimeout(() => setGameState('locked'), 1000);
        }
        return next;
      });
    }, 200); // 20 seconds total for wiping
  };

  useEffect(() => {
    const handleBack = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handleBack);
    window.history.pushState(null, "", window.location.href);

    const handleLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "DELETING SYSTEM FILES. REBOOTING NOW WILL DESTROY YOUR MOTHERBOARD.";
    };
    window.addEventListener('beforeunload', handleLeave);

    return () => {
      window.removeEventListener('popstate', handleBack);
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, []);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-black overflow-hidden font-terminal ${gameState === 'scare' ? 'bg-white violent-shake' : ''}`}>
      <div className="scanline" />
      <div className="vignette" />
      <div className="crt-grain" />
      {gameState !== 'start' && <div className="thermal-overlay" />}

      {gameState === 'start' && (
        <div className="z-[3000] text-center p-6 space-y-12 max-w-xs">
          <div className="space-y-2">
            <h1 className="font-scary-title text-4xl text-red-600 aberration" data-text="SLAP_REVENGE">SLAP_REVENGE</h1>
            <p className="text-red-900 text-[10px] tracking-[0.5em] uppercase">Mobile Root Required</p>
          </div>
          <button 
            onClick={startDestruction}
            className="w-full py-12 bg-red-950 border-4 border-red-600 text-red-500 font-metal text-5xl active:scale-150 active:bg-white active:text-black transition-all shadow-[0_0_50px_#f00]"
          >
            ENTER_VOID
          </button>
          <div className="text-[8px] text-red-900 opacity-30 text-left space-y-1">
             <p>[SYS] DEVICE: DETECTED</p>
             <p>[SYS] DATA_VOLUME: 256GB</p>
             <p>[SYS] STATUS: VULNERABLE</p>
          </div>
        </div>
      )}

      {gameState === 'waiting' && (
        <div className="z-[3000] text-center space-y-8">
          <div className="blue-wheel mx-auto" />
          <p className="font-horror text-4xl text-blue-600 animate-pulse uppercase">Breaching Knox...</p>
        </div>
      )}

      {gameState === 'scare' && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <span className="text-[40rem] filter contrast-200">👺</span>
        </div>
      )}

      {gameState === 'hacking' && (
        <div className="z-[3000] w-full px-6 space-y-10">
          <div className="text-center">
            <div className="blue-wheel mx-auto scale-75 mb-4" />
            <h2 className="text-2xl text-blue-500 font-bold animate-pulse">REMOTE ACCESS GRANTED</h2>
          </div>
          <div className="h-64 border-l-2 border-red-900 pl-4 space-y-2 overflow-hidden">
            {logs.map((log, i) => (
              <div key={i} className="text-[10px] text-red-600 opacity-80">{`>> ${log}`}</div>
            ))}
          </div>
          {fakeAlert && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 system-dialog">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h3 className="font-bold text-lg mb-2 text-black uppercase">Android System</h3>
              <p className="text-xs mb-6 text-black font-terminal leading-tight">{fakeAlert}</p>
              <button className="w-full bg-red-600 text-white font-bold py-3">EMERGENCY_CANCEL</button>
            </div>
          )}
        </div>
      )}

      {gameState === 'wiping' && (
        <div className="z-[3000] w-full px-10 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-red-600 font-scary-title text-3xl animate-pulse">DELETING ALL DATA</h2>
            <div className="h-4 w-full bg-red-950 rounded-full border border-red-800 overflow-hidden">
              <div className="h-full bg-red-500 shadow-[0_0_20px_#f00]" style={{ width: `${wipeProgress}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-red-900 font-terminal">
              <span>{wipeProgress}% COMPLETE</span>
              <span>WIPING_STORAGE...</span>
            </div>
          </div>

          <div className="bg-red-950/20 p-4 h-32 border border-red-900/40 text-left overflow-hidden">
             <div className="folder-delete-line">{`Wiping: ${currentFolder}`}</div>
             <div className="text-[8px] text-red-800 mt-2">
               {`[INFO] UNLINKING_NODES: 0x${Math.random().toString(16).slice(2, 10)}`}
             </div>
          </div>

          <div className="text-red-600 text-[10px] font-terminal animate-pulse">
            DO NOT MINIMIZE APP - DATA CORRUPTION WILL BE PERMANENT
          </div>
        </div>
      )}

      {gameState === 'locked' && (
        <div className="z-[3000] text-center p-6 space-y-10 max-w-md">
          <div className="space-y-4">
            <h2 className="font-scary-title text-5xl text-red-600 glitch-text tracking-tight" data-text="DEVICE_OWNED">DEVICE_OWNED</h2>
            <div className="h-1 w-full bg-red-900" />
          </div>

          <div className="p-8 border-4 border-red-700 bg-black shadow-[0_0_80px_#f00] relative transform -rotate-1">
             <p className="font-metal text-6xl text-white leading-none mb-6">
                "{message.toUpperCase()}"
             </p>
             <p className="font-horror text-4xl text-red-600 flicker">THE SLAP IS FINAL</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[9px] text-red-950 uppercase opacity-40 font-terminal">
            <div className="text-right border-r border-red-950 pr-2">PHOTOS: WIPED<br/>WHATSAPP: DELETED<br/>BANK_APPS: LOCKED</div>
            <div className="text-left pl-2">SIM_STATUS: CLONED<br/>GPS: STREAMING<br/>ROOT_ACCESS: GRANTED</div>
          </div>

          <p className="text-red-900 text-[8px] animate-pulse tracking-widest mt-12">
            REMOTE_SESSION_ACTIVE: VOID_HACKER_666
          </p>
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-[4000] text-[8px] text-red-950 font-terminal opacity-50 uppercase">
        Memory: 100% Full | CPU: 92°C | Battery: 1% (Fake)
      </div>
    </div>
  );
};

export default App;
