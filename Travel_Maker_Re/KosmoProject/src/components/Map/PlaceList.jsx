import React from "react";
import axios from "axios";
import "../../styles/Mapstyles/PlaceList.css";

const PlaceList = ({ searchResults, onAddPlace, setSelectedPlaceDetail, hasMore, onLoadMore }) => {
    //  관광지 클릭 시 개요 데이터 가져오기
    const handlePlaceClick = async (place) => {
        try {
            const response = await axios.get("http://localhost:8586/api/places/overview", {
                params: { contentId: place.id }
            });

            const overviewData = response.data || "설명 없음";
            setSelectedPlaceDetail({
                ...place,
                description: overviewData
            });

        } catch (error) {
            console.error("개요 가져오기 오류:", error);
            setSelectedPlaceDetail({
                ...place,
                description: "설명 없음"
            });
        }
    };

    return (
        <div className="search-results">
            <h3>🔍 검색 결과</h3>
            {searchResults.length === 0 ? (
                <p className="no-results">검색 결과가 없습니다.</p>
            ) : (
                <>
                    <ul>
                        {searchResults.map((place) => (
                            <li key={place.id} className="place-item">
                                <img src={place.imageUrl || "images/default.jpg"} alt={place.name} width="50" height="50" />
                                <div className="place-info">
                                    <span onClick={() => handlePlaceClick(place)}>{place.name}</span>
                                    <button className="add-btn" onClick={() => onAddPlace(place)}>추가</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    {/*  "더보기" 버튼 추가 */}
                    {hasMore && (
                        <button className="load-more" onClick={onLoadMore}>더보기</button>
                    )}
                </>
            )}
        </div>
    );
};

export default PlaceList;
