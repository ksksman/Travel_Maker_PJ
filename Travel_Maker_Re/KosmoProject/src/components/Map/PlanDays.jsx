import React, { useState } from "react";
import "../../styles/Mapstyles/PlanDays.css";

// "YYYY-MM-DD" 문자열을 로컬 Date 객체로 파싱하는 함수 (UTC offset 문제 방지)
const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const PlanDays = ({ plan }) => {
  if (!plan) return null;

  const { title, startDate, endDate } = plan;
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  // 시작일부터 종료일까지 날짜 배열 생성
  const days = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 한 페이지에 표시할 날짜 수
  const DAYS_PER_PAGE = 3;

  // 전체 페이지 수
  const totalPages = Math.ceil(days.length / DAYS_PER_PAGE);

  // 현재 페이지 (기본값: 1)
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 해당하는 날짜 배열(slice)
  const startIndex = (currentPage - 1) * DAYS_PER_PAGE;
  const endIndex = startIndex + DAYS_PER_PAGE;
  const currentDays = days.slice(startIndex, endIndex);

  // 현재 선택된 날짜 인덱스(페이지 내 인덱스)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 이전 페이지
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedIndex(0); // 페이지 바뀔 때 선택 초기화
    }
  };

  // 다음 페이지
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedIndex(0); // 페이지 바뀔 때 선택 초기화
    }
  };

  return (
    <div className="plan-days">
      <span className="plan-title">{title}</span>
      <div className="plan-dates-pagination">
        {/* 이전 버튼 */}
        {currentPage > 1 && (
          <button onClick={handlePrevPage} className="pagination-btn">
            이전
          </button>
        )}

        {/* 날짜 버튼들 (현재 페이지에 해당하는 부분만) */}
        {currentDays.map((day, index) => (
          <button
            key={index}
            className={`day-btn ${selectedIndex === index ? "active" : ""}`}
            onClick={() => setSelectedIndex(index)}
          >
            {`${day.getMonth() + 1}/${day.getDate()}`}
          </button>
        ))}

        {/* 다음 버튼 */}
        {currentPage < totalPages && (
          <button onClick={handleNextPage} className="pagination-btn">
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanDays;
