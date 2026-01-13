import React from 'react';
import { Scale, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-white pt-20 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Scale className="w-8 h-8 text-gold-400" />
              <span className="font-serif text-2xl font-bold tracking-tight">HAL LEGAL</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining legal representation through intellect, integrity, and innovation.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-widest mb-6 text-sm">Practice</h5>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Corporate Litigation</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Criminal Defense</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Personal Injury</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Intellectual Property</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-widest mb-6 text-sm">Firm</h5>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gold-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Attorneys</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">News & Insights</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-widest mb-6 text-sm">Connect</h5>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2024 HAL Legal Consult. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Attorney Advertising</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;