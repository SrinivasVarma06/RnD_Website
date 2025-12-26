import React, { useState, useEffect } from 'react';

// Loading Skeleton for Carousel
const CarouselSkeleton = () => (
  <div className="relative rounded-lg overflow-hidden shadow-md max-w-full bg-gray-200 animate-pulse">
    <div className="w-full h-[200px] md:h-[350px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-12 h-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-gray-400 text-sm">Loading images...</span>
      </div>
    </div>
    {/* Skeleton indicators */}
    <div className="absolute z-30 flex -translate-x-1/2 space-x-2 bottom-4 left-1/2">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300" />
      ))}
    </div>
  </div>
);

const CustomCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;
    
    // Preload first image
    const img = new Image();
    img.onload = () => setImagesLoaded(true);
    img.src = images[0];
  }, [images]);

  useEffect(() => {
    if (!imagesLoaded || images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, imagesLoaded]);

  // Show skeleton while loading
  if (images.length === 0 || !imagesLoaded) {
    return <CarouselSkeleton />;
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md max-w-full">
      {/* Carousel wrapper */}
      <div className="relative overflow-hidden">
        {images.map((src, index) => (
          <div 
            key={index} 
            className={`transition-opacity duration-500 ${index === currentIndex ? 'block opacity-100' : 'hidden opacity-0'}`}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="block w-full max-h-none md:max-h-[350px] mx-auto rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-2 sm:space-x-3 rtl:space-x-reverse bottom-4 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="hidden sm:flex absolute top-0 left-0 z-30 items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none"
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-white transition-all duration-200">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
            fill="none"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 1L1 5l4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="hidden sm:flex absolute top-0 right-0 z-30 items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-white transition-all duration-200">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
            fill="none"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 9l4-4-4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default CustomCarousel;
