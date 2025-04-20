
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useToast } from "../ui/use-toast";
import { Linkedin, Github, Instagram, Mail, Send } from 'lucide-react';

const SocialLinks: React.FC = () => (
  <div className="flex space-x-6 justify-center md:justify-start mb-6">
    <a 
      href="https://www.linkedin.com/in/diya-narula-54087b2a5/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-primary transition-colors duration-200"
      aria-label="LinkedIn Profile"
    >
      <Linkedin size={24} />
    </a>
    <a 
      href="https://github.com/diyanarula15" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-primary transition-colors duration-200"
      aria-label="GitHub Profile"
    >
      <Github size={24} />
    </a>
    <a 
      href="https://instagram.com/narula.diyaaa" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-primary transition-colors duration-200"
      aria-label="Instagram Profile"
    >
      <Instagram size={24} />
    </a>
    <a 
      href="mailto:diyanarula41@gmail.com" 
      className="hover:text-primary transition-colors duration-200"
      aria-label="Email"
    >
      <Mail size={24} />
    </a>
  </div>
);

const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      
      setFormState({
        name: '',
        email: '',
        message: '',
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-20 px-6 md:px-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-aurora-900">Get in Touch</h2>
          <p className="text-lg text-aurora-700 mb-8">
            I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out!
          </p>
          
          <SocialLinks />
          
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Mail size={20} className="text-primary" />
              </div>
              <span>diyanarula41@gmail.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <span>New Delhi, India</span>
            </div>
          </div>
        </motion.div>
        
        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Message'}
              <Send size={16} />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;
