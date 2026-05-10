import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-[#3b82f6]" />
            <span className="font-bold">Bamidele<span className="text-[#3b82f6]">.dev</span></span>
          </div>
          <p className="text-gray-400 text-sm flex items-center gap-1">Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React & Node.js</p>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Bamidele Azeem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;