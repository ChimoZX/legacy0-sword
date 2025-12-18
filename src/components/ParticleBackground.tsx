// src/components/ParticleBackground.tsx
import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: MagicParticle[] = [];

    // Clase para la partícula mágica
    class MagicParticle {
      x: number; y: number; size: number; baseSize: number;
      speedY: number; driftSpeed: number; driftAngle: number;
      color: string; alpha: number; pulseSpeed: number; pulseAngle: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        // Usamos las dimensiones pasadas al constructor para asegurar que cubran todo
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.speedY = Math.random() * 0.3 + 0.1; 
        this.driftSpeed = Math.random() * 0.02 + 0.01;
        this.driftAngle = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.6 ? '212, 175, 55' : '79, 209, 197'; // Dorado o Cian
        this.alpha = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.y -= this.speedY;
        this.driftAngle += this.driftSpeed;
        this.x += Math.sin(this.driftAngle) * 0.5;
        this.pulseAngle += this.pulseSpeed;
        this.alpha = 0.3 + Math.sin(this.pulseAngle) * 0.2;
        this.size = this.baseSize + Math.sin(this.pulseAngle) * 0.5;

        // Reiniciar si salen de la pantalla
        if (this.y < -10) {
          this.y = canvasHeight + 10;
          this.x = Math.random() * canvasWidth;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgb(${this.color})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size < 0 ? 0.1 : this.size, 0, Math.PI * 2);
        ctx.fill();
        // Núcleo blanco
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Función para iniciar/reiniciar partículas
    const initParticles = () => {
      particles = [];
      // ANTES: window.innerWidth < 768 ? 50 : 100;
      // AHORA: Bajamos a 20 en móvil y 60 en PC. 
      // 50 partículas son demasiadas para un móvil promedio con canvas.
      const count = window.innerWidth < 768 ? 20 : 60;
      
      for (let i = 0; i < count; i++) {
          particles.push(new MagicParticle(canvas.width, canvas.height));
      }
  }

    // Función para ajustar el tamaño del canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Importante: Reinicializar partículas cuando cambia el tamaño
      initParticles();
    };

    // --- CORRECCIÓN AQUÍ ---
    // 1. Añadimos el listener
    window.addEventListener('resize', resize);
    // 2. ¡LLAMAMOS A RESIZE INMEDIATAMENTE! 
    // Esto asegura que el canvas tenga el tamaño correcto ANTES de crear la primera partícula.
    resize(); 

    // Loop de animación
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-80" />;
};

export default ParticleBackground;