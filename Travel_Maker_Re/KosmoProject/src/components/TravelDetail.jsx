import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext"; 
import "../styles/TravelDetail.css";

const TravelDetail = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) {
      console.error("유효하지 않은 tripId");
      navigate("/trips");
    }
  }, [tripId, navigate]);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8586/api/trips/${tripId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTrip(data);
        setReview(data.review || "");
        setRating(data.rating || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("여행 정보 불러오기 실패:", err);
        setLoading(false);
      });
  }, [tripId]);

  // 시작일과 종료일 사이의 날짜 배열 생성 함수 ("YYYY-MM-DD" 형식)
  const generateDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }
    return dates;
  };

  const dateOptions =
    trip && trip.itineraryDates && trip.itineraryDates.length > 0
      ? trip.itineraryDates
      : trip
      ? generateDateRange(trip.startDate, trip.endDate)
      : [];

  const handleDeleteTrip = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      fetch(`http://localhost:8586/api/trips/${tripId}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            alert("여행이 삭제되었습니다.");
            navigate("/trips");
          } else {
            throw new Error("삭제 실패");
          }
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
          alert("삭제 실패");
        });
    }
  };

  // 후기 저장 처리: "저장하시겠습니까?" 확인 후 저장, 성공 시 trip 상태를 "여행완료"로 업데이트
  const handleSaveReview = () => {
    if (window.confirm("저장하시겠습니까? 저장을 한 후에는 일정 수정을 하실수 없습니다.")) {
      fetch(`http://localhost:8586/api/trips/${tripId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ review, rating }),
      })
        .then((res) => {
          if (res.ok) {
            alert("후기가 저장되었습니다! 일정 수정을 하실 수 없습니다.");
            // 여행 상태를 업데이트하여 일정 수정 버튼을 감춤
            setTrip({ ...trip, status: "여행완료" });
          } else {
            throw new Error("후기 저장 실패");
          }
        })
        .catch((err) => {
          console.error("후기 저장 실패:", err);
          alert("후기 저장 실패");
        });
    }
  };

  const handleSharePost = async () => {
    if (!trip || !user) {
        alert("로그인 정보나 여행 정보가 없습니다.");
        return;
    }

    if (trip.status !== "여행완료") {
      alert("여행이 완료된 경우에만 공유할 수 있습니다.");
      return;
    }

    const postData = {
        title: trip.tripTitle,
        content: review,
        nickname: user.nickname, // ✅ 실제 로그인 사용자 정보
        board_cate: 1,
        tripId: trip.tripId, // ✅ tripId 추가
    };

    try {
        const response = await axios.post("http://localhost:8586/restBoardWrite.do", postData);
        if (response.status === 200) {
            alert("게시물이 공유되었습니다!");
            navigate("/reviewboard");
        } else {
            throw new Error("게시물 공유 실패");
        }
    } catch (error) {
        console.error("게시물 공유 오류:", error);
    }
};

  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (!trip) return <p>여행 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="travel-detail-container">
      <h1 className="travel-title">{trip.tripTitle || "여행 제목 미정"}</h1>
      
      {/* 여행 기간 중앙 정렬, 일정 수정 버튼은 오른쪽에 표시 */}
      <div className="period-edit-container">
        <p className="travel-period">
          여행 기간: {trip.startDate} ~ {trip.endDate}
        </p>
        {trip.status === "계획중" && (
          <button
            className="edit-itinerary-button"
            onClick={() => navigate("/plan-trip")}
          >
            일정 수정
          </button>
        )}
      </div>

      <div className="itinerary-section">
        <h2 className="section-title">여행 일정</h2>
        <div className="date-selector">
          <label>날짜 선택:</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateOptions.length > 0 ? (
              dateOptions.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))
            ) : (
              <option value="">일정 없음</option>
            )}
          </select>
        </div>
        <div className="itinerary-content">
          {trip.itinerary && trip.itinerary[selectedDate] ? (
            trip.itinerary[selectedDate].map((place, index) => (
              <div key={index} className="itinerary-card">
                {place}
              </div>
            ))
          ) : (
            <p>해당 날짜의 일정이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="review-section">
        <h3>내 여행 후기:</h3>
        <textarea
          className="review-textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        {/* 평점 영역을 후기 텍스트와 저장 버튼 사이에 배치 */}
        <div className="rating-container">
          <h3>나의 평점:</h3>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "selected" : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button className="button button-edit" onClick={handleSaveReview}>
          저장
        </button>
      </div>

      <div className="button-group">
        <button className="button button-share"
          onClick={handleSharePost}>게시물에 공유</button>
        <button className="button button-excel">엑셀로 저장</button>
        <button className="button button-delete" onClick={handleDeleteTrip}>
          삭제
        </button>
      </div>

      <Link to="/trips" className="back-link">
        목록으로 돌아가기
      </Link>
    </div>
  );
};

export default TravelDetail;
