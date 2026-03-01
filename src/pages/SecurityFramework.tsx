import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Zap, TrendingUp, Activity, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type SecurityLevel = 1 | 2 | 3 | 4 | 5;

const SecurityFramework = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(1);
  const [attacksBlocked, setAttacksBlocked] = useState(0);
  const [attacksLaunched, setAttacksLaunched] = useState(0);
  const [logs, setLogs] = useState<Array<{ id: number; message: string; type: string; time: string }>>([]);
  const [activeAttacks, setActiveAttacks] = useState<Array<{ id: number; intensity: number; blocked: boolean }>>([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const attackIdRef = useRef(0);

  const securityLevels = [
    { level: 1, name: "Basic Foundation", color: "text-red-400", description: "Initial security layer" },
    { level: 2, name: "Enhanced Defense", color: "text-orange-400", description: "Learning from attacks" },
    { level: 3, name: "Adaptive Protection", color: "text-yellow-400", description: "AI pattern recognition" },
    { level: 4, name: "Advanced Shield", color: "text-green-400", description: "Predictive blocking" },
    { level: 5, name: "Autonomous Defense", color: "text-primary", description: "Self-evolving security" },
  ];

  useEffect(() => {
    if (!isRunning) return;

    // Launch attacks with increasing intensity
    const attackInterval = setInterval(() => {
      const intensity = Math.floor(Math.random() * 5) + 1;
      const attackId = attackIdRef.current++;
      
      setActiveAttacks(prev => [...prev, { id: attackId, intensity, blocked: false }]);
      setAttacksLaunched(prev => prev + 1);
      
      addLog(`⚠️ Attack detected (Intensity: ${intensity}/5)`, "warning");

      // Check if attack is blocked based on security level
      setTimeout(() => {
        const isBlocked = intensity <= securityLevel;
        
        setActiveAttacks(prev => 
          prev.map(a => a.id === attackId ? { ...a, blocked: isBlocked } : a)
        );

        if (isBlocked) {
          setAttacksBlocked(prev => prev + 1);
          addLog(`✅ Attack blocked by Level ${securityLevel} defense`, "success");
        } else {
          addLog(`🔴 Attack penetrated! Intensity too high for current level`, "error");
          addLog(`🧠 AI analyzing attack pattern...`, "info");
          setAiAnalyzing(true);
          
          // AI upgrades security after analyzing
          setTimeout(() => {
            if (securityLevel < 5) {
              setSecurityLevel(prev => Math.min(5, prev + 1) as SecurityLevel);
              addLog(`⚡ Security upgraded to Level ${Math.min(5, securityLevel + 1)}`, "success");
              addLog(`🛡️ New defense patterns learned`, "success");
            }
            setAiAnalyzing(false);
          }, 2000);
        }

        // Remove attack after 3 seconds
        setTimeout(() => {
          setActiveAttacks(prev => prev.filter(a => a.id !== attackId));
        }, 3000);
      }, 1500);
    }, 3000);

    return () => clearInterval(attackInterval);
  }, [isRunning, securityLevel]);

  const addLog = (message: string, type: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), message, type, time }]);
  };

  const startFramework = () => {
    setIsRunning(true);
    setSecurityLevel(1);
    setAttacksBlocked(0);
    setAttacksLaunched(0);
    setLogs([]);
    setActiveAttacks([]);
    attackIdRef.current = 0;
    
    addLog("🟢 Security framework initialized", "success");
    addLog("🏗️ Building foundation layer...", "info");
    addLog("✅ Level 1 security active", "success");
  };

  const stopFramework = () => {
    setIsRunning(false);
    addLog("⏸️ Framework paused", "info");
  };

  const resetFramework = () => {
    setIsRunning(false);
    setSecurityLevel(1);
    setAttacksBlocked(0);
    setAttacksLaunched(0);
    setLogs([]);
    setActiveAttacks([]);
    setAiAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-block mb-4">
                <span className="text-xs font-mono text-primary uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  Self-Developing AI Framework
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
                Adaptive <span className="text-primary">Security</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                Watch how AI analyzes attacks and automatically upgrades security in real-time. 
                The system learns and evolves with each threat.
              </p>
            </motion.div>

            {/* Control Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center gap-4 mb-12"
            >
              {!isRunning ? (
                <button
                  onClick={startFramework}
                  className="px-8 py-4 rounded-full bg-primary text-black font-semibold hover:shadow-[0_0_40px_hsl(var(--glow)/0.5)] transition-all duration-300"
                >
                  Start Framework
                </button>
              ) : (
                <>
                  <button
                    onClick={stopFramework}
                    className="px-8 py-4 rounded-full border border-border/50 text-foreground font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    Pause
                  </button>
                  <button
                    onClick={resetFramework}
                    className="px-8 py-4 rounded-full border border-border/50 text-foreground font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    Reset
                  </button>
                </>
              )}
            </motion.div>

            {/* Main Visualization */}
            <div className="mb-12">
              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-6 mb-8"
              >
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Attacks Blocked</div>
                      <div className="text-4xl font-bold text-green-500">{attacksBlocked}</div>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-500/50" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                      <div className="text-4xl font-bold text-primary">
                        {attacksLaunched > 0 ? Math.round((attacksBlocked / attacksLaunched) * 100) : 0}%
                      </div>
                    </div>
                    <TrendingUp className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Security Level</div>
                      <div className="text-4xl font-bold text-blue-400">Level {securityLevel}</div>
                    </div>
                    <Shield className="w-12 h-12 text-blue-400/50" />
                  </div>
                </div>
              </motion.div>

              {/* Main Arena */}
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Security Levels - Vertical */}
                <div className="lg:col-span-1">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold font-display">Defense Layers</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {securityLevels.map((level) => (
                        <motion.div
                          key={level.level}
                          initial={{ opacity: 0.3, x: -20 }}
                          animate={{ 
                            opacity: level.level <= securityLevel ? 1 : 0.3,
                            x: level.level === securityLevel ? 5 : 0,
                            scale: level.level === securityLevel ? 1.02 : 1
                          }}
                          transition={{ duration: 0.3 }}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-500 overflow-hidden ${
                            level.level === securityLevel 
                              ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(74,222,128,0.3)]' 
                              : level.level < securityLevel
                              ? 'border-green-500/30 bg-green-500/5'
                              : 'border-border/30 bg-card/20'
                          }`}
                        >
                          {/* Active level glow */}
                          {level.level === securityLevel && (
                            <motion.div
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                            />
                          )}
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-bold text-lg ${level.color}`}>
                                {level.level}
                              </span>
                              {level.level <= securityLevel && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200 }}
                                >
                                  <CheckCircle className="w-5 h-5 text-primary" />
                                </motion.div>
                              )}
                            </div>
                            <div className="text-sm font-semibold mb-1">{level.name}</div>
                            <div className="text-xs text-muted-foreground">{level.description}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Status */}
                    <AnimatePresence>
                      {aiAnalyzing && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/50 shadow-[0_0_40px_rgba(74,222,128,0.4)]"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Brain className="w-8 h-8 text-primary" />
                            </motion.div>
                            <div>
                              <div className="text-sm font-bold text-primary">AI Learning</div>
                              <div className="text-xs text-muted-foreground">Upgrading defenses...</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Attack Arena - Larger */}
                <div className="lg:col-span-3">
                  <div className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold font-display">Attack Arena</h3>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">
                        Total Attacks: <span className="text-foreground font-bold">{attacksLaunched}</span>
                      </div>
                    </div>

                    {/* Arena Visualization */}
                    <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-black/60 to-black/40 rounded-2xl border-2 border-border/30 overflow-hidden">
                      {/* Grid background */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                      }} />

                      {/* Glow effects */}
                      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
                      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                      {!isRunning && attacksLaunched === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Lock className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
                            </motion.div>
                            <p className="text-muted-foreground text-lg">Start the framework to begin</p>
                          </div>
                        </div>
                      )}

                      {/* Attack Source (Left) */}
                      {isRunning && (
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute left-12 top-1/2 -translate-y-1/2"
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              boxShadow: [
                                "0 0 20px rgba(239, 68, 68, 0.5)",
                                "0 0 40px rgba(239, 68, 68, 0.8)",
                                "0 0 20px rgba(239, 68, 68, 0.5)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center"
                          >
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                          </motion.div>
                          <div className="text-center mt-3">
                            <div className="text-xs font-mono text-red-400 font-bold">THREAT SOURCE</div>
                          </div>
                        </motion.div>
                      )}

                      {/* Active Attacks */}
                      <AnimatePresence>
                        {activeAttacks.map((attack) => (
                          <motion.div
                            key={attack.id}
                            initial={{ x: 100, opacity: 0, scale: 0.5 }}
                            animate={{ 
                              x: attack.blocked ? 550 : 750,
                              opacity: attack.blocked ? [1, 1, 0] : [0, 1, 1],
                              scale: attack.blocked ? [1, 1.5, 0] : 1
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: attack.blocked ? 1.2 : 2.5, ease: "easeInOut" }}
                            className="absolute"
                            style={{ top: `${15 + (attack.id % 7) * 12}%` }}
                          >
                            <motion.div
                              animate={!attack.blocked ? { 
                                rotate: [0, 360],
                                boxShadow: [
                                  "0 0 20px rgba(239, 68, 68, 0.6)",
                                  "0 0 40px rgba(239, 68, 68, 1)",
                                  "0 0 20px rgba(239, 68, 68, 0.6)"
                                ]
                              } : {}}
                              transition={{ 
                                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                boxShadow: { duration: 1, repeat: Infinity }
                              }}
                              className={`px-5 py-3 rounded-xl font-mono text-sm font-bold flex items-center gap-3 ${
                                attack.blocked 
                                  ? 'bg-green-500/30 border-2 border-green-500 text-green-400' 
                                  : 'bg-red-500/30 border-2 border-red-500 text-red-400'
                              }`}
                            >
                              {attack.blocked ? (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  <span>BLOCKED</span>
                                </>
                              ) : (
                                <>
                                  <Zap className="w-5 h-5" />
                                  <span>LVL {attack.intensity}</span>
                                </>
                              )}
                            </motion.div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Shield (Right) */}
                      {isRunning && (
                        <motion.div
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute right-12 top-1/2 -translate-y-1/2"
                        >
                          <motion.div
                            animate={{ 
                              rotate: 360,
                              scale: aiAnalyzing ? [1, 1.3, 1] : 1
                            }}
                            transition={{ 
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 1, repeat: aiAnalyzing ? Infinity : 0 }
                            }}
                            className="relative"
                          >
                            {/* Outer glow ring */}
                            <motion.div
                              animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`absolute inset-0 rounded-full blur-xl ${
                                securityLevel >= 4 ? 'bg-primary' :
                                securityLevel >= 3 ? 'bg-green-400' :
                                securityLevel >= 2 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}
                            />
                            
                            <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                              securityLevel >= 4 ? 'border-primary bg-primary/20 shadow-[0_0_60px_rgba(74,222,128,0.8)]' :
                              securityLevel >= 3 ? 'border-green-400 bg-green-400/20 shadow-[0_0_60px_rgba(74,222,128,0.6)]' :
                              securityLevel >= 2 ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_60px_rgba(234,179,8,0.6)]' :
                              'border-red-400 bg-red-400/20 shadow-[0_0_60px_rgba(239,68,68,0.6)]'
                            }`}>
                              <Shield className={`w-14 h-14 ${
                                securityLevel >= 4 ? 'text-primary' :
                                securityLevel >= 3 ? 'text-green-400' :
                                securityLevel >= 2 ? 'text-yellow-400' :
                                'text-red-400'
                              }`} />
                            </div>
                          </motion.div>
                          <div className="text-center mt-3">
                            <div className="text-xs font-mono text-primary font-bold">AI DEFENSE</div>
                            <div className="text-xs font-mono text-muted-foreground">Level {securityLevel}</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Logs */}
            {logs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
                  <h3 className="text-sm font-mono font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    System Logs
                  </h3>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto font-mono text-sm space-y-2">
                  {logs.slice().reverse().slice(0, 20).map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-muted-foreground/50 text-xs">[{log.time}]</span>
                      <span className={`flex-1 ${
                        log.type === "success" ? "text-green-400" :
                        log.type === "warning" ? "text-yellow-400" :
                        log.type === "error" ? "text-red-400" :
                        "text-muted-foreground"
                      }`}>
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityFramework;
