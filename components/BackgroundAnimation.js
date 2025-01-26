import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  const generateShapes = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      type: Math.floor(Math.random() * 3),
      size: Math.random() * 200 + 100,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
      rotate: Math.random() * 360
    }));
  };

  const shapes = generateShapes();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-[100px]" />
      
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-white/10 backdrop-blur-lg"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.position.x}%`,
            top: `${shape.position.y}%`,
            rotate: `${shape.rotate}deg`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            rotate: [shape.rotate, shape.rotate + 180, shape.rotate]
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {shape.type === 0 && (
            <div className="w-full h-full rounded-full bg-blue-200/20 backdrop-blur-md" />
          )}
          {shape.type === 1 && (
            <div className="w-full h-full bg-indigo-200/20 backdrop-blur-md" />
          )}
          {shape.type === 2 && (
            <div className="w-full h-full transform rotate-45 bg-purple-200/20 backdrop-blur-md" />
          )}
        </motion.div>
      ))}

      {/* Additional blur layers for depth */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent" />
    </div>
  );
};

export default BackgroundAnimation;