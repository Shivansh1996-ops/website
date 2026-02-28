import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      fadeSpeed: number;
    }> = [];

    // Create elegant floating particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        fadeSpeed: Math.random() * 0.01 + 0.005,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Pulsing opacity
        particle.opacity += particle.fadeSpeed;
        if (particle.opacity >= 0.7 || particle.opacity <= 0.15) {
          particle.fadeSpeed *= -1;
        }

        // Draw particle with elegant glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 5
        );
        gradient.addColorStop(0, `rgba(134, 239, 172, ${particle.opacity})`);
        gradient.addColorStop(0.4, `rgba(74, 222, 128, ${particle.opacity * 0.6})`);
        gradient.addColorStop(1, "rgba(74, 222, 128, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright core
        ctx.fillStyle = `rgba(187, 247, 208, ${particle.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const opacity = (1 - distance / 180) * 0.2;
            ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

export default ParticleBackground;
