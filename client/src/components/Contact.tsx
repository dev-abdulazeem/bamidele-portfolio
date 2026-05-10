import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import api from '../services/api';

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/messages', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-[#60a5fa] font-medium mb-2">Get In Touch</p>
          <h2 className="text-4xl font-bold mb-4">Let's Work <span className="gradient-text">Together</span></h2>
          <p className="text-gray-400 mb-12 max-w-2xl">Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.</p>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <MailIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-gray-400">bamideleazeem72@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <PhoneIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <p className="text-gray-400">+2349139930978</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <MapPinIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Location</h3>
                  <p className="text-gray-400">Lagos, Nigeria</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="font-semibold text-white mb-4">Follow Me</h3>
                <div className="flex gap-4">
                  {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                    <a key={social} href="#" className="px-4 py-2 rounded-lg glass text-sm text-gray-400 hover:text-white hover:border-[#3b82f6]/30 transition-all">{social}</a>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <CheckCircleIcon />
                  <span className="text-green-400">Message sent successfully!</span>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <span className="text-red-400">{error}</span>
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="Project Inquiry" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] transition-colors resize-none" placeholder="Tell me about your project..." />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <LoaderIcon /> : <><SendIcon /> Send Message</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;