import React from 'react';
import BannerSlider from '../components/BannerSlider';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import TouristChart from '../components/TouristChart';
import '../App.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path); // 원하는 경로로 이동
    };

    return (
        <div className="main-container">
            {/* 배너 슬라이더 */}
            <BannerSlider />

            {/* 콘텐츠 박스 */}
            <div className="content-section">
                <div className="content-boxes">

                 {/* ✅ 기존 "연령별 추천 여행지" 대신 TouristChart 추가 */}
                    <div className="recommended-travel content-box">
                        <button
                            className="navigate-button"
                            onClick={() => handleNavigate('/travel-recommendations')}
                        >
                            <FaPlusCircle />
                        </button>
                        <h2>연령별 인기 관광지</h2>
                        <TouristChart /> {/* ✅ 차트 삽입 */}
                    </div>

                     {/* 후기 게시판 인기글 */}
                     <div className="recommended-travel content-box">
                        <button
                            className="navigate-button"
                            onClick={() => handleNavigate('/travel-recommendations')}
                        >
                            <FaPlusCircle />
                        </button>
                        <h2 className="review-title">후기 게시판 인기글</h2>
                    <div className="review-container">
                        
                        <ul className="review-list">
                            <li>
                                <a href="/board/post/1" className="review-item">
                                    <span className="review-title-text">여행 후기 - 제주도에서의 하루</span>
                                    <span className="review-likes">❤️ 120 좋아요</span>
                                </a>
                            </li>
                            <li>
                                <a href="/board/post/2" className="review-item">
                                    <span className="review-title-text">강릉 맛집 추천!</span>
                                    <span className="review-likes">❤️ 98 좋아요</span>
                                </a>
                            </li>
                            <li>
                                <a href="/board/post/3" className="review-item">
                                    <span className="review-title-text">서울 야경 투어 후기</span>
                                    <span className="review-likes">❤️ 85 좋아요</span>
                                </a>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;