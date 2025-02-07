import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTripPage.css"; // 스타일 추가

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [tripTitle, setTripTitle] = useState("");

  const handleNext = () => {
    if (tripTitle.trim() === "") {
      alert("여행 제목을 입력해주세요.");
      return;
    }
    navigate(`/travel-list`); // ✅ 여행 목록 페이지로 이동
  };

  return (
    <div className="create-trip-container">
      <h2>새 여행 만들기</h2>
      <div className="trip-title-input">
        <label>여행 제목을 입력해주세요</label>
        <input
          type="text"
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
          placeholder="ex) 부산 해운대 여행"
        />
      </div>
      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
};

export default CreateTripPage;
