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
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[11px] font-mono text-primary uppercase tracking-[0.4em] mb-4 block">
                Who I Am
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 leading-[1.05] tracking-tight">
                Started from scratch,
                <br />
                <span className="text-primary">learned from the best.</span>
              </h2>
              <p className="text-muted-foreground leading-[1.7] mb-5 text-base">
                Hey, I'm Shivansh. I'm 20, and I started Pixels Cyber because I kept seeing small businesses 
                get sold overpriced "solutions" they didn't need. Figured I could do better.
              </p>
              <p className="text-muted-foreground leading-[1.7] mb-5 text-base">
                My <span className="text-primary font-semibold">dad</span> taught me that if you're going to do something, 
                do it right. My <span className="text-primary font-semibold">mom</span> taught me to keep going even when 
                it's hard (and trust me, starting a business at 20 is hard). And my <span className="text-primary font-semibold">grandpa</span>? 
                He's the one who taught me to think three steps ahead—which is basically what security is.
              </p>
              <p className="text-muted-foreground leading-[1.7] mb-8 text-base">
                I write every line of code myself. No outsourcing, no copy-paste from GitHub. 
                If my name's on it, I need to know exactly how it works and be able to fix it at 2 AM if something breaks.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-sm text-primary">Self-taught since 16</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-sm text-primary">First tool at 18</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-sm text-primary">Running this at 20</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Terminal className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] font-mono text-muted-foreground">
                      threat_monitor
                    </span>
                  </div>
                </div>
                {/* Terminal body */}
                <div className="p-5 font-mono text-xs leading-loose space-y-0.5">
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
