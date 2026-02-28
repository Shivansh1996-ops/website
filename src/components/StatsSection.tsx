import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  { value: 100, suffix: "%", label: "Secure" },
  { value: 24, suffix: "/7", label: "Available" },
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Projects" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Number(current.toFixed(value % 1 !== 0 ? 2 : 0)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 border-b border-border">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center px-6 py-4"
            >
              <div className="text-3xl md:text-4xl font-bold font-display text-foreground mb-1.5">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
