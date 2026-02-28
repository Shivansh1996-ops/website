import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-card to-surface overflow-hidden backdrop-blur-sm"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
            
            <div className="relative z-10 px-8 md:px-16 py-20 md:py-24">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold font-display leading-[1.1] tracking-tight mb-5">
                    Not sure where
                    <br />
                    <span className="text-primary">to start?</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Send me an email or give me a call. Tell me what's worrying you about your security, 
                    and I'll let you know if I can help. No sales pitch, just an honest conversation.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <a
                    href="mailto:shivansh@pixlcyber.com"
                    className="group px-8 py-4 rounded-full bg-primary text-black font-semibold text-sm flex items-center justify-center gap-3 hover:shadow-[0_0_60px_hsl(var(--glow)/0.6)] transition-all duration-500"
                  >
                    Email Me
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="tel:+916304484526"
                    className="px-8 py-4 rounded-full border border-border/50 text-foreground font-semibold text-sm text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
                  >
                    Or Call: +91 6304484526
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
