import { useState, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Volume2, VolumeX, ChevronDown, Sparkles, Map, Shield, History, Cloud, Skull, Play, Globe } from 'lucide-react';

// --- OPTIMIZACIÓN DE RENDIMIENTO: Carga diferida del fondo ---
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));

// --- DATA & IDIOMAS (SIN IMÁGENES - SOLO PLACEHOLDERS) ---
const CONTENT = {
  en: {
    nav: { title: "The Legacy", audioOn: "Audio On", audioOff: "Audio Off" },
    hero: {
      title: "LEGACY",
      subtitle: "OF THE GOLDEN SWORD",
      explore: "Start Journey"
    },
    section: {
      title: "The Chronicles",
      subtitle: "Echoes of a Forgotten Age"
    },
    timeline: [
      {
        title: "Era of the Ascendants",
        game: "Chapter I",
        desc: "In the beginning, the islands floated above the clouds. The Golden Sword was forged in dragon fire to seal the Primordial Evil.",
        img: "", 
        icon: <Cloud size={20} />
      },
      {
        title: "The Time Fracture",
        game: "Chapter II",
        desc: "The Guardian of Time shattered the timeline. One hero, three destinies. The reality split into distinct paths of light and shadow.",
        img: "",
        icon: <History size={20} />
      },
      {
        title: "Reign of Shadows",
        game: "Dark Path",
        desc: "The hero failed. The Dark Warlord claimed the Golden Power, plunging the kingdom into an age of despair and eternal night.",
        img: "",
        icon: <Skull size={20} />
      },
      {
        title: "The Eclipse War",
        game: "Shadow Path",
        desc: "Dimensions collided. The Realm of Twilight invaded the lands of men, forcing the last guardian to embrace the beast within.",
        img: "",
        icon: <Shield size={20} />
      },
      {
        title: "The Sunken World",
        game: "Ocean Path",
        desc: "To stop the spreading fire, the Ancient Gods flooded the world. Now, only the highest peaks remain as islands in a vast sea.",
        img: "",
        icon: <Map size={20} />
      }
    ],
    card: {
      gameLabel: "Saga",
      readMore: "Read Lore"
    },
    footer: "An Interactive Fantasy Portfolio"
  },
  es: {
    nav: { title: "El Legado", audioOn: "Sonido On", audioOff: "Sonido Off" },
    hero: {
      title: "LEGACY",
      subtitle: "OF THE GOLDEN SWORD",
      explore: "Comenzar Viaje"
    },
    section: {
      title: "Las Crónicas",
      subtitle: "Ecos de una Era Olvidada"
    },
    timeline: [
      {
        title: "Era de los Ascendidos",
        game: "Capítulo I",
        desc: "Al principio, las islas flotaban sobre las nubes. La Espada Dorada fue forjada en fuego de dragón para sellar al Mal Primordial.",
        img: "", 
        icon: <Cloud size={20} />
      },
      {
        title: "La Fractura del Tiempo",
        game: "Capítulo II",
        desc: "El Guardián del Tiempo rompió la cronología. Un héroe, tres destinos. La realidad se dividió en caminos de luz y sombra.",
        img: "",
        icon: <History size={20} />
      },
      {
        title: "Reino de las Sombras",
        game: "Senda Oscura",
        desc: "El héroe falló. El Señor Oscuro reclamó el Poder Dorado, sumiendo al reino en una era de desesperación y noche eterna.",
        img: "",
        icon: <Skull size={20} />
      },
      {
        title: "La Guerra del Eclipse",
        game: "Senda Sombría",
        desc: "Las dimensiones colisionaron. El Reino del Crepúsculo invadió las tierras de los hombres, forzando al guardián a abrazar su lado salvaje.",
        img: "",
        icon: <Shield size={20} />
      },
      {
        title: "El Mundo Hundido",
        game: "Senda Oceánica",
        desc: "Para detener el fuego, los Dioses Antiguos inundaron el mundo. Ahora, solo los picos más altos permanecen como islas en un vasto mar.",
        img: "",
        icon: <Map size={20} />
      }
    ],
    card: {
      gameLabel: "Saga",
      readMore: "Leer Historia"
    },
    footer: "Un Portafolio Interactivo de Fantasía"
  }
};

const IMAGES = {
  music: "/zelda8bit.mp3" 
};

// --- COMPONENTE DE TÍTULO ANIMADO ---
const AnimatedTitle = ({ text }: { text: string }) => {
  const letters = Array.from(text);
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.h1
      className="text-4xl sm:text-6xl md:text-9xl font-serif font-bold text-[#D4AF37] tracking-[0.2em] flex flex-wrap justify-center overflow-hidden py-4 mix-blend-screen px-2 text-center"
      style={{ textShadow: '0 0 20px rgba(212,175,55,0.4)' }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const App = () => {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();
  const t = CONTENT[lang];

  const ySword = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans overflow-x-hidden relative selection:bg-[#D4AF37]/30 cursor-auto">
      
      <audio ref={audioRef} loop src={IMAGES.music} crossOrigin="anonymous" />
      
      <div className="fixed inset-0 z-0">
        {/* SUSPENSE: Evita que la carga de partículas bloquee el resto de la página */}
        <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
           <ParticleBackground />
        </Suspense>
      </div>

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed top-0 w-full z-[60] flex justify-between items-center p-6 md:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto"
      >
        <div className="flex items-center gap-3">
           <Sparkles className="text-[#D4AF37] animate-pulse" size={20} />
           <span className="text-white/80 font-serif text-xs tracking-[0.3em] uppercase border-b border-[#D4AF37]/50 pb-1">{t.nav.title}</span>
        </div>
        
        <div className="flex items-center gap-4">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLang}
                className="group flex items-center gap-2 px-4 py-2 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all backdrop-blur-md"
            >
                <Globe size={14} />
                <span className="text-[10px] font-bold tracking-widest w-[20px] text-center">{lang.toUpperCase()}</span>
            </motion.button>

            <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className={`group flex items-center gap-3 px-5 py-2 rounded-sm border transition-all duration-500 backdrop-blur-md ${isMuted ? 'border-white/10 bg-white/5 text-gray-400' : 'border-[#D4AF37]/50 bg-[#D4AF37]/5 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'}`}
            >
            <span className="text-[10px] uppercase tracking-widest font-bold hidden md:block group-hover:tracking-[0.2em] transition-all">
                {isMuted ? t.nav.audioOff : t.nav.audioOn}
            </span>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </motion.button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-between items-center overflow-hidden z-10 bg-transparent">
        
        <div className="h-24 w-full"></div>

        <div className="flex-grow flex flex-col justify-center items-center w-full px-4 relative">
          
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-0 z-[50] bg-white pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white via-[#D4AF37] to-black opacity-20"></div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="will-change-transform w-full flex flex-col items-center"
          >
            <AnimatedTitle text={t.hero.title} />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex items-center justify-center gap-4 sm:gap-6 mt-6 max-w-full px-4"
            >
                <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                <p className="text-[#D4AF37] font-sans tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-medium uppercase opacity-80 text-center whitespace-nowrap">
                  {t.hero.subtitle}
                </p>
                <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
            </motion.div>
          </motion.div>

          {/* ESPADA Y BRILLO FINO */}
          <motion.div 
            style={{ y: ySword }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="mt-12 sm:mt-16 relative w-full flex justify-center will-change-transform"
          >
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="relative flex justify-center items-center"
            >
               {/* BRILLO VERTICAL FINO (Optimizado) */}
               <motion.div 
                 animate={{ opacity: [0.3, 0.5, 0.3] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[300px] sm:h-[400px] shadow-[0_0_120px_60px_rgba(212,175,55,0.25)]"
               ></motion.div>
               
               <div className="scale-75 sm:scale-100 transform-gpu">
                  <MasterSwordSVG />
               </div>
            </motion.div>
          </motion.div>
        </div>

        {/* INDICADOR DE SCROLL */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} 
          transition={{ delay: 2, duration: 1 }}
          className="pb-8 sm:pb-12 flex flex-col items-center justify-center gap-2 z-20 w-full"
        >
          <span 
            className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] text-center font-bold"
          >
            {t.hero.explore}
          </span>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-[#D4AF37]" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- SECCIÓN 2: LÍNEA TEMPORAL --- */}
      <section className="relative z-20 bg-gradient-to-b from-[#050505] to-[#0a0a0a] py-20 sm:py-40 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto space-y-24 sm:space-y-48">
          <SectionTitle title={t.section.title} subtitle={t.section.subtitle} />
          
          <div className="space-y-24 sm:space-y-40">
            {t.timeline.map((item, index) => (
              <StoryBlock key={index} data={item} labels={t.card} align={index % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 text-center bg-[#050505] z-20 relative border-t border-[#D4AF37]/10">
         <div className="flex justify-center items-center gap-2 text-[#D4AF37]/40 mb-4">
            <Sparkles size={14} />
         </div>
        <p className="text-white/20 text-xs tracking-[0.2em] uppercase font-serif">{t.footer}</p>
      </footer>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center relative z-10 mb-20 sm:mb-32 px-4">
    <motion.h2 
      key={title}
      initial={{ opacity: 0, y: 30, scale: 0.9 }} 
      whileInView={{ opacity: 1, y: 0, scale: 1 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-3xl sm:text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#8a7020] mb-4 sm:mb-6"
    >
      {title}
    </motion.h2>
    <motion.p 
      key={subtitle}
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 0.6 }} 
      transition={{ delay: 0.3 }}
      className="text-[#D4AF37] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-medium"
    >
      {subtitle}
    </motion.p>
  </div>
);

const MasterSwordSVG = () => (
  <motion.svg 
    whileHover={{ scale: 1.02, filter: "drop-shadow(0 0 25px rgba(212,175,55,0.4))" }}
    width="140" height="400" viewBox="0 0 140 400" fill="none" 
    className="drop-shadow-[0_0_10px_rgba(212,175,55,0.2)] transition-all duration-500"
  >
    <path d="M70 380L55 100H85L70 380Z" fill="url(#blade_grad)" stroke="#718096" strokeWidth="0.5" />
    <path d="M70 380L70 100" stroke="#A0AEC0" strokeWidth="0.5" />
    <path d="M70 115L66 122H74L70 115Z" fill="#D4AF37" filter="url(#glow)" />
    <path d="M70 100L40 90C30 80 20 60 30 50L70 75L110 50C120 60 110 80 100 90L70 100Z" fill="#2a2a4a" stroke="#D4AF37" strokeWidth="1.5" />
    <circle cx="70" cy="75" r="5" fill="#F6E05E" stroke="#D4AF37" />
    <rect x="65" y="20" width="10" height="55" rx="1" fill="#2a2a4a" stroke="#D4AF37" strokeWidth="1.5" />
    <circle cx="70" cy="20" r="7" fill="#2a2a4a" stroke="#D4AF37" strokeWidth="1.5" />
    <defs>
      <linearGradient id="blade_grad" x1="70" y1="100" x2="70" y2="380" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E2E8F0" /> <stop offset="0.5" stopColor="#CBD5E0" /> <stop offset="1" stopColor="#718096" />
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
  </motion.svg>
);

const StoryBlock = ({ data, labels, align }: any) => {
  const isRight = align === 'right';
  const { img, title, game, desc, icon } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, scale: 0.95 }} 
      whileInView={{ opacity: 1, y: 0, scale: 1 }} 
      viewport={{ once: true, margin: "-10%" }} 
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-20`}
    >
      <motion.div 
        className="w-full md:w-1/2 group relative"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-[#D4AF37] opacity-60 transition-all group-hover:w-full group-hover:h-full group-hover:opacity-100 duration-500"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r border-[#D4AF37] opacity-60 transition-all group-hover:w-full group-hover:h-full group-hover:opacity-100 duration-500"></div>

        <div className="relative aspect-[16/9] overflow-hidden bg-[#050505] backdrop-blur-sm border border-[#D4AF37]/10 flex items-center justify-center">
          {img ? (
             <>
               <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
               <img src={img} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale-[30%] group-hover:grayscale-0" />
             </>
          ) : (
             <div className="text-[#D4AF37]/5 transform scale-[3] group-hover:scale-[3.5] transition-transform duration-700">
               {icon}
             </div>
          )}
          
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <div className="w-1 h-8 bg-[#D4AF37]"></div>
            <div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold">{labels.gameLabel}</p>
              <p className="text-white text-xs tracking-widest font-serif">{game}</p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className={`w-full md:w-1/2 space-y-6 ${isRight ? 'md:text-right' : 'md:text-left'} relative px-4 md:px-0`}>
        <div className={`flex items-center gap-4 ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>
          <motion.div 
            animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 20px rgba(212,175,55,0.3)", "0 0 0px rgba(212,175,55,0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md shrink-0"
          >
            {icon}
          </motion.div>
          <div className="h-[1px] w-12 bg-[#D4AF37]/30"></div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white mb-4 leading-tight">{title}</h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light tracking-wide border-l-2 border-[#D4AF37]/20 pl-4 md:border-l-0 md:border-r-2 md:pr-4">{desc}</p>
        </div>
        <div className={`flex items-center gap-2 text-[#D4AF37]/60 text-xs tracking-[0.2em] uppercase cursor-pointer group-hover:text-[#D4AF37] transition-colors ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>
            <span>{labels.readMore}</span>
            <Play size={10} className="fill-current" />
        </div>
      </div>
    </motion.div>
  );
};

export default App;