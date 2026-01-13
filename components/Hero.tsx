import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenAgent: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAgent }) => {
  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Duotone Overlay */}
      <div className="absolute inset-0 z-0">
         {/* Using a high quality placeholder that fits the 'lawyer' description somewhat generically, tailored via CSS */}
        <img 
          src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2938&auto=format&fit=crop" 
          alt="African American Female Lawyer" 
          className="w-full h-full object-cover object-top"
        />
        {/* White Duotone Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/40 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-4 mb-6 animate-fade-in-up">
            <div className="h-[1px] w-12 bg-gold-400"></div>
            <span className="text-gold-400 uppercase tracking-[0.2em] text-sm font-semibold">Excellence in Litigation</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-tight mb-8 drop-shadow-lg">
            Justice Defined. <br/>
            <span className="italic font-light text-gray-200">The Future of Law.</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl font-light leading-relaxed">
            Combining decades of legal prestige with cutting-edge analysis to deliver unparalleled results for our clients.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#contact"
              className="bg-gold-500 text-navy-900 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-white transition-colors duration-300 flex items-center justify-center group"
            >
              Consultation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button 
              onClick={onOpenAgent}
              className="bg-indigo-600 text-white border border-indigo-500 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-indigo-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.8)]"
            >
              <Sparkles className="w-5 h-5" />
              Talk to HAL
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;