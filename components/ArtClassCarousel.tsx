import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  courseName: string;
  courseDescription: string;
  primaryButton: {
    text: string;
    link: string;
    gradient: string;
  };
  secondaryButton: {
    text: string;
    link: string;
    gradient: string;
  };
}

const slides: Slide[] = [
  {
    image: '/assets/colortheory.webp',
    title: 'Creative Exploration',
    subtitle: 'Find your voice through art',
    courseName: 'Color Theory Mastery',
    courseDescription: 'Understanding color relationships and harmony',
    primaryButton: {
      text: 'Learn Color Theory',
      link: '/classes/color/',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    secondaryButton: {
      text: 'View All Classes',
      link: '/classes/',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  },
  {
    image: '/assets/painting.webp',
    title: 'Explore Vibrant Painting',
    subtitle: 'Express yourself with color and texture',
    courseName: 'Painting Foundations',
    courseDescription: 'Acrylics, oils, watercolor, and mixed media',
    primaryButton: {
      text: 'Browse Painting Classes',
      link: '/classes/painting/',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    secondaryButton: {
      text: 'View All Classes',
      link: '/classes/',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  },
  {
    image: '/assets/drawing.webp',
    title: 'Master the Fundamentals',
    subtitle: 'Build your foundation in drawing',
    courseName: 'Drawing Essentials',
    courseDescription: 'Pencil, charcoal, ink, and digital techniques',
    primaryButton: {
      text: 'Explore Drawing Classes',
      link: '/classes/drawing/',
      gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    },
    secondaryButton: {
      text: 'View All Classes',
      link: '/classes/',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  },
  {
    image: '/assets/sculpture.webp',
    title: 'Create in Three Dimensions',
    subtitle: 'Bring your ideas into the physical world',
    courseName: 'Sculpture & Ceramics',
    courseDescription: 'Clay, stone, metal, and mixed materials',
    primaryButton: {
      text: 'Discover Sculpture Classes',
      link: '/classes/sculpture/',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    },
    secondaryButton: {
      text: 'View All Classes',
      link: '/classes/',
      gradient: 'linear-gradient(135deg, #f794a4 0%, #fdd6bd 100%)',
    },
  },
  {
    image: '/assets/mixedmedia.webp',
    title: 'Break the Boundaries',
    subtitle: 'Combine techniques and materials',
    courseName: 'Mixed Media Art',
    courseDescription: 'Collage, assemblage, and experimental methods',
    primaryButton: {
      text: 'View Mixed Media Classes',
      link: '/classes/mixed-media/',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    secondaryButton: {
      text: 'View All Classes',
      link: '/classes/',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ffecd2 100%)',
    },
  },
];

export function ArtClassCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 6000; // 6 seconds
  const PROGRESS_UPDATE_INTERVAL = 16; // ~60fps

  const startAutoRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);
    
    // Progress bar animation
    const progressIncrement = (PROGRESS_UPDATE_INTERVAL / SLIDE_DURATION) * 100;
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + progressIncrement;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    // Slide rotation
    intervalRef.current = setInterval(() => {
      setPreviousSlide(prev => prev);
      setCurrentSlide(prev => {
        setPreviousSlide(prev);
        return (prev + 1) % slides.length;
      });
      setProgress(0);
      setIsAnimating(true);
    }, SLIDE_DURATION);
  };

  const stopAutoRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    if (!isHovered && !isPaused) {
      startAutoRotation();
    } else {
      stopAutoRotation();
    }

    return () => {
      stopAutoRotation();
    };
  }, [isHovered, isPaused, currentSlide]);

  const goToSlide = (index: number) => {
    setPreviousSlide(currentSlide);
    setCurrentSlide(index);
    setProgress(0);
    setIsAnimating(true);
  };

  const nextSlide = () => {
    setPreviousSlide(currentSlide);
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setProgress(0);
    setIsAnimating(true);
  };

  const prevSlide = () => {
    setPreviousSlide(currentSlide);
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    setIsAnimating(true);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4d258c 0%, #293189 50%, #4d258c 100%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes slideInZoomSmooth {
          0% {
            opacity: 0;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideOutFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes textFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .slide-image-entering {
          animation: slideInZoomSmooth 2400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 1600ms both;
        }

        .slide-image-exiting {
          animation: slideOutFade 1600ms cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }

        .text-animate-1 {
          animation: textFadeInUp 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 2400ms forwards;
          opacity: 0;
        }

        .text-animate-2 {
          animation: textFadeInUp 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 2700ms forwards;
          opacity: 0;
        }

        .text-animate-3 {
          animation: textFadeInUp 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 3000ms forwards;
          opacity: 0;
        }

        .text-animate-4 {
          animation: textFadeInUp 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 3300ms forwards;
          opacity: 0;
        }

        .button-animate {
          animation: textFadeInUp 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 3600ms forwards;
          opacity: 0;
        }

        .gradient-button {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .gradient-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .gradient-button:focus {
          outline: 3px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }

        .control-button {
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .carousel-container:hover .control-button {
          opacity: 1;
        }
      `}</style>

      {/* Main Carousel Container */}
      <div className="carousel-container relative w-full h-full">
        {/* Image - Two layers for smooth transition */}
        <div className="absolute inset-0">
          {/* Exiting slide */}
          {previousSlide !== currentSlide && (
            <img
              key={`exit-${previousSlide}`}
              src={slides[previousSlide].image}
              alt={slides[previousSlide].courseName}
              className="slide-image-exiting absolute inset-0 w-full h-full object-cover"
              style={{ transformOrigin: 'center center' }}
            />
          )}
          
          {/* Entering slide */}
          <img
            key={`enter-${currentSlide}`}
            src={currentSlideData.image}
            alt={currentSlideData.courseName}
            className="slide-image-entering absolute inset-0 w-full h-full object-cover"
            style={{ transformOrigin: 'center center' }}
          />
          
          {/* Gradient Overlay for Better Text Readability - Lighter now with glass panel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center px-8 text-center text-white z-10">
          {/* Glassmorphism Panel */}
          <div 
            key={`text-${currentSlide}`} 
            className="max-w-3xl backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
            style={{
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <h2 className="text-animate-1 text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">
              {currentSlideData.title}
            </h2>
            
            <p className="text-animate-2 text-xl md:text-2xl font-medium drop-shadow-xl mt-4">
              {currentSlideData.subtitle}
            </p>
            
            <h3 className="text-animate-3 text-2xl md:text-3xl lg:text-4xl font-semibold mt-8 drop-shadow-2xl">
              {currentSlideData.courseName}
            </h3>
            
            <p className="text-animate-4 text-base md:text-lg text-white/90 drop-shadow-xl mt-3">
              {currentSlideData.courseDescription}
            </p>

            {/* CTA Buttons */}
            <div className="button-animate flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a
                href={currentSlideData.primaryButton.link}
                className="gradient-button px-8 py-4 rounded-lg font-semibold text-lg text-white shadow-lg"
                style={{ background: currentSlideData.primaryButton.gradient }}
              >
                {currentSlideData.primaryButton.text}
              </a>
              
              <a
                href={currentSlideData.secondaryButton.link}
                className="gradient-button px-8 py-4 rounded-lg font-semibold text-lg text-white shadow-lg"
                style={{ background: currentSlideData.secondaryButton.gradient }}
              >
                {currentSlideData.secondaryButton.text}
              </a>

              {/* NEW: Gift Button */}
              <a
                href="#signup"
                className="gradient-button px-8 py-4 rounded-lg font-semibold text-lg text-white shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
              >
                🎁 Gift a Class
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="control-button absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="control-button absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Pause/Play Button */}
        <button
          onClick={togglePause}
          className="control-button absolute top-5 right-5 w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all z-20"
          aria-label={isPaused ? 'Play' : 'Pause'}
        >
          {isPaused ? (
            <Play className="w-6 h-6 text-white" />
          ) : (
            <Pause className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Slide Counter - Upper Left */}
        <div className="absolute top-5 left-5 z-20">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-5 py-2 border border-white/30">
            <span className="text-white font-semibold text-lg">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-2.5 bg-white/20 z-20">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}