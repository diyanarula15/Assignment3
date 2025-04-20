
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import ContactForm from '../components/Contact/ContactForm';
import Sound from '../components/Sound';

const Contact: React.FC = () => {
  const { setActivePage } = usePortfolio();
  
  useEffect(() => {
    setActivePage('contact');
    document.title = "Contact - Diya Narula";
  }, [setActivePage]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enable sound effects */}
      <Sound />
      
      {/* Hero section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-aurora-100 to-white">
        <div className="container mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-aurora-900">Contact Me</h1>
            <p className="text-lg max-w-3xl mx-auto text-aurora-700">
              Let's connect! Whether you have a project in mind or just want to say hello, I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact form */}
      <ContactForm />
      
      {/* Map section */}
      <section className="py-16 bg-aurora-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-aurora-900">Location</h2>
            <p className="text-aurora-700">
              Based in New Delhi, India
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.89796845818!2d77.04417380839519!3d28.5274099748639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1713293354953!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
