'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Package } from 'lucide-react';
import type { Product } from '@/lib/types';

interface LightboxGalleryProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function LightboxGallery({ product, isOpen, onClose }: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragX, setDragX] = useState(0);

  const safeImagenes = (product.imagenes || []).filter((img) => typeof img === 'string' && img.startsWith('https://'));
  const totalImages = safeImagenes.length;

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalImages);
    setDragX(0);
    setIsZoomed(false);
  }, [totalImages]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    setDragX(0);
    setIsZoomed(false);
  }, [totalImages]);

  const goToIndex = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      setDragX(0);
      setIsZoomed(false);
    },
    [currentIndex]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      goToPrev();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      goToNext();
    } else {
      setDragX(0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={`Galería de ${product.nombre}`}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
          aria-label="Cerrar galería"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Gallery Container */}
        <div className="relative w-full h-full max-w-5xl mx-4 flex flex-col items-center justify-center">
          {/* Main Image Area */}
          <div className="relative w-full flex-1 min-h-0" style={{ height: '70vh' }}>
            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 bg-white/15 backdrop-blur-sm text-white rounded-full hover:bg-white/25 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 bg-white/15 backdrop-blur-sm text-white rounded-full hover:bg-white/25 transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Zoom Controls */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-2 right-2 z-10 p-2 bg-white/15 backdrop-blur-sm text-white rounded-full hover:bg-white/25 transition-colors"
              aria-label={isZoomed ? 'Reducir zoom' : 'Ampliar zoom'}
            >
              {isZoomed ? (
                <ZoomOut className="w-5 h-5" />
              ) : (
                <ZoomIn className="w-5 h-5" />
              )}
            </button>

            {/* Image Display */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag={isZoomed ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd}
                onDrag={(_, info) => setDragX(info.offset.x)}
                style={{
                  x: isZoomed ? 0 : dragX,
                  cursor: isZoomed ? 'zoom-out' : 'grab',
                }}
                className={`absolute inset-0 flex items-center justify-center ${
                  isZoomed ? 'cursor-zoom-out' : ''
                }`}
                onClick={() => !isZoomed && setIsZoomed(true)}
              >
                <div
                  className={`relative transition-transform duration-300 ${
                    isZoomed ? 'w-full h-full' : 'w-full h-full'
                  }`}
                >
                  {product.imagenes && safeImagenes[currentIndex] ? (
                    <Image
                      src={safeImagenes[currentIndex]}
                      alt={`${product.nombre} - imagen ${currentIndex + 1}`}
                      fill
                      className={`object-contain transition-all duration-300 ${isZoomed ? 'p-0' : 'p-6 sm:p-12'}`}
                      sizes="100vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-white/20" />
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 mt-4 pb-4 px-4">
            {safeImagenes.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-200 flex-shrink-0 ${
                  index === currentIndex
                    ? 'ring-2 ring-white scale-105'
                    : 'opacity-60 hover:opacity-90'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              >
                <Image
                  src={imgUrl}
                  alt={`${product.nombre} - miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-sm font-medium rounded-full">
            {currentIndex + 1} / {totalImages}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
