import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

import '../../../App.css';

function ReviewPage() {
    const { user } = useAuth(); // 로그인 정보 가져오기
    const [myJSON, setMyJSON] = useState([]);
    const [searchType, setSearchType] = useState("title");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [totalPageNum, setTotalPageNum] = useState(0);
    const [isPopular, setIsPopular] = useState(false);
    const [isLikedPosts, setIsLikedPosts] = useState(false); // 좋아요한 게시물 보기 여부
    const [isSearchActivate, setIsSearchActive] = useState(false); // 검색여부 상태

    const navigate = useNavigate();

    // 🔍 게시판 리스트 불러오기
    function fetchReviews(page = 1, popular = false) {
        setPageNum(page);
        setIsPopular(popular);
        setIsSearchActive(false); // 검색여부 초기화

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

        // 전체 페이지 갯수 가져오기
        fetch(`http://localhost:8586/boardTotalLength.do?board_cate=1`)
        .then((response) => response.json())
        .then((data) => {
            console.log('data :>> ', data);
            setTotalPageNum(Math.ceil(data.totalCount/10)); // 페이지 개수 계산
        })
        .catch((error) => {
            console.error("전체 게시글 개수 API 호출 오류:", error);
        })
    }

    // 🔎 좋아요한 게시글 불러오기
    function fetchLikedPosts() {
        if (!user) {
            alert("좋아요한 게시물을 보려면 로그인해야 합니다.");
            return;
        }

        setPageNum(1);
        setIsPopular(false);
        setIsSearchActive(false);
        setIsLikedPosts(true); // ✅ 좋아요한 게시물 보기 활성화

        const url = `http://localhost:8586/likedPosts.do?userId=${user.user_Id}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setMyJSON(data);
            })
            .catch((error) => {
                console.error("좋아요한 게시물 API 호출 오류:", error);
            });
    }

    // 🔎 검색 실행 (검색 버튼 클릭 시 실행)
    function fetchSearchResults() {
        // 전체글 버튼 활성화 (인기글 비활성화) 및 1페이지로 초기화
        setIsPopular(false);
        setPageNum(1);

        if (!searchKeyword.trim()) {
            alert("검색어를 입력해주세요!");
            fetchReviews(1); // 검색어가 없으면 1페이지부터 다시 불러오기
            return;
        }

        const url = `http://localhost:8586/restBoardSearch.do?pageNum=1&searchField=${searchType}&searchWord=${encodeURIComponent(searchKeyword)}&board_cate=1`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setMyJSON(data);
                setIsSearchActive(true); // 검색여부 활성화 상태로 변경
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
                        disabled={isSearchActivate}
                    >
                        인기글
                    </button>
                </div>
                {/* ✅ 좋아요한 게시글 보기 버튼 */}
                <div className="write-button-container">
                    <button
                        className={`liked-posts-button ${isLikedPosts ? "active" : ""}`}
                        onClick={fetchLikedPosts}
                        disabled={isSearchActivate}
                    >
                        좋아요한 게시물
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
                    onClick={() => {
                        const newPage = Math.max(1, pageNum - 5);
                        setPageNum(newPage);
                        fetchReviews(newPage); // 페이지 데이터 불러오기
                    }}
                    disabled={pageNum <= 5} // 첫 번째 그룹이면 비활성화
                >
                    ◀ 이전
                </button>

                {/* 동적으로 페이지 번호 생성 */}
                {Array.from({ length: Math.min(5, totalPageNum - Math.floor((pageNum - 1) / 5) * 5) }, (_, i) => {
                    const pageStart = Math.floor((pageNum - 1) / 5) * 5 + 1;
                    return pageStart + i;
                }).map((page) => (
                    <button
                        key={page}
                        className={`page-number ${page === pageNum ? "active" : ""}`} // 현재 페이지 강조
                        onClick={() => {
                            setPageNum(page);
                            fetchReviews(page);
                        }}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="page-button"
                    onClick={() => {
                        const newPage = Math.min(totalPageNum, pageNum + 5);
                        setPageNum(newPage);
                        fetchReviews(newPage); // 페이지 데이터 불러오기
                    }}
                    disabled={pageNum > totalPageNum} // 마지막 그룹이면 비활성화
                >
                    다음 ▶
                </button>
            </div>

        </div>
    );
}

export default ReviewPage;
