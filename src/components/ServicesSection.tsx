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
                <span className="text-[11px] font-mono text-primary uppercase tracking-[0.4em] px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  What I Do
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display leading-[1.05] tracking-tight">
                Two things.
                <br />
                <span className="text-primary">Done right.</span>
              </h2>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group bg-card/50 backdrop-blur-sm p-8 hover:bg-surface transition-all duration-500 relative cursor-pointer border border-border/50 hover:border-primary/50 rounded-xl overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_hsl(var(--glow)/0.4)] transition-all duration-300 border border-primary/20"
                    >
                      <service.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <span className="text-[10px] font-mono text-muted-foreground/40 tracking-wider bg-muted/30 px-2 py-1 rounded">
                      {service.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold font-display mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {service.description}
                  </p>
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
