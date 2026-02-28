import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Terminal, Code, Shield, Target, Lightbulb, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Every line of code is written with security as the foundation, not an afterthought."
    },
    {
      icon: Code,
      title: "Built from Scratch",
      description: "No shortcuts, no templates. Everything is custom-built to solve real problems."
    },
    {
      icon: Users,
      title: "Honest Service",
      description: "No upselling, no corporate BS. Just straightforward solutions that work."
    },
    {
      icon: Target,
      title: "Problem-Focused",
      description: "I build what you actually need, not what's easiest to sell."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section with Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20"
            >
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                {/* Profile Photo */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="relative w-64 h-64 md:w-72 md:h-72">
                    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                      <img 
                        src="/WhatsApp Image 2026-02-28 at 23.50.06.jpeg" 
                        alt="Shivansh - CEO of Pixel Cyber Tech"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 text-center md:text-left"
                >
                  <h1 className="text-5xl md:text-6xl font-bold font-display mb-3">
                    Hey, I'm <span className="text-primary">Shivansh</span>
                  </h1>
                  <p className="text-2xl md:text-3xl text-muted-foreground mb-6">
                    CEO & Founder, Pixel Cyber Tech
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    Building security solutions that actually make sense for small businesses. 
                    No corporate BS, just honest work.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* My Story */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-24"
            >
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-10 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <Terminal className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold font-display">My Story</h2>
                </div>
                
                <div className="space-y-6 text-lg text-muted-foreground leading-[1.8]">
                  <p>
                    Hey, I'm <span className="text-primary font-semibold">Shivansh</span>, and I'm 20 years old. 
                    I started Pixel Cyber Tech because I kept seeing the same problem everywhere: small businesses 
                    getting sold expensive "enterprise security solutions" they didn't need and couldn't afford.
                  </p>
                  
                  <p>
                    I taught myself to code at 16. Not because I wanted to be a developer, but because I was 
                    curious about how things worked under the hood. By 18, I'd built my first security tool—nothing 
                    fancy, just something that solved a real problem I saw.
                  </p>
                  
                  <p>
                    My <span className="text-primary font-semibold">dad</span> always told me: if you're going to do something, 
                    do it right. My <span className="text-primary font-semibold">mom</span> taught me to keep pushing forward 
                    even when things get hard (and trust me, starting a business at 20 is hard). And my{" "}
                    <span className="text-primary font-semibold">grandpa</span>? He's the one who taught me to think 
                    three steps ahead—which is basically what security is all about.
                  </p>
                  
                  <p>
                    I write every line of code myself. No outsourcing, no copy-paste from GitHub. If my name's on it, 
                    I need to know exactly how it works and be able to fix it at 2 AM if something breaks.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-10">
                  <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30">
                    <span className="text-base font-medium text-primary">Self-taught since 16</span>
                  </div>
                  <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30">
                    <span className="text-base font-medium text-primary">First tool at 18</span>
                  </div>
                  <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30">
                    <span className="text-base font-medium text-primary">CEO at 20</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="mb-24"
            >
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-10 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <Lightbulb className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold font-display">My Vision</h2>
                </div>
                
                <div className="space-y-6 text-lg text-muted-foreground leading-[1.8]">
                  <p>
                    I want to change how small businesses think about cybersecurity. Right now, it's either 
                    "too expensive" or "too complicated." That's wrong. Security should be accessible, 
                    understandable, and actually useful.
                  </p>
                  
                  <p>
                    My goal with Pixel Cyber Tech is simple: build custom security tools that solve real problems 
                    for real businesses. No bloated software with features you'll never use. No confusing dashboards 
                    that require a PhD to understand. Just clean, effective security that works.
                  </p>
                  
                  <p>
                    I'm not trying to build the next billion-dollar company. I'm trying to build something that 
                    actually helps people sleep better at night, knowing their business data is safe. If I can do 
                    that for even a handful of businesses, I'll consider this a success.
                  </p>
                  
                  <p className="text-primary font-semibold text-xl">
                    Security shouldn't be a luxury. It should be a standard.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12">
                What I Stand For
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, i) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-display mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-12">
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                  Let's Work Together
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  If you're a small business looking for honest, effective security solutions, 
                  let's talk. No sales pitch, just a conversation about what you actually need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:shivansh@pixlcyber.com"
                    className="px-8 py-4 rounded-full bg-primary text-black font-semibold hover:shadow-[0_0_40px_hsl(var(--glow)/0.5)] transition-all duration-300"
                  >
                    Email Me
                  </a>
                  <a
                    href="tel:+916304484526"
                    className="px-8 py-4 rounded-full border border-border/50 text-foreground font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    Call: +91 6304484526
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
