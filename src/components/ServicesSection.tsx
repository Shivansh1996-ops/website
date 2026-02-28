import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Radar, Bug, Server, Lock, Zap } from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "Security Consulting",
    description: "I'll audit your setup, find what's vulnerable, and give you a straight answer about what needs fixing first. No 50-page reports full of jargon.",
    num: "01",
    color: "from-green-500/10 to-emerald-500/10"
  },
  {
    icon: Radar,
    title: "Custom Security Tools",
    description: "Need something specific? I'll build it from scratch. Could be a monitoring dashboard, an automated scanner, whatever solves your actual problem.",
    num: "02",
    color: "from-emerald-500/10 to-teal-500/10"
  },
  {
    icon: Bug,
    title: "Vulnerability Testing",
    description: "I'll try to break into your systems (with permission, obviously) and show you exactly where the weak points are before someone else finds them.",
    num: "03",
    color: "from-teal-500/10 to-cyan-500/10"
  },
  {
    icon: Server,
    title: "Security Architecture",
    description: "Building something new? I'll help you design security into it from the start. Way easier than trying to add it later.",
    num: "04",
    color: "from-cyan-500/10 to-green-500/10"
  },
  {
    icon: Lock,
    title: "Compliance Help",
    description: "Got regulatory requirements? I'll help you actually meet them, not just check boxes. GDPR, SOC 2, whatever you need.",
    num: "05",
    color: "from-green-500/10 to-lime-500/10"
  },
  {
    icon: Zap,
    title: "Incident Response",
    description: "Something went wrong? I'll help you contain it, figure out what happened, and patch it so it doesn't happen again. Usually available same-day.",
    num: "06",
    color: "from-lime-500/10 to-green-500/10"
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4">
                <span className="text-[12px] font-mono font-bold text-primary uppercase tracking-[0.35em] px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
                  ⚙️ What I Do
                </span>
              </div>
              <h2 className="text-[48px] md:text-[112px] font-extrabold font-display leading-[0.92] tracking-tight">
                <span className="block text-foreground">Two things.</span>
                <span className="block text-primary">Done right.</span>
              </h2>
              <div className="w-full max-w-[720px] h-2 rounded-full bg-gradient-to-r from-primary/80 to-primary/40 mt-6 mb-8 shadow-[0_8px_40px_rgba(34,197,94,0.14)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex items-end"
            >
              <p className="text-muted-foreground leading-relaxed text-base">
                Honestly? I do two things really well: I find holes in your security, and I build custom tools to patch them. 
                Everything else is just variations of those two. No packages, no tiers, no "enterprise plans."
              </p>
            </motion.div>
          </div>

          <div className="space-y-3">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div className="flex items-start gap-4 p-6 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent group-hover:w-1.5 transition-all duration-300" />
                  
                  {/* Number badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
                    <span className="text-[11px] font-mono font-bold text-primary">
                      {service.num}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                        className="w-5 h-5 text-primary group-hover:text-primary transition-colors flex-shrink-0"
                      >
                        <service.icon className="w-5 h-5" />
                      </motion.div>
                      <h3 className="text-base font-semibold font-display group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Hover arrow */}
                  <div className="flex-shrink-0 text-muted-foreground/0 group-hover:text-primary/60 transition-all duration-300 text-2xl">
                    ›
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
