import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

import '../../../App.css';

function ReviewPage() {
    const { user } = useAuth(); // 로그인 정보 가져오기
    const [myJSON, setMyJSON] = useState([]);
    const [searchType, setSearchType] = useState("title");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [isPopular, setIsPopular] = useState(false);

    const navigate = useNavigate();

    // ✅ 로그인 상태 확인 로그
    // useEffect(() => {
    //     console.log("현재 Context에 저장된 로그인 정보:", user);
    // }, [user]);

    // 🔍 게시판 리스트 불러오기
    function fetchReviews(page = 1, popular = false) {
        setPageNum(page);
        setIsPopular(popular);

        const url = popular
            ? `http://localhost:8586/popularReviews.do?pageNum=${page}&board_cate=1`
            : `http://localhost:8586/restBoardList.do?pageNum=${page}&board_cate=1`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log('API 요청 URL:', url);
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
            fetchReviews(1); // 검색어가 없으면 1페이지부터 다시 불러오기
            return;
        }

        let url = `http://localhost:8586/restBoardSearch.do?pageNum=${pageNum}&searchField=${searchType}&searchWord=${encodeURIComponent(searchKeyword)}&board_cate=1`;

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
    useEffect(() => {
        fetchReviews(1);
    }, []);

    // Enter 키로 검색 실행
    function handleKeyPress(e) {
        if (e.key === "Enter") {
            fetchSearchResults();
        }
    }
    // ✅ 글쓰기 버튼 클릭 이벤트 (로그인 확인)
    const handleWriteClick = () => {
        if (user) {
            navigate("/reviewboard/write", { state: { nickname: user.nickname } }); // ✅ 작성자 정보 전달
        } else {
            alert("글쓰기는 로그인 후 이용 가능합니다.");
            navigate("/login"); // ✅ 로그인 페이지로 이동
        }
    };

    return (
        <div className="review-container">
            <h2 className="review-title" onClick={() => window.location.reload()}>
                후기 게시판
            </h2>
            <div className="review-upper-container">
                {/* ✅ 전체글 / 인기글 버튼 */}
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${!isPopular ? "active" : ""}`}
                        onClick={() => fetchReviews(1, false)}
                    >
                        전체글
                    </button>
                    <button
                        className={`filter-button ${isPopular ? "active" : ""}`}
                        onClick={() => fetchReviews(1, true)}
                    >
                        인기글
                    </button>
                </div>
                {/* ✅ 글쓰기 버튼 (로그인 여부 확인) */}
                <div className="write-button-container">
                    <button className="write-button" onClick={handleWriteClick}>
                        글쓰기 ✏️
                    </button>
                </div>
            </div>
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
                            <tr key={data.board_idx} onClick={() => navigate(`/reviewboard/${data.board_idx}`)} className="clickable-row">
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
            <div className="search-wrapper">
                <select
                    className="search-select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
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
                    onKeyPress={handleKeyPress}
                />
                <button className="search-button" onClick={fetchSearchResults}>
                    🔍 검색
                </button>
            </div>


            {/* ✅ 페이지네이션 버튼 추가 */}
            <div className="pagination-container">
                <button
                    className="page-button"
                    onClick={() => fetchReviews(pageNum - 1)}
                    disabled={pageNum <= 1} // 1페이지에서는 비활성화
                >
                    ◀ 이전
                </button>
                <span className="page-number">페이지 {pageNum}</span>
                <button
                    className="page-button"
                    onClick={() => fetchReviews(pageNum + 1)}
                    disabled={myJSON.length < 10} // 데이터가 10개 미만이면 다음 페이지 없음
                >
                    다음 ▶
                </button>
            </div>
        </div>
    );
}

export default ReviewPage;
