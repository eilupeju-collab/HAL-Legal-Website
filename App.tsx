import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import PracticeAreas from './components/PracticeAreas';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAgent from './components/AIAgent';

function App() {
  const [isAgentOpen, setAgentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-navy-900 antialiased selection:bg-gold-400 selection:text-white">
      <Header />
      <main>
        <Hero onOpenAgent={() => setAgentOpen(true)} />
        <About />
        <PracticeAreas />
        <Contact />
      </main>
      <Footer />
      <AIAgent isOpen={isAgentOpen} setIsOpen={setAgentOpen} />
    </div>
  );
}

export default App;