// EnhancedImageCarousel.tsx - Version 4.0.0 (Fully functional navigation controls)
// Advanced image carousel with autoplay, controls, keyboard navigation, and smooth transitions

import { useState, useEffect, useRef, useCallback } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaAction?: () => void;
}

interface CarouselProps {
  slides?: Slide[];
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  enableKeyboardNavigation?: boolean;
  enableTouchGestures?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

const defaultSlides: Slide[] = [
  {
    image: "https://gallagherartschool.com/wp-content/uploads/2025/08/PAINTING-ONE.png",
    title: "Master the Art of Drawing",
    subtitle: "From beginner sketches to advanced techniques",
    ctaText: "Explore Drawing Classes",
    ctaAction: () => alert('Drawing Classes:\n• Beginner Drawing Fundamentals\n• Advanced Portraiture\n• Figure Drawing Workshop\n• Charcoal & Graphite Mastery')
  },
  {
    image: "https://gallagherartschool.com/wp-content/uploads/2025/08/underhisvery-copy.jpeg",
    title: "Explore Vibrant Painting",
    subtitle: "Watercolors, oils, and mixed media",
    ctaText: "Browse Painting Classes",
    ctaAction: () => alert('Painting Classes:\n• Watercolor Basics\n• Oil Painting Techniques\n• Acrylic Landscape Painting\n• Abstract Expressionism')
  },
  {
    image: "https://gallagherartschool.com/wp-content/uploads/2025/08/Palette.webp",
    title: "Color Theory Mastery",
    subtitle: "Understanding color relationships and harmony",
    ctaText: "Learn Color Theory",
    ctaAction: () => alert('Color Theory Classes:\n• Color Fundamentals\n• Advanced Color Harmony\n• Color Psychology in Art\n• Practical Color Application')
  },
  {
    image: "https://gallagherartschool.com/wp-content/uploads/2023/06/Sculpture011.webp",
    title: "Sculpture & 3D Art",
    subtitle: "Shape your imagination into reality",
    ctaText: "View Sculpture Classes",
    ctaAction: () => alert('Sculpture Classes:\n• Clay Modeling Basics\n• Stone Carving Workshop\n• Metal Sculpture\n• Contemporary Installation')
  },
  {
    image: "https://gallagherartschool.com/wp-content/uploads/2023/06/Frank-Stella-sm.webp",
    title: "Mixed Media AI & Collage",
    subtitle: "Combine traditional and AI-generated materials",
    ctaText: "Discover Mixed Media",
    ctaAction: () => alert('Mixed Media Classes:\n• AI-Enhanced Collage\n• Traditional Collage Techniques\n• Texture & Material Exploration\n• Digital-Physical Fusion')
  }
];

export function EnhancedImageCarousel({
  slides = defaultSlides,
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
  enableKeyboardNavigation = true,
  enableTouchGestures = true,
  pauseOnHover = true,
  className = ""
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced navigation functions - Define these first so they can be used in useEffects
  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToFirst = useCallback(() => {
    if (currentSlide !== 0) {
      setDirection(-1);
      setCurrentSlide(0);
    }
  }, [currentSlide]);

  const goToLast = useCallback(() => {
    const lastIndex = slides.length - 1;
    if (currentSlide !== lastIndex) {
      setDirection(1);
      setCurrentSlide(lastIndex);
    }
  }, [currentSlide, slides.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  // Touch gesture support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableTouchGestures) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [enableTouchGestures]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableTouchGestures) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [enableTouchGestures]);

  const handleTouchEnd = useCallback(() => {
    if (!enableTouchGestures || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  }, [enableTouchGestures, touchStart, touchEnd, goToNext, goToPrev]);

  // Preload first few images to improve performance
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagesToPreload = slides.slice(0, 3); // Preload first 3 images
        const loadPromises = imagesToPreload.map(slide => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = slide.image;
          });
        });
        
        await Promise.allSettled(loadPromises);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, [slides]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events when the carousel is focused or in focus
      if (!carouselRef.current?.contains(document.activeElement)) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          goToPrev();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          goToNext();
          break;
        case 'Home':
          event.preventDefault();
          goToFirst();
          break;
        case 'End':
          event.preventDefault();
          goToLast();
          break;
        case ' ':
        case 'Space':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'Escape':
          event.preventDefault();
          setIsPlaying(false);
          break;
        default:
          // Handle number keys (1-9) to jump to specific slides
          const slideNumber = parseInt(event.key);
          if (slideNumber >= 1 && slideNumber <= slides.length) {
            event.preventDefault();
            goToSlide(slideNumber - 1);
          }
          break;
      }
    };

    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      // Global keyboard shortcuts when carousel is focused
      if (carouselRef.current?.contains(document.activeElement)) {
        handleKeyDown(event);
      }
    };

    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, [enableKeyboardNavigation, goToNext, goToPrev, goToFirst, goToLast, togglePlayPause, goToSlide, slides.length]);

  // Enhanced autoplay with pause functionality
  useEffect(() => {
    if (!isPlaying || !imagesLoaded || isPaused) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, autoPlayInterval, slides.length, imagesLoaded, isPaused]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  // Show loading state while images are loading
  if (!imagesLoaded) {
    return (
      <div className={`relative w-full h-full min-h-[400px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden ${className} flex items-center justify-center`}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg opacity-90">Loading Art Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef}
      className={`relative w-full h-full min-h-[400px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-purple-900 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label={`Image carousel with ${slides.length} slides. Currently showing slide ${currentSlide + 1}: ${slides[currentSlide]?.title}`}
      aria-live="polite"
      aria-atomic="false"
      aria-describedby="carousel-instructions"
    >
      {/* Carousel Images */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            <ImageWithFallback
              src={slides[currentSlide].image}
              alt={`${slides[currentSlide].title} - ${slides[currentSlide].subtitle}`}
              className="w-full h-full object-cover"
              role="img"
              aria-describedby={`slide-${currentSlide}-content`}
            />
            {/* FIXED: Reduced overlay from bg-black/40 to bg-black/15 for brighter images */}
            <div className="absolute inset-0 bg-black/15" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Controls */}
      {showControls && (
        <>
          {/* Previous/Next Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-200 z-20"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous slide"
            title="Previous slide (← or ↑)"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-200 z-20"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next slide"
            title="Next slide (→ or ↓)"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* First/Last Navigation - Only show if more than 3 slides */}
          {slides.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 bottom-20 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-200 z-10"
                onClick={goToFirst}
                aria-label="First slide"
                title="First slide (Home)"
                disabled={currentSlide === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 bottom-20 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-200 z-10"
                onClick={goToLast}
                aria-label="Last slide"
                title="Last slide (End)"
                disabled={currentSlide === slides.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Enhanced Play/Pause Control */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-200 z-10"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            title={`${isPlaying ? "Pause" : "Play"} slideshow (Space)`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Slide Counter */}
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-sm z-10">
            <span className="font-medium">{currentSlide + 1}</span>
            <span className="opacity-70"> / {slides.length}</span>
          </div>

          {/* Keyboard Instructions (shown on focus) */}
          <div 
            id="carousel-instructions"
            className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-lg text-xs opacity-0 focus-within:opacity-100 hover:opacity-100 transition-opacity duration-300 z-10 max-w-48"
          >
            <div className="space-y-1">
              <div>← → Navigate slides</div>
              <div>Space Play/Pause</div>
              <div>1-{slides.length} Jump to slide</div>
              <div>Home/End First/Last</div>
              {enableTouchGestures && <div>Swipe to navigate</div>}
            </div>
          </div>
        </>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-white z-0 pointer-events-none">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
          id={`slide-${currentSlide}-content`}
        >
          <h1 className="text-3xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
            Gallagher Art School
          </h1>
          <p className="text-lg lg:text-xl opacity-90 mb-6 drop-shadow-md">
            Expert instruction from an MFA Yale graduate
          </p>
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold drop-shadow-md">
              {slides[currentSlide].title}
            </h2>
            <p className="text-base lg:text-lg opacity-80 mb-4 drop-shadow-sm">
              {slides[currentSlide].subtitle}
            </p>
            {slides[currentSlide].ctaText && (
              <Button
                onClick={slides[currentSlide].ctaAction}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 mb-12 shadow-lg pointer-events-auto"
              >
                {slides[currentSlide].ctaText}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Slide Indicators */}
        {showIndicators && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 pointer-events-auto">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none pointer-events-auto ${
                  index === currentSlide 
                    ? 'bg-white scale-110 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/75 hover:scale-105'
                }`}
                aria-label={`Go to slide ${index + 1}: ${slides[index].title}`}
                title={`${slides[index].title} (${index + 1})`}
              />
            ))}
          </div>
        )}

        {/* Enhanced Progress Bar */}
        <div className="absolute bottom-2 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className={`h-full shadow-sm transition-colors duration-200 ${
              isPlaying && !isPaused ? 'bg-white' : 'bg-white/50'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: isPlaying && !isPaused ? '100%' : '0%' }}
            transition={{ 
              duration: isPlaying && !isPaused ? autoPlayInterval / 1000 : 0.3, 
              ease: 'linear' 
            }}
            key={`${currentSlide}-${isPlaying}-${isPaused}`}
          />
        </div>

        {/* Pause Indicator */}
        {isPaused && pauseOnHover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-20 pointer-events-none"
          >
            Paused
          </motion.div>
        )}
      </div>
    </div>
  );
}