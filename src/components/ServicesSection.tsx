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
          <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold font-display leading-[1.1] tracking-tight mb-2">
                Two things.
                <br />
                <span className="text-primary">Done right.</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="text-muted-foreground leading-[1.8] text-lg">
                Honestly? I do two things really well: I find holes in your security, and I build custom tools to patch them. 
                Everything else is just variations of those two. No packages, no tiers, no "enterprise plans."
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="h-full p-8 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-500 overflow-hidden">
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                  
                  <div className="relative z-10">
                    {/* Icon and Title Row */}
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_hsl(var(--glow)/0.4)] transition-all duration-300 border border-primary/20 flex-shrink-0"
                      >
                        <service.icon className="w-7 h-7 text-primary" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-base text-muted-foreground leading-[1.7] group-hover:text-gray-300 transition-colors duration-300">
                      {service.description}
                    </p>
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
