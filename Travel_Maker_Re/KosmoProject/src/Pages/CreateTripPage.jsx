import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CreateTripPage.css";

const CreateTripPage = () => {
  const navigate = useNavigate();

  // 여행 제목 상태
  const [tripTitle, setTripTitle] = useState("");

  // UI 상태
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // "다음" 버튼 클릭 시 → 제목 입력창을 숨기고 달력 표시
  const handleNext = () => {
    if (tripTitle.trim() === "") {
      alert("여행 제목을 입력해주세요.");
      return;
    }
    setShowTitleInput(false);
    setShowCalendar(true);
  };

  // "날짜 선택 완료" 버튼 클릭 시 → 선택한 날짜 저장 후 달력 닫기
  const handleConfirmDates = () => {
    if (!startDate || !endDate) {
      alert("가는 날과 오는 날을 선택해주세요.");
      return;
    }
    setShowCalendar(false);
  };

  // 달력 화면에서 "이전" 버튼 클릭 시 → 제목 입력창만 보이도록 날짜 초기화
  const handlePreviousTitle = () => {
    setShowCalendar(false);
    setShowTitleInput(true);
    setStartDate(null); // 선택한 날짜 초기화
    setEndDate(null);   // 선택한 날짜 초기화
  };

  // 선택된 날짜 화면에서 "날짜 수정" 버튼 클릭 시 → 달력 화면으로 돌아가기
  const handleEditDates = () => {
    setShowCalendar(true);
  };

  return (
    <div className="create-trip-container">
      {/* 제목 입력 섹션 */}
      {showTitleInput && !showCalendar && (
        <div className="trip-title-section">
          <h2>새 여행 만들기</h2>
          <div className="trip-title-input">
            <label>여행 제목을 입력해주세요</label>
            <input
              type="text"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="예: 일본 도쿄 여행"
            />
          </div>
          <button className="next-button" onClick={handleNext}>
            다음
          </button>
        </div>
      )}

      {/* 달력 팝업 */}
      {showCalendar && (
        <div className="calendar-popup">
          <h3>여행 날짜 선택</h3>
          <div className="date-picker-container">
            <div>
              <p>가는 날</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy.MM.dd"
                className="date-input"
                placeholderText="직접 입력 가능"
              />
            </div>
            <div>
              <p>오는 날</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy.MM.dd"
                className="date-input"
                placeholderText="직접 입력 가능"
              />
            </div>
          </div>
          <div className="calendar-buttons">
            <button className="previous-button" onClick={handlePreviousTitle}>
              이전
            </button>
            <button className="confirm-dates-button" onClick={handleConfirmDates}>
              날짜 선택 완료
            </button>
          </div>
        </div>
      )}

      {/* 선택된 날짜 표시 */}
      {!showCalendar && startDate && endDate && (
        <div className="selected-dates">
          <p>가는 날: {startDate.toLocaleDateString()}</p>
          <p>오는 날: {endDate.toLocaleDateString()}</p>
          <div className="final-buttons">
            <button className="edit-dates-button" onClick={handleEditDates}>
              날짜 수정
            </button>
            <button className="next-step-button" onClick={() => navigate("/plan-trip")}>
              관광지 계획짜기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTripPage;
