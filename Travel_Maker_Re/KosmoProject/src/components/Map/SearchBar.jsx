import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동을 위한 useNavigate 추가
import axios from "axios";
import "../../styles/Mapstyles/SearchBar.css";

const SearchBar = ({ query, setQuery, setSearchResults }) => {
    const navigate = useNavigate(); // ✅ 네비게이션 훅 사용

    const handleSearch = async () => {
        if (!query.trim()) {
            console.error("검색어를 입력하세요.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8586/api/places/search", {
                params: { query, pageNo: 1, numOfRows: 10 }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("검색 오류:", error);
        }
    };

    const handleLogoClick = () => {
        navigate("/"); //원하는 경로로 변경 가능
    };

    return (
        <div className="search-section">
            {/* 로고 클릭 시 메인으로 이동 */}
            <div className="logo-container" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                <img src="/map_logo.png" alt="로고" className="logo" />
            </div>

            {/*  검색창 + 버튼 */}
            <div className="search-box">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="관광지 검색" 
                />
                <button onClick={handleSearch}>검색</button>
            </div>
        </div>
    );
};

export default SearchBar;
