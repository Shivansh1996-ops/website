import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multiple gradient glows for depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[180px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />
      
      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(3rem,8vw,7rem)] font-bold font-display leading-[1.1] tracking-tight mb-8 text-white mt-8"
        >
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block"
          >
            Real
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 30px rgba(74, 222, 128, 0.8)",
              transition: { duration: 0.3 }
            }}
            className="inline-block text-primary cursor-default"
            style={{
              textShadow: "0 0 20px rgba(74, 222, 128, 0.3)"
            }}
          >
            Security
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="inline-block"
          >
            Built for
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="inline-block"
          >
            Your Business
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12 px-4"
        >
          Cybersecurity doesn't have to drain your budget or confuse your team. 
          I build custom tools and help you fix what's actually broken—no fluff, no upsells.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="mailto:shivansh@pixlcyber.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 rounded-full bg-primary text-black font-semibold text-sm flex items-center gap-3 hover:shadow-[0_0_60px_hsl(var(--glow)/0.6)] transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">Let's Talk</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="relative z-10 w-4 h-4" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-xs text-gray-400 font-mono text-center">Scroll to learn more</span>
        <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
