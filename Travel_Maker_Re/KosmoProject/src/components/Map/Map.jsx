import React, { useEffect, useRef } from "react"; 

const Map = ({ selectedPlaces, mapCenter, showPins }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]); //  마커를 저장할 배열 추가

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = new window.naver.maps.Map("map", {
                center: new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
                zoom: 13
            });
        } else {
            mapRef.current.setCenter(new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng));
        }
    }, [mapCenter]);

    useEffect(() => {
        if (!mapRef.current) return;

        //  기존 마커 삭제 (안전한 방식으로 마커를 초기화)
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        if (showPins) {
            selectedPlaces.forEach(place => {
                // 🚨 좌표가 없는 경우 마커 표시 안함
                if (!place.lat || !place.lng) {
                    console.warn(`좌표가 없는 관광지: ${place.name}`, place);
                    return; 
                }

                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(place.lat, place.lng),
                    map: mapRef.current
                });

                const infoWindow = new window.naver.maps.InfoWindow({
                    content: `<div style="padding:5px; font-size:14px;">${place.name}</div>`,
                });

                window.naver.maps.Event.addListener(marker, "mouseover", () => {
                    infoWindow.open(mapRef.current, marker);
                });

                window.naver.maps.Event.addListener(marker, "mouseout", () => {
                    infoWindow.close();
                });

                markersRef.current.push(marker); // ✅마커 배열에 추가
            });
        }
    }, [selectedPlaces, showPins]);

    return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default Map;
