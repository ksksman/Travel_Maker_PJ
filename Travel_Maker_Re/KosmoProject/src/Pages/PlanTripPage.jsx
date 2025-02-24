import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Sidebar from "../components/Map/Sidebar";
import Map from "../components/Map/Map";
import "../styles/PlanTripPage.css";

const PlanTripPage = () => {
  const { tripId } = useParams();
  const location = useLocation();

  //  여행 정보 상태
  const [plan, setPlan] = useState({
    title: "여행 제목",
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    inviteList: [],
  });

  //  관광지 및 지도 상태
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [showPins, setShowPins] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  선택된 날짜 상태 추가
  const [selectedDate, setSelectedDate] = useState(null);

  //  여행 정보 가져오기
  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;

      try {
        const response = await fetch(`http://localhost:8586/api/trips/${tripId}`);
        if (!response.ok) throw new Error("여행 정보를 불러올 수 없습니다.");

        const data = await response.json();
        setPlan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  // 🔹 관광지 일정 가져오기
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!tripId) return;

      try {
        const response = await fetch(`http://localhost:8586/api/itinerary/${tripId}`);
        if (!response.ok) throw new Error("관광지 일정을 불러올 수 없습니다.");

        const data = await response.json();

        const formattedPlaces = data
          .filter((place) => place.lat !== null && place.lng !== null) //  좌표 없는 일정 제외
          .map((place) => ({
            id: place.itineraryId,
            name: place.placeName,
            lat: place.lat,
            lng: place.lng,
            date: place.itineraryDate,
            seq: place.seq,
          }));

        setSelectedPlaces(formattedPlaces);
      } catch (err) {
        console.error("❌ 관광지 일정 로드 오류:", err);
      }
    };

    fetchItinerary();
  }, [tripId]);

  // ✅ 선택된 날짜에 해당하는 관광지 필터링
  const filteredPlaces = selectedPlaces.filter((place) => place.date === selectedDate);

  // 🔹 관광지 추가
  // 🔹 관광지 추가 함수 (중복 체크 추가)
  const onAddPlace = async (place) => {
    if (!selectedDate) {
      alert("날짜를 먼저 선택해주세요.");
      return;
    }
  
    console.log("선택된 날짜:", selectedDate);
    console.log("📌 추가할 관광지 데이터:", place);
  
    const newPlace = {
      tripId: tripId,
      itineraryDate: selectedDate,
      placeName: place.name,
      seq: selectedPlaces.length + 1,
      contentId: place.id || place.contentId,
      lat: place.lat,
      lng: place.lng,
    };
  
    try {
      const response = await fetch("http://localhost:8586/api/itinerary/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace),
      });
  
      if (response.status === 409) {
        alert("⚠ 이미 추가된 관광지입니다.");
        return;
      }
  
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(`⚠ ${errorMessage}`);
        throw new Error(errorMessage);
      }
  
      console.log(" 추가된 일정:", newPlace);
      setSelectedPlaces([...selectedPlaces, { ...newPlace, id: selectedPlaces.length + 1 }]);
      setMapCenter({ lat: newPlace.lat, lng: newPlace.lng });
  
    } catch (err) {
      console.error("❌ 관광지 추가 오류:", err);
    }
  };
  

  
  
  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  return (
    <div className="plan-trip-container">
      <Sidebar
        plan={plan}
        selectedPlaces={filteredPlaces} // 선택된 날짜의 관광지만 표시
        setSelectedPlaces={setSelectedPlaces}
        onAddPlace={onAddPlace}
        setMapCenter={setMapCenter}
        showPins={showPins}
        setShowPins={setShowPins}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="map-wrapper">
        <Map selectedPlaces={filteredPlaces} mapCenter={mapCenter} showPins={showPins} />
      </div>
    </div>
  );
};

export default PlanTripPage;
