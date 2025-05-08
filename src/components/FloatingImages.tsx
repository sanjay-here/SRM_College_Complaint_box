import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatingImage {
  id: number;
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  scale: number;
  rotationDeg: number;
}

interface FloatingImagesProps {
  images?: FloatingImage[];
}

const defaultImages: FloatingImage[] = [
  {
    id: 1,
    src: "/src/images/SRMimg1.jpg",
    alt: "SRM College Campus",
    initialX: 10,
    initialY: 50,
    scale: 1,
    rotationDeg: -5,
  },
  {
    id: 2,
    src: "/src/images/SRMimg2.jpg",
    alt: "SRM College Library",
    initialX: 30,
    initialY: 50,
    scale: 0.9,
    rotationDeg: 3,
  },
  {
    id: 3,
    src: "/src/images/SRMimg3.jpg",
    alt: "SRM College Students",
    initialX: 50,
    initialY: 50,
    scale: 0.85,
    rotationDeg: -2,
  },
  {
    id: 4,
    src: "/src/images/SRMimg4.jpg",
    alt: "SRM College Auditorium",
    initialX: 70,
    initialY: 50,
    scale: 0.95,
    rotationDeg: 4,
  },
];

const FloatingImages = ({ images = defaultImages }: FloatingImagesProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="flex justify-center items-center h-full">
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="mx-4 rounded-lg overflow-hidden shadow-lg"
            initial={{
              x: 0,
              y: 0,
              scale: image.scale,
              rotate: image.rotationDeg,
              opacity: 0,
            }}
            animate={{
              y: isMounted ? [0, -10, 0] : 0,
              opacity: 1,
              transition: {
                y: {
                  repeat: Infinity,
                  duration: 4 + Math.random() * 2,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.8 },
              },
            }}
            whileHover={{ scale: image.scale * 1.05, zIndex: 10 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-[280px] h-[220px] object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FloatingImages;
