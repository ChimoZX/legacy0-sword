import { useEffect, useRef, useState } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Estado para saber si estamos en móvil
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detectar si es móvil al cargar
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Chequear al inicio
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // SI ES MÓVIL: NO ejecutar nada de lógica de Canvas (Ahorro de CPU 100%)
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: MagicParticle[] = [];
    let animationFrameId: number;

    class MagicParticle {
      x: number; y: number; size: number; baseSize: number;
      speedY: number; driftSpeed: number; driftAngle: number;
      color: string; alpha: number; pulseSpeed: number; pulseAngle: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.speedY = Math.random() * 0.3 + 0.1; 
        this.driftSpeed = Math.random() * 0.02 + 0.01;
        this.driftAngle = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.6 ? '212, 175, 55' : '79, 209, 197'; 
        this.alpha = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update(canvasHeight: number) {
        this.y -= this.speedY;
        this.driftAngle += this.driftSpeed;
        this.x += Math.sin(this.driftAngle) * 0.5;
        this.pulseAngle += this.pulseSpeed;
        this.alpha = 0.3 + Math.sin(this.pulseAngle) * 0.2;
        this.size = this.baseSize + Math.sin(this.pulseAngle) * 0.5;

        if (this.y < -10) {
          this.y = canvasHeight + 10;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
        particles = [];
        // En PC usamos 70 partículas (buen balance)
        const count = 70;
        for (let i = 0; i < count; i++) {
            particles.push(new MagicParticle(canvas.width, canvas.height));
        }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 'lighter' es costoso, lo quitamos para más rendimiento
      // ctx.globalCompositeOperation = 'lighter'; 
      particles.forEach((p) => {
        p.update(canvas.height);
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]); // Se reinicia si cambia de móvil a escritorio

  // RENDERIZADO CONDICIONAL:
  // Si es móvil -> Renderiza un DIV estático (Cero consumo de CPU)
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        {/* Simulación de partículas estáticas con gradientes radiales CSS */}
        <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"></div>
        <div className="absolute top-[50%] left-[80%] w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37] opacity-50"></div>
        <div className="absolute top-[80%] left-[30%] w-1 h-1 bg-[#4fd1c5] rounded-full shadow-[0_0_10px_#4fd1c5]"></div>
        <div className="absolute top-[10%] left-[70%] w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent"></div>
      </div>
    );
  }

  // Si es PC -> Renderiza el Canvas animado
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-80" />;
};

export default ParticleBackground;