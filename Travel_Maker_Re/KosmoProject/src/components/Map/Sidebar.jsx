import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import SearchBar from "./SearchBar";
import PlaceList from "./PlaceList";
import SelectedPlaces from "./SelectedPlaces";
import PlaceDetailPopup from "./PlaceDetailPopup";
import PlanDays from "./PlanDays";
import "../../styles/Mapstyles/Sidebar.css";
import axios from "axios";

const Sidebar = ({ selectedPlaces, setSelectedPlaces, onAddPlace, setMapCenter, showPins, setShowPins }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
    const [pageNo, setPageNo] = useState(1); // 페이지 번호 추가
    const [hasMore, setHasMore] = useState(true); // 더보기 버튼 상태 추가
    const [plan, setPlan] = useState({ title: "서울나들이", startDate: "2024-03-09", endDate: "2024-03-12" });
    const participants = ["aaa", "bbb", "ccc", "ddd"]; // 참여자 정보 (최대 4명)

    const navigate = useNavigate();  // 네비게이션 훅 사용

    //  관광지 검색
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

    //  "더보기" 버튼을 눌렀을 때 추가 데이터 불러오기
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

    //  이전 페이지 이동 함수
    const goBack = () => {
        navigate(-1);  // 이전 페이지로 이동
    };

    return (
        <div className="sidebar">
            <div className="top-section"> {/*  검색창과 PlanDays를 정렬 */}
                <SearchBar query={query} setQuery={setQuery} setSearchResults={setSearchResults} />
                <PlanDays plan={plan} />
            </div>

            <div className="sidebar-footer">
                {/*  이전 페이지 버튼 클릭 시 이전 페이지로 이동 */}
                <button className="back-btn" onClick={goBack}> ← 이전페이지</button>

                <span className="participants">
                    참여자: {participants.join(", ")}
                </span>

                <div className="footer-buttons">
                    <button className="temp-save-btn">임시저장</button>
                    <button className="save-btn">저장</button>
                </div>
            </div>
            
            <div className="results-container">
                <PlaceList 
                    searchResults={searchResults} 
                    onAddPlace={onAddPlace} 
                    setSelectedPlaceDetail={setSelectedPlaceDetail} 
                    hasMore={hasMore}  // hasMore 상태 전달
                    onLoadMore={loadMore} // loadMore 함수 전달
                />

                <SelectedPlaces 
                    selectedPlaces={selectedPlaces} 
                    setSelectedPlaces={setSelectedPlaces} 
                    setMapCenter={setMapCenter} 
                    showPins={showPins} 
                    setShowPins={setShowPins} 
                />
            </div>

            {selectedPlaceDetail && <PlaceDetailPopup place={selectedPlaceDetail} setSelectedPlaceDetail={setSelectedPlaceDetail} />}
        </div>
    );
};

export default Sidebar;
