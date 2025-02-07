import React, { useEffect, useState } from 'react';

const BannerSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = 5;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        }, 7000);

        return () => clearInterval(timer);
    }, [totalSlides]);

    const changeSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="banner">
            <div
                className="slides"
                style={{
                    transform: `translateX(-${currentIndex * 20}%)`,
                    display: 'flex',
                    transition: 'transform 0.8s ease-in-out',
                }}
            >
                <img src="/images/slide1.jpg" alt="슬라이드 1" />
                <img src="/images/slide2.jpg" alt="슬라이드 2" />
                <img src="/images/slide3.jpg" alt="슬라이드 3" />
                <img src="/images/slide4.jpg" alt="슬라이드 4" />
                <img src="/images/slide5.png" alt="슬라이드 5" />
            </div>
            <div className="indicators">
                {[...Array(totalSlides)].map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => changeSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
