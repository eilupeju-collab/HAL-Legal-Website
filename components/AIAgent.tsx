import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Sparkles, Activity, ShieldCheck, ArrowRight, User, Mail, Briefcase, CheckCircle } from 'lucide-react';
import { LiveClient } from '../services/geminiService';

interface AIAgentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AIAgent: React.FC<AIAgentProps> = ({ isOpen, setIsOpen }) => {
  const [status, setStatus] = useState<string>("disconnected"); // disconnected, connecting, connected, error, processing
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // View State: 'voice' | 'form'
  const [currentView, setCurrentView] = useState<'voice' | 'form'>('voice');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Intake Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: 'Consultation'
  });

  const clientRef = useRef<LiveClient | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize Client immediately on open
      const client = new LiveClient();
      clientRef.current = client;

      client.onStatusChange = (s) => setStatus(s);
      client.onVolumeLevel = (v) => setVolume(v);
      
      // Trigger form when AI requests it
      client.onShowForm = () => {
        setCurrentView('form');
      };

      // Connect without initial user data (Anonymous start)
      client.connect().catch(e => {
        console.error("Connection failed", e);
        setStatus("error");
      });
      
      setCurrentView('voice');
      setFormSubmitted(false);
    } else {
      // Cleanup
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
      setStatus("disconnected");
      setVolume(0);
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Send data back to AI context
    if (clientRef.current) {
        const textUpdate = `Here are my details for the booking: Name: ${formData.name}, Email: ${formData.email}, Issue: ${formData.issue}.`;
        await clientRef.current.sendText(textUpdate);
    }
    
    // Switch back to voice after a short delay so user sees success
    setTimeout(() => {
        setCurrentView('voice');
    }, 1500);
  };

  // If closed, render nothing
  if (!isOpen) return null;

  // Calculate visualizer circle size based on volume
  const scale = 1 + volume;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      {/* Container */}
      <div className="relative w-full max-w-sm bg-navy-900/95 border border-gold-400/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 min-h-[500px]">
        
        {/* Header (Always Visible) */}
        <div className="pt-8 pb-4 text-center px-6">
            <h3 className="text-white font-serif text-xl tracking-wide">HAL Legal</h3>
            <p className="text-gold-400 text-xs uppercase tracking-widest mt-1">
                {currentView === 'form' 
                    ? 'Consultation Details' 
                    : (status === 'connecting' ? 'Establishing Secure Line...' : status === 'connected' ? 'Live Agent Active' : 'Connecting...')
                }
            </p>
        </div>

        {/* Content Switcher */}
        {currentView === 'form' ? (
            /* --- INTAKE FORM (Triggered by AI) --- */
            <div className="flex-1 px-8 pb-8 flex flex-col justify-center animate-fade-in">
                {!formSubmitted ? (
                    <>
                        <p className="text-gray-300 text-sm text-center mb-8 leading-relaxed">
                            Please provide your contact information to finalize the appointment booking.
                        </p>
                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div className="relative group">
                                <User className="absolute left-0 top-3 w-5 h-5 text-gold-400" />
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-transparent border-b border-gray-600 py-3 pl-8 text-white focus:border-gold-400 focus:outline-none transition-colors placeholder-gray-500"
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-0 top-3 w-5 h-5 text-gold-400" />
                                <input 
                                    type="email" 
                                    required
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-transparent border-b border-gray-600 py-3 pl-8 text-white focus:border-gold-400 focus:outline-none transition-colors placeholder-gray-500"
                                />
                            </div>
                            <div className="relative group">
                                <Briefcase className="absolute left-0 top-3 w-5 h-5 text-gold-400" />
                                <select 
                                    value={formData.issue}
                                    onChange={(e) => setFormData({...formData, issue: e.target.value})}
                                    className="w-full bg-transparent border-b border-gray-600 py-3 pl-8 text-white focus:border-gold-400 focus:outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="Consultation" className="bg-navy-900">General Consultation</option>
                                    <option value="Criminal Defense" className="bg-navy-900">Criminal Defense</option>
                                    <option value="Corporate Litigation" className="bg-navy-900">Corporate Litigation</option>
                                    <option value="Personal Injury" className="bg-navy-900">Personal Injury</option>
                                    <option value="Family Law" className="bg-navy-900">Family Law</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                className="w-full mt-8 bg-gold-500 text-navy-900 font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-white transition-colors duration-300 flex items-center justify-center group shadow-lg"
                            >
                                Confirm Booking
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 animate-fade-in">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <p className="text-white font-bold text-lg">Details Received</p>
                        <p className="text-gray-400 text-sm">Returning to call...</p>
                    </div>
                )}
            </div>
        ) : (
            /* --- VOICE INTERFACE --- */
            <div className="flex-1 flex flex-col animate-fade-in">
                {/* Central Visualizer */}
                <div className="flex-1 flex items-center justify-center my-4 relative w-full">
                    {/* Outer Glow */}
                    <div 
                        className="absolute rounded-full bg-gold-500/20 blur-3xl transition-all duration-75"
                        style={{ width: `${150 * scale}px`, height: `${150 * scale}px` }}
                    ></div>
                    
                    {/* Inner Pulsing Circle */}
                    <div className="relative">
                        <div 
                            className={`absolute inset-0 rounded-full border border-gold-400/30 opacity-50 ${status === 'connected' ? 'animate-ping' : ''}`}
                            style={{ animationDuration: '3s' }}
                        ></div>
                        <div 
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-navy-900 to-black border-2 border-gold-400/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center transition-transform duration-100"
                            style={{ transform: `scale(${scale})` }}
                        >
                            <div className="w-24 h-24 rounded-full bg-gold-400/10 flex items-center justify-center backdrop-blur-md">
                                {status === 'processing' ? (
                                <Sparkles className="w-10 h-10 text-gold-400 animate-spin" />
                                ) : (
                                <Activity className={`w-10 h-10 text-gold-400 ${status === 'connected' ? 'animate-pulse' : ''}`} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Text */}
                <div className="h-8 flex flex-col items-center justify-center space-y-2 mb-8">
                    {status === 'connected' && (
                        <p className="text-gray-400 text-sm animate-pulse text-center">Listening...</p>
                    )}
                    {status === 'processing' && (
                        <p className="text-gold-400 text-xs uppercase tracking-widest animate-pulse text-center">Checking Availability...</p>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-8 mb-10">
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-full transition-all duration-300 ${isMuted ? 'bg-white text-navy-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button 
                        onClick={handleClose}
                        className="p-5 rounded-full bg-red-500/90 text-white shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-300"
                    >
                        <PhoneOff size={32} />
                    </button>
                </div>
            </div>
        )}

        {/* Footer Secure Badge */}
        <div className="bg-navy-950 py-3 px-6 flex justify-center border-t border-white/5">
             <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                 <ShieldCheck className="w-3 h-3 text-green-500" />
                 <span>Anti-Hallucination Guard Active</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;