import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Terminal } from "lucide-react";

const terminalLines = [
  { text: "$ security-scan --target=network", type: "command", delay: 0.4 },
  { text: "Initializing security monitoring system", type: "info", delay: 0.7 },
  { text: "Scanning network endpoints...", type: "info", delay: 1.0 },
  { text: "Analyzing traffic patterns", type: "info", delay: 1.3 },
  { text: "Potential security issue detected", type: "warn", delay: 1.6 },
  { text: "Applying security protocols", type: "success", delay: 1.9 },
  { text: "System secured successfully ✓", type: "success", delay: 2.2 },
];

const typeColors: Record<string, string> = {
  command: "text-foreground",
  info: "text-muted-foreground",
  warn: "text-yellow-400/80",
  error: "text-destructive/80",
  success: "text-green-400/80",
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={ref} className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold font-display mb-10 leading-[1.15] tracking-tight">
                <span className="text-primary">Hey, I'm Shivansh.</span>
                <br />
                <span className="text-foreground text-4xl md:text-5xl">CEO, Pixel Cyber Tech.</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground/80 mb-12 leading-[1.4]">
                Started from scratch, learned from the best.
              </p>
              
              <div className="space-y-8 mb-12">
                <p className="text-muted-foreground leading-[1.9] text-lg">
                  I'm 20, started Pixel Cyber Tech because small businesses were getting sold overpriced "solutions" they didn't need.
                </p>
                <p className="text-muted-foreground leading-[1.9] text-lg">
                  My <span className="text-primary font-semibold">dad</span> taught me to do things right. 
                  My <span className="text-primary font-semibold">mom</span> taught me to keep going when it's hard. 
                  My <span className="text-primary font-semibold">grandpa</span> taught me to think three steps ahead—which is basically what security is.
                </p>
                <p className="text-muted-foreground leading-[1.9] text-lg">
                  I write every line myself. If my name's on it, I need to know exactly how it works.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="px-5 py-3 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/15 transition-colors"
                >
                  <span className="text-sm font-medium text-primary">Self-taught since 16</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="px-5 py-3 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/15 transition-colors"
                >
                  <span className="text-sm font-medium text-primary">First tool at 18</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="px-5 py-3 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/15 transition-colors"
                >
                  <span className="text-sm font-medium text-primary">Running this at 20</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="rounded-xl border border-primary/20 overflow-hidden bg-card/50 backdrop-blur-sm shadow-[0_0_50px_rgba(74,222,128,0.1)]">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/20 bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Terminal className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-mono text-primary">
                      threat_monitor
                    </span>
                  </div>
                </div>
                {/* Terminal body */}
                <div className="p-6 font-mono text-sm leading-loose space-y-1">
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: line.delay, duration: 0.3 }}
                      className={typeColors[line.type]}
                    >
                      {line.type === "command" ? (
                        <>
                          <span className="text-primary">$</span> {line.text.slice(2)}
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground/40">
                            [{line.type === "info" ? "INFO" : line.type === "warn" ? "WARN" : line.type === "error" ? "THREAT" : "OK"}]
                          </span>{" "}
                          {line.text}
                        </>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2.5 }}
                  >
                    <span className="text-primary">$</span>{" "}
                    <span className="animate-pulse text-foreground">▊</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
