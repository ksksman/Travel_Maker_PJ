import React, { useEffect, useRef } from "react";

const Map = ({ selectedPlaces, mapCenter, showPins }) => {
    const mapRef = useRef(null); // ✅ 지도 객체를 유지하기 위한 ref

    useEffect(() => {
        if (!mapRef.current) {
            //  초기 지도 생성 (한 번만 실행)
            mapRef.current = new window.naver.maps.Map("map", {
                center: new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
                zoom: 13
            });
        } else {
            //  지도 중심 변경 시 이동
            mapRef.current.setCenter(new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng));
        }
    }, [mapCenter]); //  mapCenter 변경 시에만 지도 이동

    useEffect(() => {
        if (!mapRef.current) return;

        // 기존 마커 초기화
        mapRef.current?.overlays?.forEach((marker) => marker.setMap(null));
        mapRef.current.overlays = [];

        if (showPins) {
            selectedPlaces.forEach(place => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(place.lat, place.lng),
                    map: mapRef.current
                });

                //  마커 위에 호버하면 툴팁(인포윈도우) 표시
                const infoWindow = new window.naver.maps.InfoWindow({
                    content: `<div style="padding:5px; font-size:14px;">${place.name}</div>`,
                });

                window.naver.maps.Event.addListener(marker, "mouseover", () => {
                    infoWindow.open(mapRef.current, marker);
                });

                window.naver.maps.Event.addListener(marker, "mouseout", () => {
                    infoWindow.close();
                });

                mapRef.current.overlays.push(marker);
            });
        }
    }, [selectedPlaces, showPins]); //  핀 보이기/숨기기 시 지도 중심 변경 없음

    return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default Map;
