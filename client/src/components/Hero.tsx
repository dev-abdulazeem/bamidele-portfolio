import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const [text, setText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const fullText = 'Full Stack Developer';
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  useEffect(() => {
    setIsLoaded(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 90);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center"
      >
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-slate-400">
            Available for projects
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8"
        >
          <span className="text-white block leading-[0.9]">Bamidele</span>
          <span className="text-slate-400 block leading-[0.9] mt-2">Azeem</span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="h-8 mb-12"
        >
          <span className="text-base sm:text-lg text-slate-400 font-light tracking-wide">
            {text}
            <span className="inline-block w-[1.5px] h-5 bg-slate-500 ml-1 animate-pulse align-middle" />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-slate-300 max-w-lg mx-auto mb-14 text-base leading-relaxed"
        >
          Building scalable web applications with modern technologies. 
          Focused on creating products that matter.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <button 
            onClick={() => scrollToSection('projects')}
            className="btn-primary flex items-center gap-2.5 group"
          >
            View Work
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button 
            onClick={() => scrollToSection('contact')}
            className="btn-outline"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex justify-center gap-6 text-sm"
        >
          {[
            { label: 'GitHub', href: 'https://github.com/dev-abdulazeem' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'Twitter', href: 'https://twitter.com' },
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;