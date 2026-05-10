import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Code2, Database, Globe, Clock } from 'lucide-react';

const About = () => {
  const { ref, isVisible } = useScrollAnimation();

  const stats = [
    { icon: Code2, label: 'Projects Completed', value: '50+' },
    { icon: Database, label: 'Technologies', value: '20+' },
    { icon: Globe, label: 'Clients Worldwide', value: '30+' },
    { icon: Clock, label: 'Years Experience', value: '5+' },
  ];

  return (
    <section id="about" className="section-padding bg-[#1e293b]/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-[#60a5fa] font-medium mb-2">About Me</p>
          <h2 className="text-4xl font-bold mb-8">Passionate About Building <span className="gradient-text">Great Products</span></h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>I'm a Full Stack Developer with a passion for creating elegant, efficient, and user-friendly web applications. With expertise in both frontend and backend technologies, I bring ideas to life through clean code and innovative solutions.</p>
              <p>My journey in software development started 5 years ago, and since then, I've worked with startups and established companies to deliver high-quality digital products that make a real impact.</p>
              <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or mentoring aspiring developers in the community.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={isVisible ? { opacity: 1, scale: 1 } : {}} transition={{ delay: index * 0.1, duration: 0.4 }} className="card text-center">
                  <stat.icon className="w-8 h-8 text-[#3b82f6] mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;