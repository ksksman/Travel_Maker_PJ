import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import '../../../App.css';

function ReviewViewPage() {
    const { user } = useAuth();
    const { board_idx } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8586/restBoardView.do?board_idx=${board_idx}`)
            .then((response) => response.json())
            .then((data) => {
                setReview(data);
                setLikes(parseInt(data.like_count));
                setViews(parseInt(data.view_count));
                setLoading(false);
            })
            .catch((error) => {
                console.error("게시글 상세 정보 API 호출 오류:", error);
                setLoading(false);
            });

        fetch(`http://localhost:8586/increaseViewCount.do?board_idx=${board_idx}`, {
            method: "PATCH"
        })
        .then(() => setViews(prevViews => parseInt(prevViews) + 1))
        .catch((error) => console.error("조회수 증가 오류:", error));
    }, [board_idx]);

    if (loading) return <div className="loading">게시글을 불러오는 중...</div>;
    if (!review) return <div className="error">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="review-view-container">
            <button className="back-button" onClick={() => navigate("/reviewboard")}>← 목록으로 돌아가기</button>
            <h2 className="review-view-title">{review.title}</h2>
            <div className="review-meta">
                <span className="author">작성자: {review.nickname}</span>
                <span>조회수: {views}</span>
                <span className="like-count">❤️ {likes}</span>
            </div>
            <div className="review-content">
                {/* ✅ 이미지 출력 */}
                {review.attached_file && (
                    <img src={review.attached_file} alt="게시물 이미지" style={{ maxWidth: "100%" }} />
                )}
                <p>{review.content}</p>
            </div>
        </div>
    );
}

export default ReviewViewPage;
