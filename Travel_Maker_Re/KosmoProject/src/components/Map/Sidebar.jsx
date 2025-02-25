import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import SearchBar from "./SearchBar";
import PlaceList from "./PlaceList";
import SelectedPlaces from "./SelectedPlaces";
import PlaceDetailPopup from "./PlaceDetailPopup";
import PlanDays from "./PlanDays";
import "../../styles/Mapstyles/Sidebar.css";
import axios from "axios";

const Sidebar = ({
  selectedPlaces,
  setSelectedPlaces,
  onAddPlace,
  setMapCenter,
  showPins,
  setShowPins,
  plan,
  selectedDate,
  setSelectedDate
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const participants = plan.inviteList || [];
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      console.error("검색어를 입력하세요.");
      return;
    }
    setPageNo(1);
    setSearchResults([]);
    try {
      const response = await axios.get("http://localhost:8586/api/places/search", {
        params: { query, pageNo: 1, numOfRows: 10 }
      });
      setSearchResults(response.data);
      setHasMore(response.data.length === 10);
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = pageNo + 1;
      const response = await axios.get("http://localhost:8586/api/places/search", {
        params: { query, pageNo: nextPage, numOfRows: 10 }
      });
      if (response.data.length > 0) {
        setSearchResults((prevResults) => [...prevResults, ...response.data]);
        setPageNo(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("더보기 오류:", error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    const confirmed = window.confirm("저장하시겠습니까? 상세보기 페이지로 이동됩니다.");
    if (confirmed) {
      navigate(`/trips/${plan.tripId}`);
    }
  };

  return (
    <div className="sidebar">
      <div className="top-section">
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          setSearchResults={setSearchResults} 
        />
        <PlanDays 
          plan={plan} 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
        />
      </div>
      <div className="results-container">
        <PlaceList 
          searchResults={searchResults} 
          onAddPlace={onAddPlace} 
          setSelectedPlaceDetail={setSelectedPlaceDetail} 
          hasMore={hasMore} 
          onLoadMore={loadMore} 
        />
        <SelectedPlaces 
          selectedPlaces={selectedPlaces.filter(place => place.date === selectedDate)}
          setSelectedPlaces={setSelectedPlaces} 
          setMapCenter={setMapCenter} 
          showPins={showPins} 
          setShowPins={setShowPins} 
        />
      </div>
      <div className="sidebar-footer">
        <button className="back-btn" onClick={goBack}> ← 이전페이지</button>
        <span className="participants">
          {participants.length > 0
            ? `참여자: ${participants.map(p => p.nickname).join(", ")}`
            : "초대한 친구가 없습니다."
          }
        </span>
        <div className="footer-buttons">
          <button className="save-btn" onClick={handleSave}>저장</button>
        </div>
      </div>
      {selectedPlaceDetail && (
        <PlaceDetailPopup 
          place={selectedPlaceDetail} 
          setSelectedPlaceDetail={setSelectedPlaceDetail} 
        />
      )}
    </div>
  );
};

export default Sidebar;
