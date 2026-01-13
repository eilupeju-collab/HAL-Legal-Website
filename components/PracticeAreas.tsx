import React from 'react';
import { Briefcase, Shield, Users, Gavel, Building, HeartPulse } from 'lucide-react';
import { ServiceItem } from '../types';

const practices: ServiceItem[] = [
  {
    title: "Corporate Litigation",
    description: "Navigating complex business disputes with strategic precision and aggressive representation.",
    icon: <Building className="w-8 h-8 text-gold-400" />
  },
  {
    title: "Criminal Defense",
    description: "Unyielding defense for high-stakes criminal allegations. We protect your future.",
    icon: <Shield className="w-8 h-8 text-gold-400" />
  },
  {
    title: "Personal Injury",
    description: "Maximizing compensation for life-altering injuries through tireless advocacy.",
    icon: <HeartPulse className="w-8 h-8 text-gold-400" />
  },
  {
    title: "Family Law",
    description: "Handling sensitive domestic matters with discretion, empathy, and resolve.",
    icon: <Users className="w-8 h-8 text-gold-400" />
  },
  {
    title: "Intellectual Property",
    description: "Safeguarding your innovations and creative assets in a digital world.",
    icon: <Briefcase className="w-8 h-8 text-gold-400" />
  },
  {
    title: "Appellate Practice",
    description: "Correcting legal errors and setting precedents in higher courts.",
    icon: <Gavel className="w-8 h-8 text-gold-400" />
  }
];

const PracticeAreas: React.FC = () => {
  return (
    <section id="practice" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h4 className="text-gold-500 font-bold tracking-[0.2em] text-sm uppercase mb-4">Our Expertise</h4>
          <h2 className="font-serif text-4xl md:text-5xl text-navy-900 font-bold">Areas of Practice</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map((item, index) => (
            <div key={index} className="group p-8 border border-gray-100 hover:border-gold-400/30 hover:shadow-2xl transition-all duration-300 bg-gray-50 hover:bg-white rounded-sm">
              <div className="mb-6 p-4 bg-navy-900 inline-block rounded-sm group-hover:bg-gold-500 transition-colors duration-300">
                <div className="text-white group-hover:text-navy-900 transition-colors duration-300">
                    {item.icon}
                </div>
              </div>
              <h3 className="font-serif text-2xl text-navy-900 font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
              <div className="mt-6">
                <a href="#" className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b border-gold-400 pb-1 hover:text-gold-600 transition-colors">Learn More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;