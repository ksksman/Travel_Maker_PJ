import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/TravelList.css";
import { useAuth } from "../AuthContext"; // 실제 경로에 맞게 수정

const TravelList = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [trips, setTrips] = useState([]);
  const fileInputRefs = useRef({});

  // 여행 목록 가져오기: 로그인된 사용자 필터링
  useEffect(() => {
    if (!loading && user) {
      fetch("http://localhost:8586/api/trips", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((trip) => trip.userId === user.user_Id);
          setTrips(filtered);
        })
        .catch((err) => console.error("여행 목록 가져오기 실패:", err));
    }
  }, [loading, user]);

  if (loading) {
    return <p>로딩중...</p>;
  }
  if (!user) {
    return (
      <div className="travel-list-container">
        <p>로그인이 필요합니다.</p>
        <button onClick={() => navigate("/login")}>로그인 하러 가기</button>
      </div>
    );
  }

  // 파일 업로드 및 이미지 업데이트 함수
  const handleImageUpload = (tripId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    // 이미지 업로드 API 호출
    fetch("http://localhost:8586/api/upload", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.imageUrl) {
          // 이미지 URL 업데이트 API 호출
          fetch(`http://localhost:8586/api/trips/${tripId}/review/image`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ image: data.imageUrl })
          })
            .then((res2) => {
              if (res2.ok) {
                setTrips(
                  trips.map((t) =>
                    t.tripId === tripId ? { ...t, image: data.imageUrl } : t
                  )
                );
              } else {
                throw new Error("이미지 DB 업데이트 실패, 상태: " + res2.status);
              }
            })
            .catch((err) => console.error("이미지 업데이트 실패:", err));
        }
      })
      .catch((err) => console.error("파일 업로드 실패:", err));
  };

  const handleImageButtonClick = (tripId, e) => {
    e.stopPropagation();
    if (fileInputRefs.current[tripId]) {
      fileInputRefs.current[tripId].click();
    }
  };

  return (
    <div className="travel-list-container">
      <button className="create-trip-button" onClick={() => navigate("/create-trip")}>
        + 내 여행 만들기
      </button>
      <h1 className="title">나의 여행 목록</h1>
      <div className="travel-card-container">
        {trips.map((trip) => (
          <div key={trip.tripId} className="travel-card">
            <div className="image-container">
              {trip.image ? (
                <Link to={`/trips/${trip.tripId}`}>
                  <img
                    src={`http://localhost:8586${trip.image}`}
                    alt={trip.tripTitle || "여행 이미지"}
                    className="travel-image"
                  />
                </Link>
              ) : (
                <div className="no-image">
                  <button
                    className="add-image-button"
                    onClick={(e) => handleImageButtonClick(trip.tripId, e)}
                  >
                    📷 이미지 추가
                  </button>
                </div>
              )}
              {trip.image && (
                <button
                  className="change-image-button"
                  onClick={(e) => handleImageButtonClick(trip.tripId, e)}
                >
                  🖼 변경
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputRefs.current[trip.tripId] = el)}
                onChange={(e) => {
                  e.stopPropagation();
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(trip.tripId, file);
                  }
                }}
                className="image-upload-input"
                style={{ display: "none" }}
              />
            </div>
            <div className="travel-info">
              <h2 className="travel-title">
                <Link to={`/trips/${trip.tripId}`} className="travel-link">
                  {trip.tripTitle || "여행 제목 미정"}
                </Link>
              </h2>
              <p>
                <strong>여행 기간:</strong> {trip.startDate} ~ {trip.endDate}
              </p>
              <p>
                <strong>상태:</strong> {trip.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelList;
