import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import '../../../App.css';

function ReviewPage() {
    const { user, logout, loading } = useAuth(); // ✅ Context에서 로그인 정보 가져오기
    const [myJSON, setMyJSON] = useState([]);
    const [searchType, setSearchType] = useState("title");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [isPopular, setIsPopular] = useState(false);

    const navigate = useNavigate();

    // ✅ 로그인 상태 확인 로그
    useEffect(() => {
        console.log("현재 Context에 저장된 로그인 정보:", user);
    }, [user]);

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

    // 🎯 페이지 로드 시 전체 게시글 리스트 불러오기
    useEffect(() => {
        fetchReviews(1);
    }, []);

    return (
        <div className="review-container">
            <h2 className="review-title" onClick={() => window.location.reload()}>
                후기 게시판
            </h2>

            {/* ✅ 로그인 상태 표시 */}
            {loading ? (
                <p>로그인 정보를 확인 중...</p>
            ) : user ? (
                <div>
                    <p>🔹 현재 로그인된 사용자: {user.email}</p>
                </div>
            ) : (
                <p>❌ 로그인되지 않았습니다.</p>
            )}

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
        </div>
    );
}

export default ReviewPage;
