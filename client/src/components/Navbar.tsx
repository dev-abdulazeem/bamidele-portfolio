import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Code2 } from './Icons';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret: Triple-click logo to go to admin
  const [clickCount, setClickCount] = useState(0);
  
  useEffect(() => {
    if (clickCount >= 3) {
      navigate('/admin');
      setClickCount(0);
    }
    const timer = setTimeout(() => setClickCount(0), 500);
    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0f172a]/90 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Triple-click this logo to access admin */}
          <button 
            onClick={() => setClickCount(c => c + 1)}
            className="flex items-center gap-2 select-none"
          >
            <Code2 />
            <span className="text-xl font-bold">Bamidele<span className="text-[#3b82f6]">.dev</span></span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-sm font-medium text-gray-300 hover:text-[#60a5fa] transition-colors">
                {item}
              </button>
            ))}
            <button onClick={() => scrollToSection('contact')} className="btn-primary text-sm">Hire Me</button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0f172a]/95 backdrop-blur-lg border-b border-white/5">
          <div className="px-4 py-4 space-y-3">
            {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="block w-full text-left text-gray-300 hover:text-[#60a5fa] py-2">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;