import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import '../../../App.css';

function QnaPage() {
    const { user } = useAuth(); // 로그인 정보 가져오기
    const [notices, setNotices] = useState([]);
    const [searchType, setSearchType] = useState("title"); // 검색 기준 (기본: 제목)
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
    const [pageNum, setPageNum] = useState(1); // 페이지 번호 상태 추가
    const [totalPageNum, setTotalPageNum] = useState(0);
    
    const navigate = useNavigate();

    // 🔍 질문 게시판 리스트 불러오기 (페이지 로드 시 실행)
    function fetchNotices(page = 1) {
        setPageNum(page);
        fetch(`http://localhost:8586/restBoardList.do?pageNum=${page}&board_cate=2`) // 게시글 데이터 가져오기
            .then((response) => response.json())
            .then((data) => {
                setNotices(data);
            })
            .catch((error) => {
                console.error("질문 게시글 리스트 API 호출 오류:", error);
            });
        // 전체 페이지 갯수 가져오기
        fetch(`http://localhost:8586/boardTotalLength.do?board_cate=2`)
        .then((response) => response.json())
        .then((data) => {
            console.log('data :>> ', data);
            setTotalPageNum(Math.ceil(data.totalCount/10)); // 페이지 개수 계산
        })
        .catch((error) => {
            console.error("전체 게시글 개수 API 호출 오류:", error);
        })
    }

    // 🔎 검색 실행 (검색 버튼 클릭 시 실행)
    function fetchSearchResults() {
        if (!searchKeyword.trim()) {
            alert("검색어를 입력해주세요!");
            fetchNotices(1); // 검색어가 없으면 1페이지부터 다시 불러오기
            return;
        }

        let url = `http://localhost:8586/restBoardSearch.do?pageNum=${pageNum}&searchField=${searchType}&searchWord=${encodeURIComponent(searchKeyword)}&board_cate=2`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setNotices(data);
            })
            .catch((error) => {
                console.error("질문 게시글 검색 API 호출 오류:", error);
            });
    }

    // 🎯 페이지 로드 시 전체 질문 게시글 리스트 불러오기
    useEffect(() => {
        fetchNotices(1);
    }, []);

    // Enter 키로 검색 실행
    function handleKeyPress(e) {
        if (e.key === "Enter") {
            fetchSearchResults();
        }
    }

    // ⏩ 질문게시판 제목 클릭 시 새로고침
    function handleRefresh() {
        window.location.reload();
    }

    // ✅ 글쓰기 버튼 클릭 이벤트 (로그인 확인)
    const handleWriteClick = () => {
        if (user) {
            navigate("/qnaboard/write", { state: { nickname: user.nickname } }); // ✅ 작성자 정보 전달
        } else {
            alert("글쓰기는 로그인 후 이용 가능합니다.");
            navigate("/login"); // ✅ 로그인 페이지로 이동
        }
    };

    return (
        <div className="review-container">
            <h2 className="review-title" onClick={handleRefresh}>
                질문 게시판
            </h2>
            {/* ✅ 글쓰기 버튼 (로그인 여부 확인) */}
            <div className="write-button-container">
                <button className="write-button" onClick={handleWriteClick}>
                    글쓰기 ✏️
                </button>
            </div>
            <table className="review-table">
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>제목</th>
                        <th style={{ width: "15%" }}>작성자</th>
                        <th style={{ width: "10%" }}>조회수</th>
                        <th style={{ width: "20%" }}>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.length > 0 ? (
                        notices.map((data) => (
                            <tr key={data.board_idx}
                                onClick={() => navigate(`/qnaboard/${data.board_idx}`)}
                                className="clickable-row">
                                <td>{data.title}</td>
                                <td>{data.nickname}</td>
                                <td>{data.view_count}</td>
                                <td>{data.post_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-results">게시글이 없습니다.</td>
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

export default QnaPage;
