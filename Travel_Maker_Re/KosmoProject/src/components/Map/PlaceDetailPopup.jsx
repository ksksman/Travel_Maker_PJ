import React from "react";
import "../../styles/Mapstyles/PlaceDetailPopup.css";

const PlaceDetailPopup = ({ place, setSelectedPlaceDetail }) => {
    return (
        <div className="detail-popup">
            <h3>{place.name}</h3>
            <p><strong>📍 주소:</strong> {place.address}</p>
            <p><strong>📝 개요:</strong> {place.description || "설명 없음"}</p>
            <button className="close-btn" onClick={() => setSelectedPlaceDetail(null)}>닫기</button>
        </div>
    );
};

export default PlaceDetailPopup;
