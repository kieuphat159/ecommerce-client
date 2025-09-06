import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      image: "./images/banner.jpg",
      title: "Simply Unique/",
      subtitle: "Simply Better.",
      description: "3legant is a gift & decorations store based in HCMC, Vietnam. Est since 2019."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="banner">
      <div className="banner-container">
        <div className="banner-content">
          <div className="banner-text">
            <h2 className="banner-title">
              {heroSlides[currentSlide].title}
              <br />
              <span className="banner-subtitle">{heroSlides[currentSlide].subtitle}</span>
            </h2>
            <p className="banner-description">
              {heroSlides[currentSlide].description}
            </p>
          </div>

          <div className="banner-image-container">
            <div className="banner-image-wrapper">
              <img 
                src={heroSlides[currentSlide].image}
                alt="Furniture showcase"
                className="banner-image"
              />
              
              <button 
                onClick={prevSlide}
                className="banner-nav banner-nav-prev"
              >
                <ChevronLeft className="nav-icon" />
              </button>
              <button 
                onClick={nextSlide}
                className="banner-nav banner-nav-next"
              >
                <ChevronRight className="nav-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;