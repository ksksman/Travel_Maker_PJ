import React from "react";
import "../../styles/Mapstyles/SortOptions.css";

const SortOptions = ({ selectedPlaces, setSelectedPlaces, showPins, setShowPins }) => {
    // 📍 거리순 정렬 함수 (지도 이동 없음)
    const sortByDistance = () => {
        setSelectedPlaces((prevPlaces) => {
            if (prevPlaces.length < 2) return prevPlaces;

            return [...prevPlaces].sort((a, b) => {
                const distanceA = getDistance(prevPlaces[0].lat, prevPlaces[0].lng, a.lat, a.lng);
                const distanceB = getDistance(prevPlaces[0].lat, prevPlaces[0].lng, b.lat, b.lng);
                return distanceA - distanceB;
            });
        });
    };

    // 📌 두 지점 간의 직선 거리 계산 함수
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구 반지름 (km)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 📌 모든 관광지 삭제 (지도 이동 없음)
    const handleRemoveAll = () => {
        if (window.confirm("정말 모든 관광지를 삭제하시겠습니까?")) {
            setSelectedPlaces([]);
        }
    };

    // 📍 핀 보이기/숨기기 토글 (지도 이동 없음)
    const togglePins = () => {
        setShowPins((prev) => !prev);
    };

    return { sortByDistance, handleRemoveAll, togglePins };;
};

export default SortOptions;
