import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import "../../../App.css";

function SeWrite() {
    const navigate = useNavigate();
    const { user } = useAuth(); // ✅ 로그인 정보 가져오기
    const nickname = user?.nickname || ""; // ✅ 로그인한 사용자의 닉네임
    const [board_cate] = useState(1); // ✅ 후기 게시판 (board_cate = 1)

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [attached_file, setAttached_file] = useState("");
    // ✅ 후기 작성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            nickname,
            board_cate, // ✅ 후기 게시판 카테고리
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
                alert("후기가 성공적으로 등록되었습니다!");
                navigate("/reviewboard"); // ✅ 후기 게시판으로 이동
            } else {
                alert("후기 등록 실패");
            }
        } catch (error) {
            console.error("후기 작성 오류:", error);
        }
    };

    return (
        <div className="">
            <h2 className="review-title">후기 작성</h2>
            <form className="" onSubmit={handleSubmit}>
                <label className="">제목</label>
                <input type="text" className="" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label className="">내용</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setContent(data); // ✅ CKEditor 내용 저장
                    }} />
                
                <textarea className="board-input board-textarea" value={content} onChange={(e) => setContent(e.target.value)} required />

                <label className="">작성자</label>
                <input type="text" className="board-input" value={nickname} readOnly />

                {/* ✅ 버튼 컨테이너 */}
                <div className="">
                    <button type="submit" className="boards-button boards-submit-button">등록</button>
                    <button type="button" className="boards-button boards-cancel-button" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default SeWrite;
