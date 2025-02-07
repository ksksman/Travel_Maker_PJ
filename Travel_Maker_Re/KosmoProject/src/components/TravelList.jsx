import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/TravelList.css";

const TravelList = () => {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([
    { id: 1, name: "부산 해운대 여행", date: "2024-12-01 ~ 12-05", status: "여행 완료", image: "" },
    { id: 2, name: "제주도 힐링 여행", date: "2024-12-15 ~ 12-20", status: "여행 취소", image: "" },
    { id: 3, name: "강릉 감성 여행", date: "2025-01-05 ~ 01-10", status: "계획 중", image: "" },
  ]);

  const fileInputRefs = useRef({});

  const handleImageUpload = (id, event) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTrips(trips.map(trip => (trip.id === id ? { ...trip, image: imageUrl } : trip)));
    }
  };

  const handleImageButtonClick = (id, event) => {
    event.stopPropagation();
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].click();
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTrips(trips.map(trip => (trip.id === id ? { ...trip, status: newStatus } : trip)));
  };

  return (
    <div className="travel-list-container">
      <button className="create-trip-button" onClick={() => navigate("/create-trip")}>
        + 내 여행 만들기
      </button>

      <h1 className="title">나의 여행 목록</h1>
      <div className="travel-card-container">
        {trips.map(trip => (
          <div key={trip.id} className="travel-card">
            <div className="image-container">
              {trip.image ? (
                <Link to={`/trips/${trip.id}`}>
                  <img src={trip.image} alt={trip.name} className="travel-image" />
                </Link>
              ) : (
                <div className="no-image">
                  <span></span>
                  <button 
                    className="add-image-button" 
                    onClick={(e) => handleImageButtonClick(trip.id, e)}
                  >
                    📷 이미지 추가
                  </button>
                </div>
              )}

              {trip.image && (
                <button 
                  className="change-image-button" 
                  onClick={(e) => handleImageButtonClick(trip.id, e)}
                >
                  🖼 변경
                </button>
              )}

              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputRefs.current[trip.id] = el)}
                onChange={(e) => handleImageUpload(trip.id, e)}
                className="image-upload-input"
                style={{ display: "none" }}
              />
            </div>

            <div className="travel-info">
              <h2 className="travel-title">
                <Link to={`/trips/${trip.id}`} className="travel-link">
                  {trip.name}
                </Link>
              </h2>
              <p><strong>여행 기간:</strong> {trip.date}</p>

              <div className="status-container">
                <label>상태:&nbsp;&nbsp;&nbsp;</label>
                <select value={trip.status} onChange={(e) => handleStatusChange(trip.id, e.target.value)}>
                  <option value="여행 완료">여행 완료</option>
                  <option value="여행 취소">여행 취소</option>
                  <option value="계획 중">계획 중</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelList;
