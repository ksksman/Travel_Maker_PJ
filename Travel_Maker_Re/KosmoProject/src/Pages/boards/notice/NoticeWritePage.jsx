import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import "../../../App.css";

function NoticeWritePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const nickname = location.state?.nickname || "";
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [board_cate] = useState(3); // ✅ 공지사항 카테고리
    const [attached_file, setAttached_file] = useState("");

    // ✅ 공지사항 작성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }

        const postData = {
            title,
            content,
            nickname, // ✅ 관리자 닉네임
            board_cate,
            attached_file,
        };

        console.log("📢 전송할 데이터:", postData); // ✅ 디버깅용

        try {
            const response = await fetch("http://localhost:8586/restBoardWrite.do", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                alert("공지사항이 성공적으로 등록되었습니다!");
                navigate("/noticeboard"); // ✅ 공지사항 목록으로 이동
            } else {
                alert("공지사항 등록 실패");
            }
        } catch (error) {
            console.error("공지사항 작성 오류:", error);
        }
    };

    return (
        <div className="notice-container">
            <h2 className="notice-title">공지사항 작성</h2>
            <form className="board-write-form" onSubmit={handleSubmit}>
                <label className="board-form-label">제목</label>
                <input type="text" className="board-input" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label className="board-form-label">내용</label>
                <textarea className="board-input board-textarea" value={content} onChange={(e) => setContent(e.target.value)} required />

                <label className="board-form-label">작성자</label>
                <input type="text" className="board-input" value={nickname} readOnly />

                {/* ✅ 버튼 컨테이너 */}
                <div className="boards-button-container">
                    <button type="submit" className="boards-button boards-submit-button">등록</button>
                    <button type="button" className="boards-button boards-cancel-button" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default NoticeWritePage;
