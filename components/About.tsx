import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-navy-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="relative">
                {/* Image Placeholder with consistent tone */}
                <div className="absolute -inset-4 border border-gold-400 opacity-30"></div>
                <img 
                    src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2940&auto=format&fit=crop" 
                    alt="Professionally Dressed Lawyers" 
                    className="relative grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h4 className="text-gold-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">About HAL Legal</h4>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 leading-tight">
              A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-white">Unwavering</span> Defense.
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Founded on the principles of integrity, tenacity, and innovation, HAL Legal Consult has redefined the modern legal landscape. We don't just interpret the law; we shape it to serve our clients' best interests.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              By integrating proprietary AI technology like HAL with our seasoned team of litigators, we identify critical insights faster, building stronger cases that withstand the toughest scrutiny.
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                    <span className="block text-4xl font-serif text-gold-400 font-bold mb-1">98%</span>
                    <span className="text-xs uppercase tracking-widest text-gray-400">Case Success Rate</span>
                </div>
                <div>
                    <span className="block text-4xl font-serif text-gold-400 font-bold mb-1">$500M+</span>
                    <span className="text-xs uppercase tracking-widest text-gray-400">Recovered for Clients</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;