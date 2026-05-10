import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import api from '../services/api';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  category: string;
}

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" x2="21" y1="14" y2="3"/>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        if (response.data.success && response.data.projects.length > 0) {
          setProjects(response.data.projects);
        } else {
          setProjects([]);
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects from server');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fullstack: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      frontend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      backend: 'bg-green-500/20 text-green-400 border-green-500/30',
      mobile: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      design: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-[#60a5fa] font-medium mb-2">Portfolio</p>
          <h2 className="text-4xl font-bold mb-4">Featured <span className="gradient-text">Projects</span></h2>
          <p className="text-gray-400 mb-12 max-w-2xl">Here are some of my recent projects that showcase my skills and expertise in full-stack development.</p>

          {error && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-[#3b82f6]">
                <LoaderIcon />
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No projects yet. Add some from the admin panel!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={isVisible ? { opacity: 1, y: 0 } : {}} 
                  transition={{ delay: index * 0.1, duration: 0.5 }} 
                  className="card group overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#1e3a8a]/50 to-[#1e293b] rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-[#3b82f6]/30 group-hover:text-[#3b82f6]/60 transition-colors">
                        <CodeIcon />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border capitalize ${getCategoryColor(project.category)}`}>
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-lg flex items-center gap-1">
                        <StarIcon />
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#60a5fa] transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs bg-[#3b82f6]/10 text-[#60a5fa] rounded-full">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <GithubIcon /> Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#60a5fa] transition-colors">
                        <ExternalLinkIcon /> Live Demo
                      </a>
                    )}
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

export default Projects;