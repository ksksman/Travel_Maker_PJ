import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/TravelDetail.css";

const TravelDetail = () => {
  const { tripId } = useParams();
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
  const [itinerary, setItinerary] = useState([]);

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
        const dates = data.itineraryDates || [];
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        } else {
          setSelectedDate("");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("여행 정보 불러오기 실패:", err);
        setLoading(false);
      });
  }, [tripId]);

  const itineraryDates = trip?.itineraryDates || [];

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

  const handleSaveReview = () => {
    fetch(`http://localhost:8586/api/trips/${tripId}/review`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ review, rating }),
    })
      .then((res) => {
        if (res.ok) {
          alert("후기가 저장되었습니다!");
        } else {
          throw new Error("후기 저장 실패");
        }
      })
      .catch((err) => {
        console.error("후기 저장 실패:", err);
        alert("후기 저장 실패");
      });
  };

  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (!trip) return <p>여행 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="travel-detail-container">
      <h1 className="travel-title">{trip.tripTitle || "여행 제목 미정"}</h1>
      <div className="period-edit-container">
        <p className="travel-period">
          여행 기간: {trip.startDate} ~ {trip.endDate}
        </p>
        {/* 조건 없이 바로 /plan-trip 으로 이동 */}
        <button
          className="edit-itinerary-button"
          onClick={() => navigate("/plan-trip")}
        >
          일정 수정
        </button>
      </div>

      <div className="itinerary-section">
        <h2 className="section-title">여행 일정</h2>
        <div className="date-selector">
          <label>날짜 선택:</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {itineraryDates.length > 0 ? (
              itineraryDates.map((date) => (
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
        <button className="button button-share">게시물에 공유</button>
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
