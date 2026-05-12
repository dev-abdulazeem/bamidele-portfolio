import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Code,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Lock,
  Loader2,
  X,
  Upload,
  ExternalLink,
  Check,
  Eye,
  EyeOff,
  Search,
  Star,
  Menu,
} from 'lucide-react';
import api from '../services/api';

// ==================== CUSTOM ICONS (Preserved from your original) ====================
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

// ==================== INTERFACES ====================
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

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

// ==================== COMPONENT ====================
const AdminPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: '',
    featured: false,
    category: 'fullstack'
  });

  const categories = ['all', 'fullstack', 'frontend', 'backend', 'mobile', 'design'];

  // ==================== AUTH & DATA FETCHING ====================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/auth/me');
      if (res.data.user) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const res = await api.get('/projects');
        setProjects(res.data.projects || []);
      } else if (activeTab === 'messages') {
        const res = await api.get('/messages');
        setMessages(res.data.messages || []);
      } else if (activeTab === 'skills') {
        const res = await api.get('/skills');
        setSkills(res.data.skills || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== AUTH HANDLERS ====================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email: 'admin@bamidele.dev',
        password: password
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setIsAuthenticated(true);
        setError('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
  };

  // ==================== FORM HANDLERS ====================
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      image: '',
      featured: false,
      category: 'fullstack'
    });
    setImagePreview(null);
    setUploadedImageUrl('');
    setEditingProject(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: project.image || '',
      featured: project.featured || false,
      category: project.category || 'fullstack'
    });
    setImagePreview(project.image || null);
    setUploadedImageUrl(project.image || '');
    setShowModal(true);
  };

  // ==================== IMAGE UPLOAD ====================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Show preview immediately using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await api.post('/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = res.data.url;
      setUploadedImageUrl(imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    setUploadedImageUrl(url);
    setImagePreview(url || null);
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      image: uploadedImageUrl || formData.image || '',
      featured: formData.featured,
      category: formData.category
    };

    try {
      if (editingProject) {
        const res = await api.put(`/projects/${editingProject.id}`, projectData);
        setProjects(projects.map(p => p.id === editingProject.id ? res.data.project : p));
      } else {
        const res = await api.post('/projects', projectData);
        setProjects([...projects, res.data.project]);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editingProject ? 'update' : 'add'} project`);
    }
  };

  // ==================== DELETE HANDLERS ====================
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      alert('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      alert('Failed to delete skill');
    }
  };

  // ==================== FILTERS ====================
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Briefcase, count: projects.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => !m.read).length },
    { id: 'skills', label: 'Skills', icon: Code, count: skills.length },
  ];

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

  // ==================== RENDER: LOGIN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl shadow-black/50"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-white/10"
            >
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Admin Login
            </h2>
            <p className="text-gray-500 text-sm mt-2 sm:mt-3">
              Secure access to your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loginLoading || !password}
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          <button 
            onClick={() => navigate('/')}
            className="w-full mt-4 sm:mt-6 text-center text-gray-500 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Website
          </button>
        </motion.div>
      </div>
    );
  }

  // ==================== RENDER: DASHBOARD ====================
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-[#111827]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop: fixed, Mobile: overlay */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
              fixed md:static inset-y-0 left-0 z-40 w-[280px] bg-[#111827]/95 md:bg-[#111827]/90 
              backdrop-blur-xl border-r border-white/5 flex flex-col
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              transition-transform duration-300 md:transition-none
            `}
          >
            {/* Desktop Logo */}
            <div className="hidden md:block p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Portfolio Manager</p>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-bold text-sm">Menu</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group min-h-[48px] ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            <div className="p-4 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group min-h-[48px]"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen md:ml-0 overflow-x-hidden">
        {/* Desktop Header */}
        <div className="hidden md:block sticky top-0 z-30 bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold capitalize">{activeTab}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === 'projects' && `Managing ${projects.length} projects`}
                {activeTab === 'messages' && `${messages.filter(m => !m.read).length} unread messages`}
                {activeTab === 'skills' && `${skills.length} skills listed`}
              </p>
            </div>
            
            {activeTab === 'projects' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddModal} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 text-sm sm:text-base"
              >
                <Plus className="w-5 h-5" /> 
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Tab Title + Add Button */}
        <div className="md:hidden px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold capitalize">{activeTab}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeTab === 'projects' && `${projects.length} projects`}
              {activeTab === 'messages' && `${messages.filter(m => !m.read).length} unread`}
              {activeTab === 'skills' && `${skills.length} skills`}
            </p>
          </div>
          {activeTab === 'projects' && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 text-sm"
            >
              <Plus className="w-4 h-4" /> 
              Add
            </motion.button>
          )}
        </div>

        <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              <p className="text-gray-500 mt-4 text-sm">Loading data...</p>
            </div>
          ) : (
            <>
              {/* ========== PROJECTS TAB ========== */}
              {activeTab === 'projects' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Search & Filter */}
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                            filterCategory === cat
                              ? 'bg-blue-600 text-white'
                              : 'bg-[#111827] text-gray-400 border border-white/10 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-20 sm:py-32 bg-[#111827]/50 rounded-2xl border border-white/5"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-400 text-base sm:text-lg">No projects found</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-2 px-4">
                        {searchQuery ? 'Try adjusting your search' : 'Add your first project to get started'}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-3 sm:gap-4">
                      <AnimatePresence>
                        {filteredProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-[#111827]/80 backdrop-blur border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-white/10 transition-all duration-300"
                          >
                            <div className="flex flex-col gap-4">
                              {/* Project Image */}
                              <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-[#0a0f1c] border border-white/5 flex-shrink-0">
                                {project.image ? (
                                  <img 
                                    src={project.image} 
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        const fallback = document.createElement('div');
                                        fallback.className = 'w-full h-full flex items-center justify-center text-gray-600';
                                        parent.appendChild(fallback);
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <ImageIcon className="w-8 h-8" />
                                  </div>
                                )}
                                {project.featured && (
                                  <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-lg flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Featured
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors">
                                        {project.title}
                                      </h3>
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg border capitalize ${getCategoryColor(project.category)}`}>
                                        {project.category}
                                      </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                      {project.description}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-1.5 flex-shrink-0">
                                    <motion.button 
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => openEditModal(project)}
                                      className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all"
                                      title="Edit project"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button 
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                                      title="Delete project"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-3">
                                  <div className="flex flex-wrap gap-1.5">
                                    {project.technologies?.map((tech) => (
                                      <span key={tech} className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded-lg border border-white/5 font-medium">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    {project.githubUrl && (
                                      <a 
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <GithubIcon className="w-4 h-4" />
                                        Code
                                      </a>
                                    )}
                                    {project.liveUrl && (
                                      <a 
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* ========== MESSAGES TAB ========== */}
              {activeTab === 'messages' && (
                <div className="grid gap-3 sm:gap-4">
                  {messages.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-20 sm:py-32 bg-[#111827]/50 rounded-2xl border border-white/5"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-400 text-base sm:text-lg">No messages yet</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-2 px-4">Messages from your contact form will appear here</p>
                    </motion.div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className={`bg-[#111827]/80 backdrop-blur border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-white/10 transition-all ${
                            msg.read ? 'border-white/5' : 'border-blue-500/30 shadow-lg shadow-blue-500/5'
                          }`}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-white text-sm sm:text-base">{msg.name}</h3>
                                {!msg.read && (
                                  <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    New
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-600 text-xs whitespace-nowrap">
                                {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            <p className="text-blue-400 text-xs sm:text-sm font-medium">{msg.email}</p>
                            <p className="text-gray-200 font-semibold text-sm sm:text-base">{msg.subject}</p>
                            <p className="text-gray-400 text-sm leading-relaxed">{msg.message}</p>
                            
                            <div className="flex gap-2 pt-2">
                              {!msg.read && (
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleMarkAsRead(msg.id)}
                                  className="px-3 py-1.5 text-xs bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all font-medium flex items-center gap-1.5 border border-blue-500/20"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Mark Read
                                </motion.button>
                              )}
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              )}

              {/* ========== SKILLS TAB ========== */}
              {activeTab === 'skills' && (
                <div className="grid gap-3 sm:gap-4">
                  {skills.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-20 sm:py-32 bg-[#111827]/50 rounded-2xl border border-white/5"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Code className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-400 text-base sm:text-lg">No skills found</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-2 px-4">Add skills from the backend to see them here</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <AnimatePresence>
                        {skills.map((skill, index) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#111827]/80 backdrop-blur border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-white/10 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <div>
                                <h3 className="font-bold text-white text-base sm:text-lg">{skill.name}</h3>
                                <p className="text-gray-500 text-xs sm:text-sm capitalize">{skill.category}</p>
                              </div>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-2 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                            <div className="relative">
                              <div className="w-full bg-[#0a0f1c] rounded-full h-2.5 sm:h-3 overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency}%` }}
                                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                                </motion.div>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-600">Proficiency</span>
                                <span className="text-xs font-bold text-blue-400">{skill.proficiency}%</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========== ADD/EDIT PROJECT MODAL ========== */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#111827] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl shadow-black/50"
            >
              <div className="sticky top-0 bg-[#111827]/95 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 flex items-center justify-between z-20">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {editingProject ? 'Update your project details' : 'Create a new portfolio project'}
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 sm:mb-3">Project Image</label>
                  <div className="flex gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-full h-36 sm:h-48 rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-[#0a0f1c] flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      {imagePreview ? (
                        <>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-center">
                              <Upload className="w-6 h-6 mx-auto" />
                              <p className="text-sm text-white mt-2">Change Image</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center px-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-blue-500/20 transition-colors">
                            <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400">Click to upload image</p>
                          <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            <p className="text-sm text-gray-400 mt-2">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Or use URL */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Or paste image URL</p>
                    <input 
                      type="url" 
                      value={formData.image}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                      placeholder="Project name"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      required
                      rows={3}
                      placeholder="Brief description of the project..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Technologies (comma separated) *</label>
                    <input 
                      type="text" 
                      value={formData.technologies}
                      onChange={e => setFormData({...formData, technologies: e.target.value})}
                      placeholder="React, Node.js, PostgreSQL, TypeScript"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <GithubIcon className="w-5 h-5" />
                        </div>
                        <input 
                          type="url" 
                          value={formData.githubUrl}
                          onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                          placeholder="https://github.com/..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Live URL</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <input 
                          type="url" 
                          value={formData.liveUrl}
                          onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                          placeholder="https://..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1c] border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer text-sm"
                      >
                        <option value="fullstack">Full Stack</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="mobile">Mobile</option>
                        <option value="design">Design</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${formData.featured ? 'bg-blue-600' : 'bg-gray-700'}`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-lg absolute top-0.5 transition-all duration-300 ${formData.featured ? 'left-6' : 'left-0.5'}`} />
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.featured}
                          onChange={e => setFormData({...formData, featured: e.target.checked})}
                          className="hidden"
                        />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Featured Project</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 text-sm sm:text-base"
                    disabled={isUploading}
                  >
                    {editingProject ? 'Update Project' : 'Save Project'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;