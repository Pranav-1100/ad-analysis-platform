import React from 'react';
import { motion } from 'framer-motion';

const FloatingImage = ({ index }) => {
  const randomRotation = Math.random() * 30 - 15;
  const randomDelay = Math.random() * 2;
  
  return (
    <motion.div
      initial={{ opacity: 0.3, scale: 0.8 }}
      animate={{
        y: [0, -20, 0],
        rotate: [randomRotation, randomRotation + 5, randomRotation],
      }}
      transition={{
        duration: 4,
        delay: randomDelay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        filter: 'blur(1px) brightness(0.7)',
        zIndex: -1
      }}
    >
      <div 
        className="w-32 h-32 bg-blue-200 rounded-lg opacity-20"
        style={{
          backgroundImage: `url('/api/placeholder/${320}/${320}')`,
          backgroundSize: 'cover'
        }}
      />
    </motion.div>
  );
};

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Background images */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingImage
            key={i}
            index={i}
            style={{
              left: `${(i % 4) * 25}%`,
              top: `${Math.floor(i / 4) * 33}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ad Analysis Platform
            </h1>
            <p className="text-lg text-gray-600">
              Upload your ad and PRD for comprehensive analysis
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;