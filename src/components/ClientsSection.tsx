import { motion } from "framer-motion";

const clients = [
  "COMPANY A",
  "COMPANY B",
  "COMPANY C",
  "COMPANY D",
  "COMPANY E",
  "COMPANY F",
  "COMPANY G",
  "COMPANY H",
];

const ClientsSection = () => {
  return (
    <section className="relative py-16 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <span className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-[0.4em]">
          Trusted by Industry Leaders
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          animate={{ x: [0, -1600] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center whitespace-nowrap"
        >
          {[...clients, ...clients, ...clients].map((client, i) => (
            <span
              key={i}
              className="text-sm font-mono text-muted-foreground/30 tracking-[0.2em] font-medium select-none"
            >
              {client}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;
