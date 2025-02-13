import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../../App.css';

function NoticeViewPage() {
    const { board_idx } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState(0);

    // 🔍 특정 공지사항 상세 정보 불러오기
    useEffect(() => {
        fetch(`http://localhost:8586/restBoardView.do?board_idx=${board_idx}`)
            .then((response) => response.json())
            .then((data) => {
                setNotice(data);
                setViews(parseInt(data.view_count)); // ✅ 조회수 변환
                setLoading(false);
            })
            .catch((error) => {
                console.error("공지사항 상세 정보 API 호출 오류:", error);
                setLoading(false);
            });

        // ✅ 조회수 증가 요청
        fetch(`http://localhost:8586/increaseViewCount.do?board_idx=${board_idx}`, {
            method: "PATCH"
        })
        .then(() => setViews(prevViews => parseInt(prevViews) + 1))
        .catch((error) => console.error("조회수 증가 오류:", error));

    }, [board_idx]);

    // ✅ 공지사항 수정 기능
    function handleEdit() {
        navigate(`/noticeboard/edit/${board_idx}`); // 수정 페이지로 이동
    }

    // ✅ 공지사항 삭제 기능
    function handleDelete() {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            fetch(`http://localhost:8586/deleteBoard.do?board_idx=${board_idx}`, {
                method: "DELETE"
            })
            .then((response) => {
                if (response.ok) {
                    alert("공지사항이 삭제되었습니다.");
                    navigate("/noticeboard");
                } else {
                    alert("공지사항 삭제에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("공지사항 삭제 오류:", error);
                alert("공지사항 삭제 중 오류가 발생했습니다.");
            });
        }
    }

    if (loading) {
        return <div className="loading">공지사항을 불러오는 중...</div>;
    }

    if (!notice) {
        return <div className="error">공지사항을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="review-view-container">
            {/* 🔙 목록으로 돌아가기 버튼 (왼쪽 상단 배치) */}
            <button className="back-button" onClick={() => navigate("/noticeboard")}>← 목록으로 돌아가기</button>

            <h2 className="review-view-title">{notice.title}</h2>

            {/* 🔎 작성자 & 조회수 */}
            <div className="review-meta">
                <span className="author">작성자: {notice.nickname}</span>
                <div className="meta-right">
                    <span>조회수: {views}</span>
                </div>
            </div>

            {/* 🔎 작성일 */}
            <div className="post-date">작성일: {notice.post_date}</div>

            <div className="review-content">
                <p>{notice.content}</p>
            </div>

            {/* ✏ 수정 & 🗑 삭제 버튼 (오른쪽 정렬) */}
            <div className="button-container">
                <button className="edit-button" onClick={handleEdit}>✏ 수정</button>
                <button className="delete-button" onClick={handleDelete}>🗑 삭제</button>
            </div>
        </div>
    );
}

export default NoticeViewPage;
