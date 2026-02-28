import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Activity, Zap, Bug, Lock, Server } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type AttackType = {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  duration: number;
};

const attacks: AttackType[] = [
  {
    id: "ddos",
    name: "DDoS Attack",
    icon: Zap,
    description: "Distributed Denial of Service - overwhelming the server with traffic",
    color: "from-red-500 to-orange-500",
    duration: 5000,
  },
  {
    id: "sql",
    name: "SQL Injection",
    icon: Bug,
    description: "Malicious SQL code injection to access database",
    color: "from-purple-500 to-pink-500",
    duration: 4000,
  },
  {
    id: "brute",
    name: "Brute Force",
    icon: Lock,
    description: "Automated password guessing attempts",
    color: "from-yellow-500 to-red-500",
    duration: 6000,
  },
  {
    id: "malware",
    name: "Malware Injection",
    icon: Server,
    description: "Attempting to inject malicious code into the system",
    color: "from-blue-500 to-purple-500",
    duration: 4500,
  },
];

const AttackSimulation = () => {
  const [selectedAttack, setSelectedAttack] = useState<AttackType | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [phase, setPhase] = useState<"idle" | "detecting" | "analyzing" | "blocking" | "blocked">("idle");
  const [packets, setPackets] = useState<Array<{ id: number; x: number; y: number; blocked: boolean }>>([]);
  const [logs, setLogs] = useState<Array<{ id: number; message: string; type: string; time: string }>>([]);

  const startSimulation = (attack: AttackType) => {
    setSelectedAttack(attack);
    setIsSimulating(true);
    setPhase("detecting");
    setPackets([]);
    setLogs([]);

    addLog("System monitoring active", "info");
    
    // Phase 1: Detection
    setTimeout(() => {
      setPhase("detecting");
      addLog(`${attack.name} detected!`, "warning");
      generatePackets(20);
    }, 500);

    // Phase 2: Analysis
    setTimeout(() => {
      setPhase("analyzing");
      addLog("Analyzing attack pattern...", "info");
      addLog("Threat level: HIGH", "warning");
    }, 2000);

    // Phase 3: Blocking
    setTimeout(() => {
      setPhase("blocking");
      addLog("Activating defense protocols", "info");
      addLog("Blocking malicious traffic", "success");
      blockPackets();
    }, 3500);

    // Phase 4: Blocked
    setTimeout(() => {
      setPhase("blocked");
      addLog("Attack successfully neutralized", "success");
      addLog("System secure", "success");
      setIsSimulating(false);
    }, attack.duration);
  };

  const generatePackets = (count: number) => {
    const newPackets = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10,
      blocked: false,
    }));
    setPackets(prev => [...prev, ...newPackets]);
  };

  const blockPackets = () => {
    setPackets(prev => prev.map(p => ({ ...p, blocked: true })));
  };

  const addLog = (message: string, type: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { id: Date.now(), message, type, time }]);
  };

  const resetSimulation = () => {
    setSelectedAttack(null);
    setIsSimulating(false);
    setPhase("idle");
    setPackets([]);
    setLogs([]);
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
              className="text-center mb-16"
            >
              <div className="inline-block mb-4">
                <span className="text-[11px] font-mono text-primary uppercase tracking-[0.4em] px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  Interactive Demo
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
                Attack <span className="text-primary">Simulation</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience real-time visualization of cyber attacks and how our defense systems detect and neutralize threats.
              </p>
            </motion.div>

            {/* Attack Selection */}
            {!isSimulating && phase === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                {attacks.map((attack, i) => (
                  <motion.button
                    key={attack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => startSimulation(attack)}
                    className="group relative p-6 rounded-xl border border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm transition-all duration-300 text-left overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${attack.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <attack.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{attack.name}</h3>
                      <p className="text-sm text-muted-foreground">{attack.description}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Visualization Area */}
            <AnimatePresence>
              {selectedAttack && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-12"
                >
                  <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden"
                       style={{ height: "500px" }}>
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 bg-muted/50 backdrop-blur-sm border-b border-border/50 px-6 py-4 z-20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            phase === "blocked" ? "bg-green-500" :
                            phase === "blocking" ? "bg-yellow-500" :
                            phase === "analyzing" || phase === "detecting" ? "bg-red-500 animate-pulse" :
                            "bg-gray-500"
                          }`} />
                          <span className="text-sm font-mono">
                            {phase === "idle" && "System Ready"}
                            {phase === "detecting" && "⚠️ Threat Detected"}
                            {phase === "analyzing" && "🔍 Analyzing Attack"}
                            {phase === "blocking" && "🛡️ Blocking Attack"}
                            {phase === "blocked" && "✅ Threat Neutralized"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-sm font-mono text-muted-foreground">
                            {selectedAttack.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Visualization Canvas */}
                    <div className="absolute inset-0 pt-16">
                      {/* Server (Target) */}
                      <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                        animate={{
                          scale: phase === "detecting" || phase === "analyzing" ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ repeat: phase === "detecting" || phase === "analyzing" ? Infinity : 0, duration: 1 }}
                      >
                        <div className={`w-24 h-24 rounded-xl flex items-center justify-center ${
                          phase === "blocked" ? "bg-green-500/20 border-green-500" :
                          phase === "blocking" ? "bg-yellow-500/20 border-yellow-500" :
                          phase === "analyzing" || phase === "detecting" ? "bg-red-500/20 border-red-500" :
                          "bg-primary/20 border-primary"
                        } border-2 transition-all duration-500`}>
                          <Shield className={`w-12 h-12 ${
                            phase === "blocked" ? "text-green-500" :
                            phase === "blocking" ? "text-yellow-500" :
                            phase === "analyzing" || phase === "detecting" ? "text-red-500" :
                            "text-primary"
                          }`} />
                        </div>
                        <div className="text-center mt-2 text-xs font-mono text-muted-foreground">
                          Protected Server
                        </div>
                      </motion.div>

                      {/* Attack Packets */}
                      <AnimatePresence>
                        {packets.map((packet) => (
                          <motion.div
                            key={packet.id}
                            initial={{ x: `${packet.x}%`, y: -20, opacity: 0 }}
                            animate={{
                              x: packet.blocked ? `${packet.x}%` : "50%",
                              y: packet.blocked ? "30%" : "70%",
                              opacity: packet.blocked ? 0 : 1,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="absolute"
                          >
                            <div className={`w-3 h-3 rounded-full ${
                              packet.blocked ? "bg-green-500" : "bg-red-500"
                            } shadow-lg`} />
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Defense Shield Effect */}
                      {(phase === "blocking" || phase === "blocked") && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 2, opacity: [0, 0.5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-primary"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logs Panel */}
            {logs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
                  <h3 className="text-sm font-mono font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    System Logs
                  </h3>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto font-mono text-xs space-y-2">
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-muted-foreground/50">[{log.time}]</span>
                      <span className={`flex-1 ${
                        log.type === "success" ? "text-green-400" :
                        log.type === "warning" ? "text-yellow-400" :
                        log.type === "error" ? "text-red-400" :
                        "text-muted-foreground"
                      }`}>
                        {log.type === "success" && <CheckCircle className="w-3 h-3 inline mr-2" />}
                        {log.type === "warning" && <AlertTriangle className="w-3 h-3 inline mr-2" />}
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reset Button */}
            {!isSimulating && phase !== "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-8"
              >
                <button
                  onClick={resetSimulation}
                  className="px-8 py-4 rounded-full bg-primary text-black font-semibold hover:shadow-[0_0_40px_hsl(var(--glow)/0.5)] transition-all duration-300"
                >
                  Run Another Simulation
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AttackSimulation;
