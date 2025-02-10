import React, { useEffect, useState } from "react";
import '../../../App.css';

function ReviewPage() {
    const [myJSON, setMyJSON] = useState([]);
    const [searchType, setSearchType] = useState("title"); // 검색 기준 (기본: 제목)
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드

    // 🔍 기본 게시판 리스트 불러오기 (페이지 로드 시 실행)
    function fetchReviews() {
        fetch("http://localhost:8586/restBoardList.do?pageNum=1") // 기본 리스트 API
            .then((response) => response.json())
            .then((data) => {
                setMyJSON(data);
            })
            .catch((error) => {
                console.error("게시판 리스트 API 호출 오류:", error);
            });
    }

    // 🔎 검색 실행 (검색 버튼 클릭 시 실행)
    function fetchSearchResults() {
        if (!searchKeyword.trim()) {
            alert("검색어를 입력해주세요!");
            fetchReviews(); // 검색어가 없으면 전체 리스트 다시 불러오기
            return;
        }

        let url = `http://localhost:8586/restBoardSearch.do?searchField=${searchType}&searchWord=${encodeURIComponent(searchKeyword)}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setMyJSON(data);
            })
            .catch((error) => {
                console.error("검색 API 호출 오류:", error);
            });
    }

    // 🎯 페이지 로드 시 전체 게시글 리스트 불러오기
    useEffect(function () {
        fetchReviews();
    }, []);

    // Enter 키로 검색 실행
    function handleKeyPress(e) {
        if (e.key === "Enter") {
            fetchSearchResults();
        }
    }

    // ⏩ 후기 게시판 클릭 시 새로고침
    function handleRefresh() {
        window.location.reload(); // 페이지 새로고침
    }

    return (
        <div className="review-container">
            <h2 className="review-title"
                onClick={handleRefresh}>후기 게시판</h2>

            <table className="review-table">
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>제목</th>
                        <th style={{ width: "15%" }}>작성자</th>
                        <th style={{ width: "12%" }}>조회수</th>
                        <th style={{ width: "12%" }}>좋아요</th>
                        <th style={{ width: "20%" }}>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {myJSON.length > 0 ? (
                        myJSON.map((data) => (
                            <tr key={data.review_id}>
                                <td>{data.title}</td>
                                <td>{data.nickname}</td>
                                <td>{data.view_count}</td>
                                <td>{data.like_count}</td>
                                <td>{data.post_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-results">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* 🔎 검색 필터 */}
            <div className="search-container"
                style={{paddingTop:20}}>
                <select
                    className="search-select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ width: "15%" }}
                >
                    <option value="title">제목</option>
                    <option value="nickname">작성자</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어 입력"
                    className="search-input"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleKeyPress} // Enter 키 이벤트
                />
                <button className="search-button" onClick={fetchSearchResults}>
                    🔍 검색
                </button>
            </div>
        </div>
    );
}

export default ReviewPage;
