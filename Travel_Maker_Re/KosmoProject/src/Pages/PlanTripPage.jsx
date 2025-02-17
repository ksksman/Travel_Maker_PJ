import React, { useState } from "react";
import Sidebar from "../components/Map/Sidebar";
import Map from "../components/Map/Map";
import "../styles/PlanTripPage.css";  // ✅ CSS 파일이 정상적으로 존재하는지 확인

const PlanTripPage = () => {
    const [selectedPlaces, setSelectedPlaces] = useState([]); // 선택된 명소 리스트
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본 지도 중심 (서울)
    const [showPins, setShowPins] = useState(true); // 핀 표시 여부

    // 🏷️ 관광지를 추가하는 함수 (중복 방지 + 지도 이동)
    const onAddPlace = (place) => {
        if (!selectedPlaces.some((p) => p.id === place.id)) {
            setSelectedPlaces([...selectedPlaces, place]); // 중복 방지 후 추가
            setMapCenter({ lat: place.lat, lng: place.lng }); // 지도 이동
        }
    };

    return (
        <div className="plan-trip-container">  {/* ✅ 스타일 변경 */}
            <Sidebar 
                selectedPlaces={selectedPlaces} 
                setSelectedPlaces={setSelectedPlaces}
                onAddPlace={onAddPlace}
                setMapCenter={setMapCenter}
                showPins={showPins}
                setShowPins={setShowPins}
            />
            <div className="map-wrapper">
                <Map selectedPlaces={selectedPlaces} mapCenter={mapCenter} showPins={showPins} />
            </div>
        </div>
    );
};

export default PlanTripPage;
