import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Map/Sidebar";
import Map from "../components/Map/Map";
import "../styles/PlanTripPage.css";

const PlanTripPage = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 여행 정보(초대된 친구 목록 포함)를 그대로 사용
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

  // 여행 정보 가져오기 (inviteList는 location.state에 전달된 값 유지)
  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;
      try {
        const response = await fetch(`http://localhost:8586/api/trips/${tripId}`);
        if (!response.ok) throw new Error("여행 정보를 불러올 수 없습니다.");
        const data = await response.json();
        setPlan((prevPlan) => ({
          ...data,
          inviteList: prevPlan.inviteList || []
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTripData();
  }, [tripId, location.state]);

  // 관광지 일정 가져오기
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!tripId) return;
      try {
        const response = await fetch(`http://localhost:8586/api/itinerary/${tripId}`);
        if (!response.ok) throw new Error("관광지 일정을 불러올 수 없습니다.");
        const data = await response.json();
        const formattedPlaces = data
          .filter((place) => place.lat !== null && place.lng !== null)
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
        console.error("관광지 일정 로드 오류:", err);
      }
    };
    fetchItinerary();
  }, [tripId]);

  // 선택된 날짜에 해당하는 관광지 필터링
  const filteredPlaces = selectedPlaces.filter((place) => place.date === selectedDate);

  // 여기서 초대된 친구들을 대상으로 동행자 추가 API를 호출해 DB에 저장
  useEffect(() => {
    // plan.inviteList는 초대된 친구 목록 (예: [{ nickname, userId }, ...])
    if (plan.tripId && plan.inviteList && plan.inviteList.length > 0) {
      plan.inviteList.forEach((friendObj) => {
        fetch(`http://localhost:8586/api/trips/${plan.tripId}/participants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: friendObj.userId })
        })
          .then((res) => {
            if (!res.ok) {
              console.error("동행자 추가 API 실패:", res.status);
            }
            return res.json();
          })
          .then((data) => {
            console.log("동행자 추가 완료:", data.message);
          })
          .catch((err) => console.error("동행자 추가 오류:", err));
      });
    }
  }, [plan.tripId, plan.inviteList]);

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
        alert("이미 추가된 관광지입니다.");
        return;
      }
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        throw new Error(errorMessage);
      }
      setSelectedPlaces([...selectedPlaces, { ...newPlace, id: selectedPlaces.length + 1 }]);
      setMapCenter({ lat: newPlace.lat, lng: newPlace.lng });
    } catch (err) {
      console.error("관광지 추가 오류:", err);
    }
  };

  const handleSaveSchedules = () => {
    navigate(`/trips/${tripId}`);
  };

  if (loading) return <p>여행 정보를 불러오는 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

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
