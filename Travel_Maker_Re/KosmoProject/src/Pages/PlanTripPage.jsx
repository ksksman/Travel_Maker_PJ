import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Map/Sidebar";
import Map from "../components/Map/Map";
import "../styles/PlanTripPage.css";

const PlanTripPage = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialPlan = location.state || {
    tripId: tripId,
    title: "여행 제목",
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    inviteList: [], // ✅ 동행자 정보 유지
  };

  const [plan, setPlan] = useState(initialPlan);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [showPins, setShowPins] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(plan.startDate);

  // ✅ 1. 여행 정보 가져오기 (동행자 정보 유지)
  const fetchTripData = async () => {
    if (!tripId) return;
    try {
      const response = await fetch(`http://localhost:8586/api/trips/${tripId}`);
      if (!response.ok) throw new Error("여행 정보를 불러올 수 없습니다.");
      const data = await response.json();

      setPlan((prevPlan) => ({
        ...data,
        inviteList: prevPlan?.inviteList || data.inviteList || [], // ✅ 기존 동행자 정보 유지
      }));

      setSelectedDate(data.startDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 2. 일정 가져오기
  const fetchItinerary = async () => {
    if (!tripId) return;
    try {
      const response = await fetch(`http://localhost:8586/api/itinerary/${tripId}`);
      if (!response.ok) throw new Error("관광지 일정을 불러올 수 없습니다.");
      const data = await response.json();

      console.log("🚀 최신 관광지 데이터 불러오기:", data); // ✅ 디버깅용 로그 추가

      const formattedPlaces = data.map((place) => ({
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

  // ✅ 3. useEffect에서 데이터 가져오기
  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  // ✅ 4. 관광지 추가 함수 (추가 후 즉시 반영)
  const onAddPlace = async (place) => {
    if (!selectedDate) {
      alert("날짜를 먼저 선택해주세요.");
      return;
    }

    const currentCount = selectedPlaces.filter((p) => p.date === selectedDate).length;
    const seq = currentCount + 1;

    const newPlace = {
      tripId: tripId,
      itineraryDate: selectedDate,
      placeName: place.name,
      seq: seq,
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

      // ✅ 5. 추가된 데이터 즉시 반영
      setSelectedPlaces((prevPlaces) => [...prevPlaces, { ...newPlace, id: prevPlaces.length + 1 }]);

      // ✅ 6. 최신 일정 다시 불러오기
      fetchItinerary();
    } catch (err) {
      console.error("❌ 관광지 추가 오류:", err);
    }
  };

  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  // ✅ 7. 선택된 날짜에 해당하는 관광지만 필터링
  const filteredPlaces = selectedPlaces.filter((place) => place.date === selectedDate);

  return (
    <div className="plan-trip-container">
      <Sidebar
        plan={plan}
        selectedPlaces={filteredPlaces}
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
