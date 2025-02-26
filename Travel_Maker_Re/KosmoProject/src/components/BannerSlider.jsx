import React, { useEffect, useState } from "react";
import "../app.css"; // ✅ CSS 적용

const BannerSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = 8; // ✅ 슬라이드 개수

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        }, 7000);

        return () => clearInterval(timer);
    }, []);

    const changeSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="banner">
            <div
                className="slides"
                style={{
                    transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`, 
                    width: `${totalSlides * 100}%`,
                    display: 'flex',
                    transition: 'transform 0.8s ease-in-out',
                }}
            >
                {[
                    "slide111.jpg",
                    "slide444.jpg",
                    "slide333.jpg",
                    "slide222.png",
                    "slide666.jpg",
                    "slide555.webp",
                    "slide777.jpg",
                    "slide888.png",
                ].map((filename, index) => (
                    <div key={index} style={{ width: `${100 / totalSlides}%`, flexShrink: 0 }}>
                        <img
                            src={`/images/${filename}`}  // ✅ 상대 경로로 변경
                            alt={`슬라이드 ${index + 1}`}
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    </div>
                ))}
            </div>
            <div className="indicators">
                {[...Array(totalSlides)].map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${currentIndex === index ? "active" : ""}`}
                        onClick={() => changeSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
