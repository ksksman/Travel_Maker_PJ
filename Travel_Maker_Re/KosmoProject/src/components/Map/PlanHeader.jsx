import React, { useState } from "react";
import axios from "axios";
import "../../styles/Mapstyles/PlanHeader.css";

const PlanHeader = ({ setPlan }) => {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const savePlan = async () => {
        if (!title || !startDate || !endDate) {
            alert("제목과 날짜를 입력하세요.");
            return;
        }

        try {
            await axios.post("http://localhost:8586/api/plan-trip", {
                title,
                startDate,
                endDate,
            });
            setPlan({ title, startDate, endDate }); // 상위 컴포넌트에 전달
            alert("여행 일정이 저장되었습니다!");
        } catch (error) {
            console.error("저장 오류:", error);
        }
    };

    return (
        <div className="plan-header">
            <input type="text" placeholder="여행 제목" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={savePlan}>Next</button>
        </div>
    );
};

export default PlanHeader;
