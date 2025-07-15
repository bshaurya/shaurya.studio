
import React, { useState, useEffect } from 'react';

const backgroundImages = [
  '/uploads/1.png',
  '/uploads/2.png',
  '/uploads/3.png',
  '/uploads/4.png',
  '/uploads/5.png'
];

const BackgroundSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = () => {
      let loadedCount = 0;
      backgroundImages.forEach(src => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === backgroundImages.length) {
            setIsLoaded(true);
          }
        };
        img.src = src;
      });
    };
    
    preloadImages();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgroundImages.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-orange-900/40 to-purple-900/60" />
    );
  }

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[4000ms] ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImages[currentIndex]})`,
          filter: 'blur(2px) contrast(1.1) saturate(1.4) brightness(0.7) sepia(0.2)',
          transform: 'scale(1.05)',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent via-40% to-purple-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay animate-slow-fade"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.7'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default BackgroundSlideshow;
