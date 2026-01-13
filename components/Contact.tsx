import React, { useState } from 'react';
import { MapPin, Phone, Mail, Loader2, CheckCircle, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    details: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation check
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    setStatus('submitting');
    
    // Simulate API submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', details: '' });
      
      // Reset status after delay
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
            
          <div className="lg:w-1/3 space-y-8">
            <div>
              <h4 className="text-gold-500 font-bold tracking-[0.2em] text-sm uppercase mb-4">Get in Touch</h4>
              <h2 className="font-serif text-4xl text-navy-900 font-bold mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-8">
                Ready to protect your rights? Schedule a consultation today. Our team is standing by to evaluate your case.
              </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-start space-x-4">
                    <MapPin className="text-gold-500 w-6 h-6 mt-1" />
                    <div>
                        <h5 className="font-bold text-navy-900">Headquarters</h5>
                        <p className="text-gray-600">101 Legal Avenue, Suite 500<br/>New York, NY 10001</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <Phone className="text-gold-500 w-6 h-6 mt-1" />
                    <div>
                        <h5 className="font-bold text-navy-900">Phone</h5>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <Mail className="text-gold-500 w-6 h-6 mt-1" />
                    <div>
                        <h5 className="font-bold text-navy-900">Email</h5>
                        <p className="text-gray-600">contact@hallegal.com</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:w-2/3 bg-white p-10 shadow-xl rounded-sm border-t-4 border-gold-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">First Name</label>
                        <input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            type="text" 
                            className="w-full border-b border-gray-300 focus:border-gold-500 outline-none py-2 transition-colors" 
                            placeholder="John" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Last Name</label>
                        <input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            type="text" 
                            className="w-full border-b border-gray-300 focus:border-gold-500 outline-none py-2 transition-colors" 
                            placeholder="Doe" 
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email</label>
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            type="email" 
                            className="w-full border-b border-gray-300 focus:border-gold-500 outline-none py-2 transition-colors" 
                            placeholder="john@example.com" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Phone</label>
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel" 
                            className="w-full border-b border-gray-300 focus:border-gold-500 outline-none py-2 transition-colors" 
                            placeholder="(555) 555-5555" 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Case Details</label>
                    <textarea 
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows={4} 
                        className="w-full border-b border-gray-300 focus:border-gold-500 outline-none py-2 transition-colors resize-none" 
                        placeholder="Briefly describe your legal matter..."
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={status !== 'idle'}
                    className={`bg-navy-900 text-white px-8 py-4 uppercase font-bold tracking-widest hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 ${status === 'success' ? '!bg-green-600 !text-white' : ''}`}
                >
                    {status === 'idle' && (
                        <>
                            Submit Inquiry
                            <Send className="w-4 h-4" />
                        </>
                    )}
                    {status === 'submitting' && (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Inquiry Sent
                        </>
                    )}
                </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;