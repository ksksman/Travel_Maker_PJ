// Sidebar.jsx (전체 예시)
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
  plan  // plan 객체
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 동행자 목록을 plan.inviteList로 설정
  const participants = plan.inviteList || [];

  const navigate = useNavigate();

  // 관광지 검색
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

  // "더보기" 버튼 클릭 시
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

  // 이전 페이지로 이동
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="sidebar">
      <div className="top-section">
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          setSearchResults={setSearchResults} 
        />
        <PlanDays plan={plan} />
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
          selectedPlaces={selectedPlaces} 
          setSelectedPlaces={setSelectedPlaces} 
          setMapCenter={setMapCenter} 
          showPins={showPins} 
          setShowPins={setShowPins} 
        />
      </div>

      <div className="sidebar-footer">
        <button className="back-btn" onClick={goBack}> ← 이전페이지</button>

        {/* 참여자 표시 부분 */}
        <span className="participants">
          {participants.length > 0 
            ? `참여자: ${participants.join(", ")}`
            : "초대한 친구가 없습니다."
          }
        </span>

        <div className="footer-buttons">
          <button className="temp-save-btn">임시저장</button>
          <button className="save-btn">저장</button>
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
