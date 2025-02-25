import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "../app.css";
import { FaChartBar, FaMapMarkerAlt, FaStar, FaCameraRetro } from "react-icons/fa";

const ageColors = {
  "20": "#007bff", // 파랑
  "30": "#28a745", // 초록
  "40": "#ffc107", // 노랑
  "50": "#fd7e14", // 주황
  "60": "#dc3545", // 빨강
};

const TouristPage = () => {
  const [data, setData] = useState([]);
  const [selectedAge, setSelectedAge] = useState("20"); // 기본 연령대: 20대

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/tourist-data/${selectedAge}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`${selectedAge}대 데이터:`, data);
        setData(data);
      })
      .catch((error) => console.error("API 호출 오류:", error));
  }, [selectedAge]); // 연령대 변경 시 API 호출

  // 차트 데이터 구성
  const chartData = {
    labels: data.map((item) => item["관심지점명"]),
    datasets: [
      {
        label: `${selectedAge}대 인기 관광지`,
        data: data.map((item) => item["비율"]),
        backgroundColor: ageColors[selectedAge], // 연령대별 색상 적용
        borderColor: "#fff",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  return (
    <div className="tourist-dashboard">
      {/* 제목 및 아이콘 */}
      <h2 className="tourist-title">
        <FaChartBar className="icon" style={{ color: ageColors[selectedAge] }} /> 
        전국 인기 관광지 분석
      </h2>

      {/* 연령대 선택 버튼 */}
      <div className="age-group-buttons">
        {["20", "30", "40", "50", "60"].map((age) => (
          <button
            key={age}
            className={`age-btn ${selectedAge === age ? "active" : ""}`}
            onClick={() => setSelectedAge(age)}
            style={{
              backgroundColor: selectedAge === age ? ageColors[age] : "#eee",
              color: selectedAge === age ? "white" : "#333",
            }}
          >
            {age}대
          </button>
        ))}
      </div>

      {/* 관광지 카드 리스트 */}
      <div className="tourist-card-container">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="tourist-card">
              <FaMapMarkerAlt className="card-icon" style={{ color: ageColors[selectedAge] }} />
              <h3>{item["관심지점명"]}</h3>
              <p className="category">
                {item["구분"] === "관광명소" ? <FaStar /> : <FaCameraRetro />}
                {item["구분"]}
              </p>
              <p className="rate">🔥 인기 비율: {item["비율"]}%</p>
            </div>
          ))
        ) : (
          <p className="no-data-message">해당 연령대의 데이터가 없습니다.</p>
        )}
      </div>

      {/* 데이터 차트 */}
      <div className="chart-container">
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default TouristPage;
