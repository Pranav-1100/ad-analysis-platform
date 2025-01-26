import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

const LoadingAnimation = ({ type }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { text: 'Analyzing image content...', duration: 5000 },
    { text: 'Checking compliance standards...', duration: 5000 },
    { text: 'Validating requirements...', duration: 5000 },
    { text: 'Preparing detailed analysis...', duration: Infinity } // This will stay until loading completes
  ];

  useEffect(() => {
    if (step < 3) { // Only advance automatically for first 3 steps
      const timer = setInterval(() => {
        setStep(prev => Math.min(prev + 1, 3));
      }, steps[step].duration);

      return () => clearInterval(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-md z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl p-10 max-w-lg w-full mx-4"
      >
        <div className="flex flex-col items-center space-y-8">
          {/* Spinning loader - slower speed */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-full border-4 border-blue-100" />
            <Loader className="w-20 h-20 text-blue-500 absolute top-0 left-0" 
              style={{ animation: 'spin 3s linear infinite' }}
            />
          </motion.div>

          {/* Step text with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center h-20"
            >
              <p className="text-lg font-medium text-gray-700">{steps[step].text}</p>
              <p className="text-sm text-gray-500 mt-2">
                {step < 3 ? `Step ${step + 1} of 4` : 'Finalizing...'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ 
                width: step < 3 ? '100%' : '90%',
                transition: { 
                  duration: step < 3 ? steps[step].duration / 1000 : 0.5,
                  ease: "linear"
                }
              }}
            />
          </div>

          {/* Processing indicator */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
            <span>{step < 3 ? 'Processing your request...' : 'Almost done...'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;