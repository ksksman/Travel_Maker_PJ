import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import SortOptions from "./SortOptions"; // ✅ 정렬, 삭제, 핀 기능 가져오기
import "../../styles/Mapstyles/SelectedPlaces.css";

const SelectedPlaces = ({ selectedPlaces, setSelectedPlaces, setMapCenter, showPins, setShowPins }) => {
  
  // ✅ 정렬 전 원래 순서를 저장하는 상태
  const [originalPlaces, setOriginalPlaces] = useState([]);

  // ✅ SortOptions에서 기능 가져오기
  const { sortByDistance, handleRemoveAll, togglePins } = SortOptions({ selectedPlaces, setSelectedPlaces, showPins, setShowPins });

  // 🔥 관광지 삭제 요청 (백엔드 API 호출)
  const handleDelete = async (itineraryId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await axios.delete(`http://localhost:8586/api/itinerary/delete/${itineraryId}`);

      if (response.status === 200) {
        alert("관광지가 삭제되었습니다.");
        setSelectedPlaces((prevPlaces) => prevPlaces.filter(place => place.id !== itineraryId));
      }
    } catch (error) {
      console.error("❌ 관광지 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 거리순 정렬 & 원래 순서 복구 기능
  const toggleSortByDistance = () => {
    if (originalPlaces.length === 0) {
      // 🌟 정렬하기 전에 원래 배열 저장
      setOriginalPlaces([...selectedPlaces]);
      sortByDistance();
    } else {
      // 🌟 원래 순서로 복구
      setSelectedPlaces([...originalPlaces]);
      setOriginalPlaces([]); // ✅ 초기화하여 다시 정렬 가능하도록 설정
    }
  };

  // ✅ 드래그앤드롭 완료 시 호출되는 함수 (백엔드에 순서 업데이트 요청 포함)
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    const items = [...selectedPlaces];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    const updatedPlaces = items.map((place, index) => ({
      id: place.id,
      seq: index + 1,
      itineraryId: place.itineraryId || place.id,
      tripId: place.tripId,
    }));
  
    console.log("🚀 최종적으로 백엔드에 보낼 데이터:", updatedPlaces);
  
    setSelectedPlaces(updatedPlaces);
  
    try {
      const response = await axios.put("http://localhost:8586/api/itinerary/updateOrder", updatedPlaces);
      if (response.status === 200) {
        console.log("✅ 관광지 순서 업데이트 완료");
      }
    } catch (error) {
      console.error("❌ 순서 업데이트 실패:", error);
      alert("순서 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="selected-places">
      <h3>📍 선택된 관광지</h3>

      {/* ✅ 버튼 UI 추가 (거리순 정렬 토글 기능) */}
      <div className="sort-options">
        <button className="sort-btn" onClick={toggleSortByDistance}>
          {originalPlaces.length === 0 ? "거리순 정렬" : "원래 순서로"}
        </button>
        <button className="pin-toggle-btn" onClick={togglePins}>
          {showPins ? "핀 숨기기" : "핀 보이기"}
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="places">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {selectedPlaces.map((place, index) => (
                <Draggable key={place.id} draggableId={place.id.toString()} index={index}>
                  {(provided) => (
                    <li 
                      ref={provided.innerRef} 
                      {...provided.draggableProps} 
                      {...provided.dragHandleProps} 
                      className="place-item" 
                      onClick={() => setMapCenter({ lat: place.lat, lng: place.lng })}
                    >
                      <span>{place.seq}. {place.name}</span>
                      <button className="delete-btn" onClick={() => handleDelete(place.id)}>🗑️ 삭제</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SelectedPlaces;
