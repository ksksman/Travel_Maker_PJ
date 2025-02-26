import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "../app.css";
import { FaChartBar, FaMapMarkerAlt, FaStar, FaCameraRetro } from "react-icons/fa";

const ageColors = {
  "20": "#007bff",
  "30": "#28a745",
  "40": "#ffc107",
  "50": "#fd7e14",
  "60": "#dc3545",
};

const placeLinks = {
  "여의도한강공원": "https://hangang.seoul.go.kr/www/contents/669.do?mid=473",
  "에버랜드": "https://www.everland.com/everland/home/main",
  "을왕리해수욕장": "http://rwangni-beach.co.kr/",
  "월미도": "http://wolmi-do.co.kr/",
  "반포한강공원": "https://hangang.seoul.go.kr/www/contents/663.do?mid=463",
  "코엑스": "https://www.coex.co.kr/",
  "광안리해수욕장": "https://www.suyeong.go.kr/tour/index.suyeong?menuCd=DOM_000001102001001000&link=success&cpath=%252Ftour/",
  "킨텍스제1전시장": "https://www.kintex.com/",
  "킨텍스제2전시장": "https://www.kintex.com/",
  "롯데월드잠실점": "https://adventure.lotteworld.com/kor/main/index.do",
  "서울대공원": "https://grandpark.seoul.go.kr/",
  "어린이대공원": "https://www.sisul.or.kr/open_content/childrenpark/",
  "국립중앙박물관": "https://www.museum.go.kr/site/main/home",
  "속초해변": "https://www.sokchotour.com/tour/sokcho_beach.php",
  "예술의전당": "https://www.sac.or.kr/",
  "전주한옥마을": "https://hanok.jeonju.go.kr/",
  "인천대공원": "https://www.incheon.go.kr/park/",
  "대명포구": "https://www.visitkorea.or.kr/",
  "궁평항": "https://www.ggtour.or.kr/",
  "강원랜드카지노": "https://www.high1.com/",
  "CGV용산아이파크몰": "http://www.cgv.co.kr/theaters/?theaterCode=0013",
  "뚝섬한강공원": "https://hangang.seoul.go.kr/www/contents/654.do?mid=449",
  "광교호수공원": "https://www.gglakepark.or.kr/",
  "통도사": "https://www.tongdosa.or.kr/",
  "일산호수공원": "https://www.goyang.go.kr/park/index.do"
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
        {/* 이름에만 링크 적용 */}
        <h3>
          <a 
            href={placeLinks[item["관심지점명"]] || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {item["관심지점명"]}
          </a>
        </h3>
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
