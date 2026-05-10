import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = 'Full Stack Developer';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/20 via-[#0f172a] to-[#0f172a]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[#60a5fa] font-medium mb-4">Hello, I'm</p>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6">
            Bamidele <span className="gradient-text">Azeem</span>
          </h1>
          <div className="h-12 mb-8">
            <span className="text-2xl sm:text-3xl text-gray-300 font-light">
              {text}<span className="animate-pulse text-[#3b82f6]">|</span>
            </span>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            I build scalable web applications with modern technologies. Passionate about creating impactful digital experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => scrollToSection('projects')} className="btn-primary flex items-center justify-center gap-2">
              View My Work 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn-outline flex items-center justify-center gap-2">
              Download CV
            </button>
          </div>

          <div className="flex justify-center gap-6">
            <a href="https://github.com/dev-abdulazeem" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass hover:bg-[#3b82f6]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass hover:bg-[#3b82f6]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass hover:bg-[#3b82f6]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </motion.div>
    </section>
  );
};

export default Hero;