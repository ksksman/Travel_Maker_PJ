import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SortOptions from "./SortOptions";
import "./../../styles/Mapstyles/SelectedPlaces.css";

const SelectedPlaces = ({ selectedPlaces, setSelectedPlaces, setMapCenter, showPins, setShowPins }) => {
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
            <SortOptions setSelectedPlaces={setSelectedPlaces} showPins={showPins} setShowPins={setShowPins} />
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="places">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {selectedPlaces.map((place, index) => (
                                <Draggable key={place.id} draggableId={place.id} index={index}>
                                    {(provided) => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                                            className="place-item" onClick={() => setMapCenter({ lat: place.lat, lng: place.lng })}>
                                            <img src={place.imageUrl || "images/default.jpg"} alt={place.name} width="50" height="50" />
                                            <div className="place-info">
                                                <span>{place.name}</span>
                                                <button className="remove-btn" onClick={() => setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id))}>삭제</button>
                                            </div>
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