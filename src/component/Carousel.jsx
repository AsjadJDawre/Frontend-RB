import React, { useState ,useEffect} from "react";
import '../styles/Carousel.css';
export  const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
      { id: 6, text: 'Slide 3', image: '/Slide-image8.jpg' },
      { id: 1, text: 'Slide 1', image: '/Slide-Image4.jpg' },
      { id: 2, text: 'Slide 2', image: '/Slide-image6.jpg' },
      { id: 3, text: 'Slide 3', image: '/Slide-Image3.jpg' },
      { id: 4, text: 'Slide 3', image: '/Slide-image5.png' },
      { id: 5, text: 'Slide 3', image: '/Slide-image7.jpg' },
    ];
    const slideInterval = 3000; // Time in milliseconds (3 seconds)

    // Auto-slide effect
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, slideInterval);
  
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, [slides.length]);
  
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
  
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
  
    return (
      <div className="carousel ">
        {/* <button className="carousel-btn left" onClick={prevSlide}>
          &#9664;
        </button> */}
        <div className="carousel-slide" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide) => (
            <div className="carousel-item" key={slide.id}>
              <img src={slide.image} alt={slide.text} />
              {/* <h2>{slide.text}</h2> */}
            </div>
          ))}
        </div>
        <button className="carousel-btn left" onClick={prevSlide}>
          &#9664;
        </button>
        <button className="carousel-btn right" onClick={nextSlide}>
          &#9654;
        </button>
      </div>
    );
  };
  