
import React from 'react';
import BackgroundSlideshow from '../components/BackgroundSlideshow';
import ParticleBackground from '../components/ParticleBackground';
import TerminalWindow from '../components/TerminalWindow';
import EnhancedTerminalContent from '../components/TerminalContent';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <BackgroundSlideshow />
      <ParticleBackground />
      
      <div className="relative z-10 w-full max-w-4xl animate-fade-in">
        <TerminalWindow>
          <EnhancedTerminalContent />
        </TerminalWindow>
      </div>
    </div>
  );
};

export default Index;
