import React, { useState } from "react";
import "../../styles/Mapstyles/PlanDays.css";

const PlanDays = ({ plan }) => {
    if (!plan) return null;

    const { title, startDate, endDate } = plan;

    //  날짜 차이를 계산하여 최대 5일까지 버튼 생성
    const start = new Date(startDate);
    const end = new Date(endDate);
    let diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > 5) diffDays = 5; //  최대 5일까지 제한

    //  현재 선택된 날짜 (기본적으로 첫 번째 날짜 선택)
    const [selectedDay, setSelectedDay] = useState(0);

    return (
        <div className="plan-days">
            <span className="plan-title">{title}</span>
            <div className="plan-dates">
                {[...Array(diffDays)].map((_, index) => (
                    <button 
                        key={index} 
                        className={`day-btn ${selectedDay === index ? "active" : ""}`} 
                        onClick={() => setSelectedDay(index)} //  클릭 시 해당 날짜 강조
                    >
                        {start.getDate() + index}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlanDays;
