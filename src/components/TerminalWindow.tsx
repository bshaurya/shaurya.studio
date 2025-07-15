
import React from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
}

const TerminalWindow = ({ children }: TerminalWindowProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="bg-glass-bg/60 backdrop-blur-md border border-glass-border/20 rounded-2xl shadow-2xl shadow-glass-shadow/50 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-glass-border/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-text/50 text-xs font-mono">shaurya@personal:~</span>
            </div>
          </div>
          
          <div className="p-8">
            {children}
          </div>
        </div>
        
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-2xl blur-xl opacity-30 -z-10 animate-gentle-pulse"></div>
      </div>
    </div>
  );
};

export default TerminalWindow;
