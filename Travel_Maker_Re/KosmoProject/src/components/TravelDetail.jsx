import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/TravelDetail.css"; // ✅ CSS 파일 불러오기

const TravelDetail = () => {
  const { id } = useParams();

  // ✅ Mock 데이터 (백엔드 연결 후 API로 가져올 예정)
  const mockData = {
    1: {
      name: "부산 해운대 주변 여행",
      date: "2024-12-01 ~ 2024-12-05",
      myReview: "직운으로 가는게 편함. 신혼 때 갔다온 곳인데 다시 와도 좋다.",
      itinerary: {
        "2024-12-01": ["씨라이프 부산 아쿠아리움", "동백섬"],
        "2024-12-02": ["부산시립미술관 본관", "해운대 블루라인파크"],
        "2024-12-03": ["감천문화마을", "자갈치시장"],
        "2024-12-04": ["송도해수욕장", "부산타워"],
        "2024-12-05": ["BIFF 거리"]
      },
      rating: 3, // ⭐️⭐️⭐️ (5점 만점)
    },
  };

  const trip = mockData[id];

  // ✅ 상태 관리
  const [rating, setRating] = useState(trip?.rating || 0);
  const [selectedDate, setSelectedDate] = useState(Object.keys(trip?.itinerary || {})[0] || ""); // 기본 날짜 설정
  const [review, setReview] = useState(trip?.myReview || "");
  const [isEditing, setIsEditing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(""); // ✅ 배경 이미지 저장

  if (!trip) return <p>여행 정보를 찾을 수 없습니다.</p>;

  // ✅ 별점 변경 핸들러
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // ✅ 후기 수정 핸들러
  const handleEditReview = () => {
    setIsEditing(true);
  };

  // ✅ 후기 저장 핸들러
  const handleSaveReview = () => {
    setIsEditing(false);
    axios.put(`http://localhost:8080/api/trips/${id}/review`, { review })
      .catch(error => console.error("후기 저장 중 오류 발생:", error));
  };

  // ✅ 배경 이미지 업로드 핸들러
  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // ✅ 브라우저에서 미리보기 URL 생성
      setBackgroundImage(imageUrl);
    }
  };

  return (
    <div 
      className="travel-detail-container" 
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none" }} // ✅ 배경 이미지 적용
    >
      <h1 className="travel-title">{trip.name}</h1>
      <p className="travel-date"><strong>여행 기간:</strong> {trip.date}</p>

      {/* 🔥 날짜 선택 드롭다운 (셀렉트 박스) */}
      <div className="date-selector">
        <label><strong>날짜 선택:</strong> </label>
        <select 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {Object.keys(trip.itinerary).map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </select>
      </div>

      {/* 🔥 선택한 날짜의 일정 표시 */}
      <div className="itinerary-details">
        <h3>{selectedDate} 일정</h3>
        <ul>
          {trip.itinerary[selectedDate]?.map((place, index) => (
            <li key={index}>{place}</li>
          ))}
        </ul>
      </div>

      <div className="review-section">
        <p><strong>내 여행 후기:</strong></p>
        {isEditing ? (
          <>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              cols="50"
              className="review-textarea"
            />
            <button onClick={handleSaveReview} className="save-button">저장</button>
          </>
        ) : (
          <>
            <p className="review-text">{review}</p>
            <button onClick={handleEditReview} className="edit-button">수정</button>
          </>
        )}
      </div>

      {/* 🔥 평점 섹션 */}
      <div className="rating-section">
        <p><strong>나의 평점:</strong></p>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingChange(star)}
            className={star <= rating ? "star filled" : "star"}
          >
            ★
          </span>
        ))}
      </div>

     

      <div className="button-group">
        <button className="share-button">게시물에 공유</button>
        <button className="excel-button">엑셀로 정보 저장</button>
        <button className="delete-button">삭제</button>
      </div>

      <Link to="/" className="back-link">목록으로 돌아가기</Link>
    </div>
  );
};

export default TravelDetail;
