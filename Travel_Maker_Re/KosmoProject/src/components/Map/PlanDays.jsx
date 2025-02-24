import React, { useState } from "react";
import "../../styles/Mapstyles/PlanDays.css";

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const PlanDays = ({ plan, selectedDate, setSelectedDate }) => {
  const { tripTitle, startDate, endDate } = plan;
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end || start > end) return <p className="error-message">잘못된 날짜 정보</p>;

  const days = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return (
    <div className="plan-days">
      <h2 className="plan-title">{tripTitle || "여행 제목 없음"}</h2>
      <div className="plan-dates-pagination">
        {days.map((day, index) => {
          //  한국(KST) 기준 날짜로 변환
          const formattedDate = new Date(day.getTime() - day.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];

          return (
            <button
              key={index}
              className={`day-btn ${selectedDate === formattedDate ? "active" : ""}`}
              onClick={() => setSelectedDate(formattedDate)} // KST 보장된 날짜 설정
            >
              {`${day.getMonth() + 1}/${day.getDate()}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlanDays;
