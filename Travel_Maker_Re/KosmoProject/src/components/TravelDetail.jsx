import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext"; 
import "../styles/TravelDetail.css";

// SheetJS 및 FileSaver 가져오기
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TravelDetail = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!tripId) {
      console.error("유효하지 않은 tripId");
      navigate("/trips");
      return;
    }

    fetch(`http://localhost:8586/api/trips/${tripId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.tripId) {
          throw new Error("해당 여행 정보를 찾을 수 없습니다.");
        }
        setTrip(data);
        setReview(data.review || "");
        setRating(data.rating || 0);
        if (data.itineraryDates && data.itineraryDates.length > 0) {
          setSelectedDate(data.itineraryDates[0]);
        } else {
          setSelectedDate(data.startDate);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("여행 정보 불러오기 실패:", err);
        setLoading(false);
      });
  }, [tripId, navigate]);

  const handleDeleteTrip = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      fetch(`http://localhost:8586/api/trips/${tripId}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("삭제 실패");
          }
          alert("여행이 삭제되었습니다.");
          navigate("/trips");
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
          alert("삭제 실패");
        });
    }
  };

  const handleSaveReview = () => {
    if (window.confirm("후기를 저장하시겠습니까? (저장 후에는 일정 수정을 하실 수 없습니다.)")) {
      fetch(`http://localhost:8586/api/trips/${tripId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ review, rating }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("후기 저장 실패");
          }
          alert("후기가 저장되었습니다! 일정 수정을 하실 수 없습니다.");
          setTrip({ ...trip, status: "여행완료" });
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


    try {
        // ✅ 공유하려는 여행이 이미 등록된 경우 확인
        const checkResponse = await axios.get(`http://localhost:8586/api/trips/checkTripShared?tripId=${trip.tripId}`);
        const { alreadyShared, status } = checkResponse.data;

        if (alreadyShared) {
            alert("이미 공유된 여행 일정입니다!");
            return;
        }

        if (status === "계획중") {
            alert("공유하려는 여행의 상태가 '계획중'입니다!");
            return;
        }
        
        // ✅ 공유 여부 확인
        if (!window.confirm("게시물을 공유하시겠습니까?")) {
          return; // 사용자가 취소 버튼을 누르면 공유 취소
        } 

        // ✅ 게시물 공유 요청
        const postData = {
            title: trip.tripTitle,
            content: review,
            nickname: user.nickname,
            board_cate: 1,
            tripId: trip.tripId,
        };

        const response = await axios.post("http://localhost:8586/restBoardWrite.do", postData);

        if (response.status === 200) {
            alert("게시물이 성공적으로 공유되었습니다!");
            navigate("/reviewboard");
        } else {
            throw new Error("게시물 공유 실패");
        }
    } catch (error) {
        console.error("게시물 공유 오류:", error);
        alert("게시물 공유 중 오류가 발생했습니다.");
    }
};

  // 엑셀 내보내기 함수
  const handleExportExcel = () => {
    if (!trip) return;

    // 엑셀에 담을 데이터 배열 생성
    // 예: 각 날짜별로 여행 일정(날짜, 장소)을 행으로 작성
    const data = [];
    const dates = trip.itineraryDates || [];
    dates.forEach(date => {
      const places = (trip.itinerary && trip.itinerary[date]) || [];
      if (places.length === 0) {
        data.push({ 날짜: date, "여행지 이름": "" });
      } else {
        places.forEach(place => {
          data.push({ 날짜: date, "여행지 이름": place });
        });
      }
    });

    // 워크북 생성
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "여행일정");

    // Excel 파일로 내보내기
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `${trip.tripTitle}_일정.xlsx`);
  };

  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (!trip) return <p>여행 정보를 찾을 수 없습니다.</p>;

  const dateOptions = trip.itineraryDates || [];

  return (
    <div className="travel-detail-container">
      <h1 className="travel-title">{trip.tripTitle || "여행 제목 미정"}</h1>
      
      <div className="period-edit-container">
        <p className="travel-period">
          여행 기간: {trip.startDate} ~ {trip.endDate}
        </p>
        {trip.status === "계획중" && (
          <button
            className="edit-itinerary-button"
            onClick={() =>
              navigate(`/plan-trip/${trip.tripId}`, { state: { plan: trip } })
            }
          >
            일정 수정
          </button>
        )}
      </div>



      <div className="itinerary-section">
        <h2 className="section-title">여행 일정</h2>
        <div className="date-selector">
          <label>날짜 선택:</label>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {dateOptions.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div className="itinerary-content">
          {trip.itinerary && trip.itinerary[selectedDate] && trip.itinerary[selectedDate].length > 0 ? (
            trip.itinerary[selectedDate].map((placeName, index) => (
              <div key={index} className="itinerary-card">
                {placeName}
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
          여행 완료
        </button>
      </div>

      <div className="button-group">
        <button className="button button-share" onClick={handleSharePost}>
          게시물에 공유
        </button>
        <button className="button button-excel" onClick={handleExportExcel}>
          엑셀로 저장
        </button>
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
