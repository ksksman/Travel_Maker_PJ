import React from 'react';
import BannerSlider from '../components/BannerSlider';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
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
                    <div className="recommended-travel content-box">
                        <button
                            className="navigate-button"
                            onClick={() => handleNavigate('/travel-recommendations')}
                        >
                            <FaPlusCircle />
                        </button>
                        <h2>연령별 추천 여행지</h2>
                        <div className="travel-recommendations-grid">
                            <div className="travel-item">
                                <span className="travel-destination">가족 여행지 - 강릉</span>
                                <span className="travel-detail">🏖️ 해변과 맛집이 가득!</span>
                            </div>
                            <div className="travel-item">
                                <span className="travel-destination">커플 여행지 - 남해</span>
                                <span className="travel-detail">🌄 아름다운 오션뷰!</span>
                            </div>
                            <div className="travel-item">
                                <span className="travel-destination">혼자 여행지 - 부산</span>
                                <span className="travel-detail">🎨 예술과 문화의 도시!</span>
                            </div>
                            <div className="travel-item">
                                <span className="travel-destination">힐링 여행지 - 제주</span>
                                <span className="travel-detail">🍊 자연 속 힐링!</span>
                            </div>
                        </div>
                    </div>

                    <div className="notice-section content-box">
                        <button
                            className="navigate-button"
                            onClick={() => handleNavigate('/board')}
                        >
                            <FaPlusCircle />
                        </button>
                        <h2>후기 게시판 인기글</h2>
                        <ul className="popular-posts-list">
                            <li>
                                <a href="/board/post/1" className="post-item">
                                    <span className="post-title">여행 후기 - 제주도에서의 하루</span>
                                    <span className="post-likes">❤️ 120 좋아요</span>
                                </a>
                            </li>
                            <li>
                                <a href="/board/post/2" className="post-item">
                                    <span className="post-title">강릉 맛집 추천!</span>
                                    <span className="post-likes">❤️ 98 좋아요</span>
                                </a>
                            </li>
                            <li>
                                <a href="/board/post/3" className="post-item">
                                    <span className="post-title">서울 야경 투어 후기</span>
                                    <span className="post-likes">❤️ 85 좋아요</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
