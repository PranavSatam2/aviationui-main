import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../axiosConfig";
import styles from "./HomePage.module.css";

// Import the uploaded images
import image1 from "../static/img/img1.jpg";
import image2 from "../static/img/img2.jpg";
import image3 from "../static/img/img3.jpg";
import image4 from "../static/img/img4.jpg";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  // Aviation Parts themed images - Using uploaded images
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
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        
        {/* Full Screen Hero Slider */}
        <div className={`${styles.heroSection} ${fadeIn ? styles.fadeIn : ''}`}>
          <div className={styles.sliderContainer}>
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
                  <h1 className={styles.slideTitle}>{slide.title}</h1>
                  <p className={styles.slideDescription}>{slide.description}</p>
                </div>
              </div>
            ))}

            Navigation Arrows
            <button className={styles.navButton} onClick={prevSlide} style={{ left: '20px' }}>
              ❮
            </button>
            <button className={styles.navButton} onClick={nextSlide} style={{ right: '20px' }}>
              ❯
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
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;