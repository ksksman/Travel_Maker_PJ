import React from 'react';
import BannerSlider from '../components/BannerSlider';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import TouristChart from '../components/TouristChart';
import '../App.css';

const HomePage = () => {
    const navigate = useNavigate(); // 🔥 useNavigate 훅 사용
    const [topLikedReviews, setTopLikedReviews] = useState([]); // 후기 게시글 Top3 데이터

    // ✅ 백엔드에서 좋아요가 가장 많은 게시물 6개 가져오기
    useEffect(() => {
        fetch("http://localhost:8586/topLikedReviews.do")
            .then((response) => response.json())
            .then((data) => {
                setTopLikedReviews(data);
            })
            .catch((error) => console.error("후기 게시판 인기글 불러오기 오류:", error));
    }, []);

    const handleNavigate = (path) => {
        console.log(`Navigating to: ${path}`); // 🔥 디버깅용 로그 추가
        navigate(path);
    };

    return (
        <div className="main-container">
            {/* ❌ 🔥 여기에 로그인 & 회원가입 버튼이 있으면 삭제해야 함 */}
            
            {/* 배너 슬라이더 */}
            <BannerSlider />

            {/* 콘텐츠 박스 */}
            <div className="content-section">
                <div className="content-boxes">
                    <div className="recommended-travel content-box">
                        <button
                            className="navigate-button"
                            onClick={() => handleNavigate('/tourist')}
                        >
                            <FaPlusCircle />
                        </button>
                         <h2>연령별 인기 관광지</h2>
                        <TouristChart /> {/* ✅ 차트 삽입 */}
                    </div>

                    <div className="notice-section content-box">
                        <button
                            className="navigate-button"
                            onClick={() => handleNavigate('/trips')}
                        >
                            <FaPlusCircle />
                        </button>
                        <h2>후기 게시판 인기글</h2>
                        <ul className="popular-posts-list">
                            {topLikedReviews.length > 0 ? (
                                topLikedReviews.map((post) => (
                                    <li key={post.board_idx}>
                                        <a href={`/reviewboard/${post.board_idx}`} className="post-item">
                                            <span className="post-title">{post.title}</span>
                                            <span className="post-likes">❤️ {post.like_count} 좋아요</span>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="no-results">🔥 인기 게시글이 없습니다.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
