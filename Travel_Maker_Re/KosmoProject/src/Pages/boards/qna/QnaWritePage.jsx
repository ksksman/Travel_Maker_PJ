import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../../../App.css';

function QnaWritePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const nickname = location.state?.nickname || ""; // ✅ QnaPage에서 전달된 닉네임

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [board_cate] = useState(2);
    const [attached_file, setAttached_file] = useState("");

    // ✅ 질문 작성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            nickname, // ✅ 작성자 정보 자동 입력
            board_cate,
            attached_file,
        };
        console.log('postData :>> ', postData);
        try {
            const response = await fetch("http://localhost:8586/restBoardWrite.do", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                alert("질문이 성공적으로 등록되었습니다!");
                navigate("/qnaboard");
            } else {
                alert("질문 등록 실패");
            }
        } catch (error) {
            console.error("질문 작성 오류:", error);
        }
    };

    return (
        <div className="review-container"> {/* ✅ 기존 스타일 활용 */}
            <h2 className="review-title">질문 작성</h2> {/* ✅ 제목 스타일 적용 */}
            <form className="write-form" onSubmit={handleSubmit}>
                
                <label className="board-form-label">제목</label>
                <input type="text" className="board-input" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label className="board-form-label">내용</label>
                <textarea className="board-input board-textarea" value={content} onChange={(e) => setContent(e.target.value)} required />

                <label className="board-form-label">작성자</label>
                <input type="text" className="board-input" value={nickname} readOnly />{/* ✅ 자동 입력 */}

                <div className="boards-button-container">
                    <button type="submit" className="boards-button boards-submit-button">등록</button>
                    <button type="button" className="boards-button boards-cancel-button" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default QnaWritePage;
