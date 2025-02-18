// PlanTripPage.jsx (전체 예시)
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Map/Sidebar";
import Map from "../components/Map/Map";
import "../styles/PlanTripPage.css";

const PlanTripPage = () => {
  const location = useLocation();
  // CreateTripPage에서 전달된 plan 객체 (inviteList 포함)
  const { plan } = location.state || {
    plan: { 
      title: "여행 제목", 
      startDate: "2024-01-01", 
      endDate: "2024-01-05",
      inviteList: []
    },
  };

  const [selectedPlaces, setSelectedPlaces] = useState([]); 
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); 
  const [showPins, setShowPins] = useState(true); 

  const onAddPlace = (place) => {
    if (!selectedPlaces.some((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
      setMapCenter({ lat: place.lat, lng: place.lng });
    }
  };

  return (
    <div className="plan-trip-container">
      <Sidebar
        plan={plan}  // plan 객체 전달 (inviteList 포함)
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
        onAddPlace={onAddPlace}
        setMapCenter={setMapCenter}
        showPins={showPins}
        setShowPins={setShowPins}
      />
      <div className="map-wrapper">
        <Map 
          selectedPlaces={selectedPlaces} 
          mapCenter={mapCenter} 
          showPins={showPins} 
        />
      </div>
    </div>
  );
};

export default PlanTripPage;
