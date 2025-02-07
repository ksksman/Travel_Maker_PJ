import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/TravelList.css"; // ✅ CSS 파일 불러오기

const TravelList = () => {
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 Hook

  // ✅ 여행 데이터 (테스트용, 나중에 백엔드에서 가져올 것)
  const [trips, setTrips] = useState([
    { id: 1, name: "부산 해운대 여행", date: "2024-12-01 ~ 12-05", status: "여행 완료", image: "" },
    { id: 2, name: "제주도 힐링 여행", date: "2024-12-15 ~ 12-20", status: "여행 취소", image: "" },
    { id: 3, name: "강릉 감성 여행", date: "2025-01-05 ~ 01-10", status: "계획 중", image: "" },
  ]);

  // ✅ 파일 입력 필드 참조 (숨겨진 input을 클릭하기 위해 사용)
  const fileInputRefs = useRef({});

  // ✅ 이미지 업로드 핸들러 (추가 및 변경)
  const handleImageUpload = (id, event) => {
    event.stopPropagation(); // ✅ 상세보기 이동 방지
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTrips(trips.map(trip => (trip.id === id ? { ...trip, image: imageUrl } : trip)));
    }
  };

  // ✅ 이미지 추가/변경 버튼 클릭 시 파일 선택 창 열기
  const handleImageButtonClick = (id, event) => {
    event.stopPropagation(); // ✅ 상세보기 이동 방지
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].click();
    }
  };

  // ✅ 여행 상태 변경 핸들러
  const handleStatusChange = (id, newStatus) => {
    setTrips(trips.map(trip => (trip.id === id ? { ...trip, status: newStatus } : trip)));
  };

  return (
    <div className="travel-list-container">
      {/* ✅ 내 여행 만들기 버튼 (우측 상단) */}
      <button className="create-trip-button" onClick={() => navigate("/create-trip")}>
        + 내 여행 만들기
      </button>

      <h1 className="title">나의 여행 목록</h1>
      <div className="travel-card-container">
        {trips.map(trip => (
          <div key={trip.id} className="travel-card">
            <div className="image-container">
              {/* ✅ 이미지가 있으면 클릭 시 상세보기로 이동 */}
              {trip.image ? (
                <Link to={`/trips/${trip.id}`}>
                  <img src={trip.image} alt={trip.name} className="travel-image" />
                </Link>
              ) : (
                <div className="no-image">
                  <span></span>
                  {/* ✅ 이미지 추가 버튼 (상세보기로 이동하지 않음) */}
                  <button 
                    className="add-image-button" 
                    onClick={(e) => handleImageButtonClick(trip.id, e)}
                  >
                    📷 이미지 추가
                  </button>
                </div>
              )}

              {/* ✅ 이미지 변경 버튼 (우측 상단) */}
              {trip.image && (
                <button 
                  className="change-image-button" 
                  onClick={(e) => handleImageButtonClick(trip.id, e)}
                >
                  🖼 변경
                </button>
              )}

              {/* ✅ 숨겨진 파일 입력 필드 */}
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

              {/* ✅ 상태 변경 드롭다운 */}
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
