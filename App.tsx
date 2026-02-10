
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ScriptType } from './types';
import { 
  generateOutput, 
  generatePrediksiTogel, 
  generateSyairContent,
  calculateTogelWin, 
  calculateBolaWin,
  TOGEL_PASARAN_LIST,
  SHIO_LIST
} from './services/generators';
import MetaballsBackground from './components/MetaballsBackground';

const App: React.FC = () => {
  const [scriptType, setScriptType] = useState<ScriptType>(ScriptType.BOLA);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [activePasaran, setActivePasaran] = useState<string>('');
  const [activeShio, setActiveShio] = useState<string>('');
  
  const [calcMarket, setCalcMarket] = useState<"4D" | "5D">("4D");
  const [calcCategory, setCalcCategory] = useState<string>("4D");
  const [calcType, setCalcType] = useState<string>("FULL");
  const [calcStake, setCalcStake] = useState<number>(1000);

  const [bolaMarket, setBolaMarket] = useState<string>("HDP");
  const [bolaHdp, setBolaHdp] = useState<number>(0);
  const [bolaOdds, setBolaOdds] = useState<number>(1.90);
  const [bolaStake, setBolaStake] = useState<number>(100000);
  const [bolaSimResult, setBolaSimResult] = useState<number>(1);

  const [jpUserId, setJpUserId] = useState<string>('');
  const [jpAmount, setJpAmount] = useState<string>('');
  const [jpGame, setJpGame] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  const categories = useMemo(() => {
    if (calcMarket === "4D") return ["4D", "3D", "2D"];
    return ["5D", "COLOK_BEBAS", "COLOK_MACAU", "COLOK_NAGA", "COLOK_JITU", "SHIO", "KOMBINASI", "HOKI_DRAW_COLOK_NAGA", "HOKI_DRAW_COLOK_JITU"];
  }, [calcMarket]);

  useEffect(() => {
    if (scriptType === ScriptType.CALCULATOR) {
      setCalcCategory(categories[0]);
    }
    setActivePasaran('');
    setActiveShio('');
  }, [calcMarket, categories, scriptType]);

  const rewardTypes = useMemo(() => {
    if (calcMarket === "4D") return ["FULL", "DISKON", "BB", "PRIZE_123"];
    if (calcCategory === "5D") return ["FULL", "DISKON", "BB"];
    return ["STANDARD"];
  }, [calcMarket, calcCategory]);

  useEffect(() => {
    if (scriptType === ScriptType.CALCULATOR) {
      setCalcType(rewardTypes[0]);
    }
  }, [calcCategory, rewardTypes, scriptType]);

  const handleGenerate = useCallback(() => {
    if (scriptType === ScriptType.CALCULATOR) {
      setOutput(calculateTogelWin(calcMarket, calcCategory, calcType, calcStake));
    } else if (scriptType === ScriptType.BOLA_CALC) {
      setOutput(calculateBolaWin(bolaMarket, bolaHdp, bolaOdds, bolaStake, bolaSimResult));
    } else if (scriptType === ScriptType.BUKTI_JP) {
      const jpData = `${jpUserId}|${jpAmount}|${jpGame}`;
      setOutput(generateOutput(ScriptType.BUKTI_JP, jpData));
    } else {
      setOutput(generateOutput(scriptType, input));
    }
  }, [scriptType, input, calcMarket, calcCategory, calcType, calcStake, jpUserId, jpAmount, jpGame, bolaMarket, bolaHdp, bolaOdds, bolaStake, bolaSimResult]);

  const handleQuickTogel = (pasaran: string) => {
    setActivePasaran(pasaran);
    const res = generatePrediksiTogel(pasaran);
    setInput(res);
    setOutput(generateOutput(ScriptType.TOGEL, res));
  };

  const handleQuickSyair = (shioName: string) => {
    setActiveShio(shioName);
    const res = generateSyairContent(shioName);
    setInput(res);
    setOutput(generateOutput(ScriptType.SYAIR, res));
  };

  return (
    <div className="min-h-screen relative flex flex-col text-white font-mono uppercase text-[10px] tracking-widest overflow-hidden">
      <MetaballsBackground />
      <header className="fixed top-8 left-0 w-full px-8 flex justify-center z-50 pointer-events-none">
        <h1 className="font-[PP Neue Montreal] text-[1.5rem] tracking-tight lowercase text-white pointer-events-auto">Nexus.</h1>
      </header>

      <main className="relative z-20 flex-1 flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-6xl bg-black/50 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-2xl">
          
          <div className="w-full md:w-[45%] p-8 border-r border-white/5 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <label className="text-white/30 flex justify-between items-center text-[8px]">
                <span>Selection Matrix</span>
                <span className="text-emerald-500 text-[7px] animate-pulse">ADMIN_ACTIVE</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(ScriptType).map((t: string) => (
                  <button 
                    key={t} 
                    onClick={() => { setScriptType(t as ScriptType); setOutput(''); setInput(''); }} 
                    className={`p-3 border rounded-lg transition-all text-[9px] font-bold ${scriptType === t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {scriptType === ScriptType.CALCULATOR ? (
              <div className="space-y-4 animate-fade-in bg-white/5 p-5 rounded-xl border border-white/10">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7px] text-white/30 ml-1">1. Pilih Market</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["4D", "5D"].map((m: string) => (
                        <button key={m} onClick={() => setCalcMarket(m as any)} className={`p-2 rounded border text-[9px] ${calcMarket === m ? 'bg-white text-black' : 'border-white/10 text-white/40'}`}>{m} MARKET</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1">2. Jenis Taruhan</label>
                      <select value={calcCategory} onChange={(e) => setCalcCategory(e.target.value)} className="w-full bg-black border border-white/10 p-2 rounded-lg text-white text-[9px]">
                        {categories.map((c: string) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1">3. Tipe Hadiah</label>
                      <select value={calcType} onChange={(e) => setCalcType(e.target.value)} className="w-full bg-black border border-white/10 p-2 rounded-lg text-white text-[9px]">
                        {rewardTypes.map((r: string) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-white/40 px-1">Bet Amount (IDR)</label>
                    <input type="number" value={calcStake} onChange={(e) => setCalcStake(Number(e.target.value))} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-center text-xl font-bold outline-none" />
                  </div>
                </div>
              </div>
            ) : scriptType === ScriptType.BOLA_CALC ? (
              <div className="space-y-4 animate-fade-in bg-white/5 p-5 rounded-xl border border-white/10">
                 <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1">Sports Market</label>
                      <select value={bolaMarket} onChange={(e) => setBolaMarket(e.target.value)} className="w-full bg-black border border-white/10 p-2.5 rounded-lg text-white text-[9px]">
                        <option value="HDP">ASIAN HANDICAP (HDP)</option>
                        <option value="OU">OVER / UNDER (O/U)</option>
                        <option value="1X2">1X2 / DOUBLE CHANCE</option>
                        <option value="DNB">DRAW NO BET (DNB)</option>
                        <option value="BTTS">BOTH TEAM TO SCORE</option>
                        <option value="CORRECT_SCORE">CORRECT SCORE</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[7px] text-white/30 ml-1">Odds (Dec)</label>
                        <input type="number" step="0.01" value={bolaOdds} onChange={(e) => setBolaOdds(Number(e.target.value))} className="w-full bg-black border border-white/10 p-2.5 rounded-lg text-white text-[9px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[7px] text-white/30 ml-1">Handicap / Line</label>
                        <input type="number" step="0.25" value={bolaHdp} onChange={(e) => setBolaHdp(Number(e.target.value))} className="w-full bg-black border border-white/10 p-2.5 rounded-lg text-white text-[9px]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1">Stake Amount</label>
                      <input type="number" value={bolaStake} onChange={(e) => setBolaStake(Number(e.target.value))} className="w-full bg-black border border-white/10 p-3 rounded-lg text-white text-[12px] font-bold" />
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <label className="text-[7px] text-white/30 ml-1">Simulation Outcome (GD / Goals)</label>
                      <div className="flex items-center gap-4 mt-1">
                        <input type="range" min="-5" max="5" step="1" value={bolaSimResult} onChange={(e) => setBolaSimResult(Number(e.target.value))} className="flex-1 accent-white" />
                        <span className="w-12 text-center text-[12px] font-bold bg-white text-black rounded">{bolaSimResult > 0 ? '+' + bolaSimResult : bolaSimResult}</span>
                      </div>
                    </div>
                 </div>
              </div>
            ) : scriptType === ScriptType.BUKTI_JP ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1 uppercase">User ID</label>
                      <input 
                        type="text" 
                        value={jpUserId} 
                        onChange={(e) => setJpUserId(e.target.value)} 
                        placeholder="Usyyyyyy" 
                        className="w-full bg-black border border-white/10 p-3 rounded-lg text-white text-[11px] outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1 uppercase">Nominal Kemenangan</label>
                      <input 
                        type="text" 
                        value={jpAmount} 
                        onChange={(e) => setJpAmount(e.target.value)} 
                        placeholder="75,000,000" 
                        className="w-full bg-black border border-white/10 p-3 rounded-lg text-white text-[11px] outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[7px] text-white/30 ml-1 uppercase">Permainan</label>
                      <input 
                        type="text" 
                        value={jpGame} 
                        onChange={(e) => setJpGame(e.target.value)} 
                        placeholder="Sweet Bonanza" 
                        className="w-full bg-black border border-white/10 p-3 rounded-lg text-white text-[11px] outline-none"
                      />
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                 {scriptType === ScriptType.TOGEL && (
                    <div className="space-y-2">
                      <label className="text-[7px] text-white/30 ml-1">Quick Pasaran Matrix</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-52 overflow-y-auto custom-scrollbar bg-black/40 p-3 rounded-xl border border-white/5">
                        {TOGEL_PASARAN_LIST.map((p: string) => (
                          <button 
                            key={p} 
                            onClick={() => handleQuickTogel(p)} 
                            className={`text-[8px] p-2.5 rounded-md border transition-all duration-200 truncate font-bold
                              ${activePasaran === p 
                                ? 'bg-white text-black border-white' 
                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                 )}
                 {scriptType === ScriptType.SYAIR && (
                    <div className="space-y-2">
                      <label className="text-[7px] text-white/30 ml-1">Zodiac Shio Matrix</label>
                      <div className="grid grid-cols-4 gap-2 p-3 rounded-xl border border-white/5 bg-black/40">
                        {SHIO_LIST.map((s: { name: string; emoji: string }) => (
                          <button 
                            key={s.name} 
                            onClick={() => handleQuickSyair(s.name)} 
                            className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200
                              ${activeShio === s.name 
                                ? 'bg-white text-black border-white' 
                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                          >
                            <span className="text-xl mb-1">{s.emoji}</span>
                            <span className="text-[6px] font-black">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                 )}
                 <div className="space-y-1">
                    <label className="text-[7px] text-white/30 ml-1">Raw Input Buffer</label>
                    <textarea 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      placeholder="AWAITING SYSTEM INPUT..." 
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-5 text-[9px] resize-none outline-none custom-scrollbar" 
                    />
                 </div>
              </div>
            )}

            <button onClick={handleGenerate} className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-emerald-400 active:scale-[0.98] transition-all text-[11px] tracking-[0.5em]">
              GENERATE_OUTPUT →
            </button>
          </div>

          <div className="w-full md:w-[55%] p-8 flex flex-col space-y-4 bg-white/[0.01]">
            <div className="flex justify-between items-center text-white/30 text-[8px]">
              <span>Processed Output</span>
              {copied && <span className="text-emerald-400 font-bold animate-pulse">CLIPBOARD_SYNCED</span>}
            </div>
            <textarea 
              value={output} 
              readOnly 
              className="flex-1 bg-black/50 border border-white/10 rounded-3xl p-6 font-mono text-[9px] text-white/80 resize-none custom-scrollbar outline-none" 
            />
            <button 
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
              disabled={!output} 
              className="w-full py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all text-[11px] tracking-[0.5em] uppercase"
            >
              Export Results
            </button>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-4 w-full text-center text-white/10 text-[7px] pointer-events-none uppercase">
        Nexus Protocol v2.5.0 // Analytics System
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease; }
      `}</style>
    </div>
  );
};

export default App;
