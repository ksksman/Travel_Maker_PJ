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
    inviteList: [],
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
        inviteList: prevPlan?.inviteList || data.inviteList || [],
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

      console.log("🚀 최신 관광지 데이터 불러오기:", data);

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

  // ✅ 3. 현재 DB에 저장된 동행자 목록 가져오기
  const fetchParticipants = async () => {
    if (!tripId) return;
    try {
      const response = await fetch(`http://localhost:8586/api/trips/${tripId}/participants`);
      if (!response.ok) throw new Error("동행자 정보를 불러올 수 없습니다.");
      const data = await response.json();
      return data.map((p) => p.userId);
    } catch (err) {
      console.error("❌ 동행자 불러오기 오류:", err);
      return [];
    }
  };

  // ✅ 4. 동행자를 DB에 저장 (중복 방지)
  useEffect(() => {
    if (!plan.tripId || !plan.inviteList || plan.inviteList.length === 0) return;

    const saveParticipants = async () => {
      try {
        const existingParticipants = await fetchParticipants(); // 현재 DB에 있는 동행자 ID 목록

        const newParticipants = plan.inviteList.filter(
          (p) => !existingParticipants.includes(p.userId)
        ); // 기존에 없는 동행자만 필터링

        if (newParticipants.length === 0) return; // 새로 추가할 동행자가 없으면 종료

        const addParticipants = newParticipants.map((participant) =>
          fetch(`http://localhost:8586/api/trips/${plan.tripId}/participants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: participant.userId }),
          })
        );

        await Promise.all(addParticipants);
        console.log("✅ 중복 없이 새로운 동행자 정보가 저장되었습니다.");
      } catch (err) {
        console.error("❌ 동행자 저장 오류:", err);
      }
    };

    saveParticipants();
  }, [plan.tripId, plan.inviteList]);

  // ✅ 5. 관광지 추가 함수
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

      setSelectedPlaces((prevPlaces) => [...prevPlaces, { ...newPlace, id: prevPlaces.length + 1 }]);

      fetchItinerary();
    } catch (err) {
      console.error("❌ 관광지 추가 오류:", err);
    }
  };

  useEffect(() => {
    fetchTripData();
    fetchItinerary();
  }, [tripId]);

  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

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
