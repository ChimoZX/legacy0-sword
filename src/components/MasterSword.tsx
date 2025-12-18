import React from 'react';
import { motion } from 'framer-motion';

export const MasterSword = () => {
  // Animación del brillo
  const glowVariants = {
    initial: { filter: "drop-shadow(0 0 0px rgba(79, 209, 197, 0))" },
    animate: { 
      filter: [
        "drop-shadow(0 0 5px rgba(79, 209, 197, 0.3))",
        "drop-shadow(0 0 20px rgba(79, 209, 197, 0.7))",
        "drop-shadow(0 0 5px rgba(79, 209, 197, 0.3))"
      ],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    hover: {
      filter: "drop-shadow(0 0 40px rgba(212, 175, 55, 0.8))", // Dorado al hover
      transition: { duration: 0.3 }
    }
  };

  // Animación de levitación
  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },
    hover: {
      y: 0,
      rotate: [-1, 1, -1, 1, 0], // Vibrar
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="relative flex justify-center items-center h-[500px] w-full z-20 pointer-events-none">
       {/* Luz de fondo */}
       <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[300px] h-[600px] bg-zelda-ancient/10 blur-[80px] -z-10"
      />
      
      <motion.svg
        width="200" height="500" viewBox="0 0 200 500" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={floatVariants}
        animate="animate"
        whileHover="hover"
        className="cursor-pointer pointer-events-auto overflow-visible"
      >
        <motion.g variants={glowVariants} initial="initial" animate="animate" whileHover="hover">
          {/* Hoja */}
          <path d="M100 450 L85 120 L85 100 L115 100 L115 120 Z" fill="url(#bladeGradient)" stroke="#94A3B8" />
          <path d="M100 450 L100 120 L115 100" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/> 
          
          {/* Trifuerza */}
          <path d="M100 130 L95 140 H105 Z" fill="#D4AF37" />

          {/* Guarda (Alas) */}
          <path d="M100 120 L60 110 C50 100 40 80 50 70 L100 90 L150 70 C160 80 150 100 140 110 Z" fill="#312E81" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="100" cy="95" r="8" fill="#F59E0B" stroke="#D4AF37" />

          {/* Mango */}
          <rect x="92" y="30" width="16" height="60" rx="2" fill="#312E81" stroke="#D4AF37" />
          <circle cx="100" cy="30" r="10" fill="#312E81" stroke="#D4AF37" strokeWidth="2" />
        </motion.g>

        <defs>
          <linearGradient id="bladeGradient" x1="100" y1="80" x2="100" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
};