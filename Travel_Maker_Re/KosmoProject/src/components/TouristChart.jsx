import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const ageGroups = ["20", "30", "40", "50", "60"];

// 연령대별 색상 지정
const ageColors = {
    "20": "rgba(54, 162, 235, 0.6)", // 파란색
    "30": "rgba(255, 99, 132, 0.6)", // 빨간색
    "40": "rgba(255, 206, 86, 0.6)", // 노란색
    "50": "rgba(75, 192, 192, 0.6)", // 청록색
    "60": "rgba(153, 102, 255, 0.6)", // 보라색
};

const TouristChart = () => {
    const [chartData, setChartData] = useState(null);
    const [selectedAge, setSelectedAge] = useState("20"); // 기본값: 20대

    useEffect(() => {
        const apiUrl = `http://127.0.0.1:5000/api/tourist-data/${selectedAge}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log(`📊 ${selectedAge}대 데이터:`, data);

                if (!data || data.length === 0) {
                    setChartData(null);
                    return;
                }

                const labels = data.map(item => item["관심지점명"]);  // ✅ 관광지 이름 추출
                const values = data.map(item => item["비율"]);  // ✅ 비율 데이터 추출

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${selectedAge}대 인기 관광지`,
                            data: values,
                            backgroundColor: ageColors[selectedAge], // ✅ 연령대별 색상 적용
                        },
                    ],
                });
            })
            .catch(error => console.error("데이터 가져오기 오류:", error));
    }, [selectedAge]); // ✅ selectedAge 변경될 때마다 API 호출

    return (
        <div style={{ textAlign: "center", padding: "20px", background: "#eef5ff", borderRadius: "10px" }}>
            <h3>연령별 인기 관광지</h3>
            <div style={{ marginBottom: "10px" }}>
                {ageGroups.map(age => (
                    <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        style={{
                            margin: "5px",
                            padding: "8px 12px",
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: selectedAge === age ? "#007bff" : "#ccc",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        {age}대
                    </button>
                ))}
            </div>
            {chartData ? (
                <div style={{ width: "100%", height: "300px" }}>
                    <Bar data={chartData} options={{ responsive: true }} />
                </div>
            ) : (
                <p>데이터를 불러오는 중...</p>
            )}
        </div>
    );
};

export default TouristChart;
