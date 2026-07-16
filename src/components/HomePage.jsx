import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import styles from "./HomePage.module.css";

// Import the uploaded images
import image1 from "../static/img/img1.jpg";
import image2 from "../static/img/img2.jpg";
import image3 from "../static/img/img3.jpg";
import image4 from "../static/img/img4.jpg";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Aviation Parts themed images
  const slides = [
    {
      image: image1,
      title: "Premium Aircraft Cabin Interiors",
      description: "Luxury cabin seating and interior solutions with premium comfort and style"
    },
    {
      image: image2,
      title: "Business Class Aircraft Seats",
      description: "Comfortable and ergonomic seating systems for all travel classes"
    },
    {
      image: image3,
      title: "Modern Cabin Entertainment Systems",
      description: "State-of-the-art in-flight entertainment and passenger comfort solutions"
    },
    {
      image: image4,
      title: "Advanced Cockpit Instrumentation",
      description: "Precision engineered cockpit controls and navigation systems"
    }
  ];

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume autoplay after 10s
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        
        {/* Full Screen Hero Slider */}
        <div className={`${styles.heroSection} ${fadeIn ? styles.fadeIn : ''}`}>
          <div className={styles.sliderContainer}>
            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === currentSlide ? styles.active : ''
                }`}
              >
                <img src={slide.image} alt={slide.title} />
                <div className={styles.slideOverlay}></div>
                <div className={styles.slideContent}>
                  <div className={styles.contentWrapper}>
                    <h1 className={styles.slideTitle}>{slide.title}</h1>
                    <p className={styles.slideDescription}>{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button 
              className={`${styles.navButton} ${styles.navButtonLeft}`} 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <button 
              className={`${styles.navButton} ${styles.navButtonRight}`} 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <i className="fa fa-chevron-right"></i>
            </button>

            {/* Dots Navigation */}
            <div className={styles.dotsContainer}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === currentSlide ? styles.activeDot : ''
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className={styles.dotNumber}>{index + 1}</span>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar} 
                style={{ 
                  animation: isAutoPlay ? 'progress 5s linear' : 'none',
                  animationPlayState: isAutoPlay ? 'running' : 'paused'
                }}
                key={currentSlide}
              ></div>
            </div>

            {/* Slide Counter */}
            <div className={styles.slideCounter}>
              <span className={styles.currentSlide}>{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className={styles.separator}>/</span>
              <span className={styles.totalSlides}>{String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;