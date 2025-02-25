import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import '../../../App.css';

function ReviewViewPage() {
    const { user } = useAuth(); // 로그인 정보 가져오기
    const { board_idx } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [hasLiked, setHasLiked] = useState(false); // ✅ 사용자가 이미 좋아요를 눌렀는지 확인
    const [tripData, setTripData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(""); // 선택된 날짜
    const [itinerary, setItinerary] = useState({}); // 날짜별 일정 목록
    

    // 🔍 특정 게시글 상세 정보 불러오기
    useEffect(() => {
        fetch(`http://localhost:8586/restBoardView.do?board_idx=${board_idx}`)
            .then((response) => response.json())
            .then((data) => {
                setReview(data);
                setLikes(parseInt(data.like_count));
                setViews(parseInt(data.view_count));
                
                console.log('data :>> ', data);
                // ✅ 해당 게시글이 여행 정보(tripId)와 연결되어 있으면 추가 API 호출
                if (data.tripId) {
                    fetch(`http://localhost:8586/api/trips/tripWithItinerary/${data.tripId}`)
                        .then((res) => res.json())
                        .then((trip) => {
                            setTripData(trip);
                            setItinerary(trip.itinerary || {});

                            // 여행 일정 날짜 목록 설정
                            const itineraryDates = Object.keys(trip.itinerary || {});
                            if (itineraryDates.length > 0) {
                                setSelectedDate(itineraryDates[0]); // 첫 번째 날짜를 기본값으로 설정
                            }
                        })
                        .catch((err) => console.error("여행 정보 불러오기 오류:", err));
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("게시글 상세 정보 API 호출 오류:", error);
                setLoading(false);
            });

        // ✅ 조회수 증가 요청
        fetch(`http://localhost:8586/increaseViewCount.do?board_idx=${board_idx}`, {
            method: "PATCH"
        })
        .then(() => setViews(prevViews => parseInt(prevViews) + 1))
        .catch((error) => console.error("조회수 증가 오류:", error));
        
    }, [board_idx]);

    // ✅ 사용자가 이 게시글에 좋아요를 눌렀는지 확인 (user 변경 시 실행)
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8586/checkLike?userId=${user.user_Id}&boardIdx=${board_idx}`)
                .then(response => response.json())
                .then(isLiked => setHasLiked(isLiked))
                .catch(error => console.error("좋아요 확인 오류:", error));
        }
    }, [user]); // ✅ `user`가 변경될 때만 실행

    // ✅ 좋아요 증가 기능
    function handleLike() {
        if (!user) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }
        const url = hasLiked 
            ? `http://localhost:8586/removeLike?userId=${user.user_Id}&boardIdx=${board_idx}`
            : `http://localhost:8586/addLike?userId=${user.user_Id}&boardIdx=${board_idx}`;

        fetch(url, { method: hasLiked ? "DELETE" : "POST" })
            .then(() => {
                setLikes(prev => hasLiked ? prev - 1 : prev + 1);
                setHasLiked(!hasLiked);
            })
            .catch(error => console.error("좋아요 오류:", error));
    }

    // ✅ 게시글 수정 기능
    function handleEdit() {
        navigate(`/reviewboard/edit/${board_idx}`); // 수정 페이지로 이동
    }

    // ✅ 게시글 삭제 기능
    function handleDelete() {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            fetch(`http://localhost:8586/deleteBoard.do?board_idx=${board_idx}`, {
                method: "DELETE"
            })
            .then((response) => {
                if (response.ok) {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/reviewboard");
                } else {
                    alert("게시글 삭제에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("게시글 삭제 오류:", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            });
        }
    }

    if (loading) {
        return <div className="loading">게시글을 불러오는 중...</div>;
    }

    if (!review) {
        return <div className="error">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="review-view-container">
            {/* 🔙 목록으로 돌아가기 버튼 (왼쪽 상단 배치) */}
            <button className="back-button" onClick={() => navigate("/reviewboard")}>← 목록으로 돌아가기</button>

            <h2 className="review-view-title">{review.title}</h2>

            {/* 🔎 작성자 & 조회수 & 좋아요 */}
            <div className="review-meta">
                <span className="author">작성자: {review.nickname}</span>
                <div className="meta-right">
                    <span>조회수: {views}</span>
                    <span className="like-count">❤️ {likes}</span>
                </div>
            </div>

            {/* 🔎 작성일 */}
            <div className="post-date">작성일: {review.post_date}</div>

            {/* 🔥 여행 평점 추가 */}
            {tripData && (
                <div className="trip-rating">
                    {/* <h3>여행 평점:</h3> */}
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${tripData.rating >= star ? "selected" : ""}`}
                        >
                            ★
                        </span>
                    ))}
                    {/* <span className="rating-text">({tripData.rating || "-"})</span> */}
                </div>
            )}

            <div className="review-content">
                {/* ✅ 여행 일정 출력 */}
                {tripData && (
                    <div className="itinerary-section">
                        <h2 className="section-title">여행 일정</h2>
                        <div className="date-selector">
                            <label>날짜 선택:</label>
                            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                {Object.keys(itinerary).map((date) => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        </div>
                        <div className="itinerary-content">
                            {itinerary[selectedDate] && itinerary[selectedDate].length > 0 ? (
                                itinerary[selectedDate].map((place, index) => (
                                    <div key={index} className="itinerary-card">
                                        {place}
                                    </div>
                                ))
                            ) : (
                                <p>해당 날짜의 일정이 없습니다.</p>
                            )}
                        </div>
                    </div>
                )}
                <p>{review.content}</p>
            </div>

            {/* 좋아요 버튼 */}
            <div className="like-button-container">
                <button className="like-button" onClick={handleLike} disabled={!user}>
                    {hasLiked ? "❤️ 좋아요 완료" : "❤️ 좋아요"}
                </button>
            </div>

            {/* ✏ 수정 & 🗑 삭제 버튼 (오른쪽 정렬) */}
            {/* ✅ 로그인한 사용자와 게시글 작성자가 같을 경우에만 수정, 삭제 버튼 표시 */}
            {user && user.nickname === review.nickname && (
            <div className="button-container">
                <button className="edit-button" onClick={handleEdit}>✏ 수정</button>
                <button className="delete-button" onClick={handleDelete}>🗑 삭제</button>
            </div>
            )}
        </div>
    );
}

export default ReviewViewPage;
