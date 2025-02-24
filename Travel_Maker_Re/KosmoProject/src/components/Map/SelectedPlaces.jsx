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
        
        // UI에서도 삭제 (새로운 배열 생성)
        setSelectedPlaces((prevPlaces) => prevPlaces.filter(place => place.id !== itineraryId));
      }
    } catch (error) {
      console.error("❌ 관광지 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  //  드래그앤드롭을 위한 함수
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedPlaces);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedPlaces(items);
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
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                        className="place-item" onClick={() => setMapCenter({ lat: place.lat, lng: place.lng })}>
                      <span>{place.name}</span>
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
