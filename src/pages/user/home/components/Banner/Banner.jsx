import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="banner">
      <div className="banner__container">
        <div className="banner__slider">
          <button className="banner__arrow banner__arrow--left">
            <ChevronLeft size={24} />
          </button>
          <button className="banner__arrow banner__arrow--right">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="banner__content">
          <div className="banner__slogan">
            <div>Simply Unique<b>/</b></div>
            <div>Simply Better</div>
          </div>
          <div className="banner__description">
            <div>
              <strong>3legant</strong> is a gift & decorations store based in HCMC, Vietnam. Est since 2019.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;