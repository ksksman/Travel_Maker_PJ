import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import "../../styles/Mapstyles/SelectedPlaces.css";

const SelectedPlaces = ({ selectedPlaces, setSelectedPlaces, setMapCenter }) => {
  
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

  // ✅ 드래그앤드롭 완료 시 호출되는 함수 (백엔드에 순서 업데이트 요청 포함)
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    const items = [...selectedPlaces];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    // ✅ itineraryId가 누락되지 않도록 확인
    const updatedPlaces = items.map((place, index) => ({
      id: place.id, // 🔥 ID가 반드시 포함되도록 수정
      seq: index + 1,
      itineraryId: place.itineraryId || place.id, // 🔥 ID가 없으면 기존 ID 사용
      tripId: place.tripId, // 🔥 tripId도 포함
    }));
  
    console.log("🚀 최종적으로 백엔드에 보낼 데이터:", updatedPlaces);
  
    // 🚨 itineraryId가 없는 항목이 있다면 경고 후 API 요청 안 함
    if (updatedPlaces.some(place => !place.itineraryId)) {
      console.error("❌ 오류: itineraryId가 없는 항목이 있습니다!", updatedPlaces);
      alert("❌ 순서 변경 실패: 일정 정보가 올바르지 않습니다.");
      return;
    }
  
    setSelectedPlaces(updatedPlaces);
  
    // 🔥 백엔드 API 요청 (순서 업데이트)
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
                      <span>{place.seq}. {place.name}</span> {/* ✅ 순서 표시 */}
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
