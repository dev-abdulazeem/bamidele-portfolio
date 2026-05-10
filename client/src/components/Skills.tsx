import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getAllSkills } from '../services/api';
import { Loader2 } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

const defaultSkills: Skill[] = [
  { id: 1, name: 'React', category: 'frontend', proficiency: 95 },
  { id: 2, name: 'TypeScript', category: 'frontend', proficiency: 90 },
  { id: 3, name: 'Node.js', category: 'backend', proficiency: 92 },
  { id: 4, name: 'PostgreSQL', category: 'database', proficiency: 88 },
  { id: 5, name: 'Docker', category: 'devops', proficiency: 80 },
  { id: 6, name: 'AWS', category: 'devops', proficiency: 75 },
  { id: 7, name: 'Git', category: 'tools', proficiency: 95 },
  { id: 8, name: 'Problem Solving', category: 'soft', proficiency: 90 },
  { id: 9, name: 'Figma Design', category: 'design', proficiency: 85 },
];

const Skills = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [skills, setSkills] = useState<Skill[]>(defaultSkills); // ← Start with defaults
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getAllSkills();
        console.log('Skills response:', response.data);
        
        if (response.data?.skills?.length > 0) {
          setSkills(response.data.skills);
        }
        // If API returns empty, we keep defaults
      } catch (error) {
        console.error('Skills fetch failed:', error);
        // Keep default skills on error
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = ['all', ...new Set(skills.map(s => s.category))];
  const filteredSkills = activeCategory === 'all' ? skills : skills.filter(s => s.category === activeCategory);
  
  const categoryLabels: Record<string, string> = { 
    all: 'All Skills', 
    frontend: 'Frontend', 
    backend: 'Backend', 
    database: 'Database', 
    devops: 'DevOps', 
    tools: 'Tools', 
    soft: 'Soft Skills',
    design: 'Design'
  };

  return (
    <section id="skills" className="section-padding bg-[#1e293b]/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-[#60a5fa] font-medium mb-2">Expertise</p>
          <h2 className="text-4xl font-bold mb-4">Technical <span className="gradient-text">Skills</span></h2>
          <p className="text-gray-400 mb-8 max-w-2xl">Technologies and tools I use to bring ideas to life.</p>

          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#2563eb] text-white' 
                    : 'bg-[#1e293b] text-gray-400 hover:text-white hover:bg-[#334155]'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No skills found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSkills.map((skill, index) => (
                <motion.div 
                  key={skill.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}} 
                  transition={{ delay: index * 0.05, duration: 0.4 }} 
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">{skill.name}</h3>
                    <span className="text-[#60a5fa] text-sm font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-[#334155] rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={isVisible ? { width: `${skill.proficiency}%` } : {}} 
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }} 
                      className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-2 rounded-full" 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;