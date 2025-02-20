import React, { useRef, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

import ReactQuill from "react-quill";
import "/node_modules/react-quill/dist/quill.snow.css";

import "../../../App.css";

function ReviewWritePage() {
    const navigate = useNavigate();
    const { user } = useAuth(); // ✅ 로그인 정보 가져오기
    const nickname = user?.nickname || ""; // ✅ 로그인한 사용자의 닉네임
    const [board_cate] = useState(1); // ✅ 후기 게시판 (board_cate = 1)

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [attached_file, setAttached_file] = useState("");
    const quillRef = useRef(null); // Quill 에디터 참조

    // ✅ 이미지 업로드 핸들러
    const handleImageUpload = async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch("http://localhost:8586/uploadImage", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    const url = data.imageUrl; // 서버에서 반환한 이미지 URL

                    // ✅ Quill 에디터에 이미지 삽입
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection();
                    editor.insertEmbed(range.index, "image", url);
                } else {
                    alert("이미지 업로드 실패");
                }
            } catch (error) {
                console.error("이미지 업로드 오류:", error);
            }
        };
    };

    // ✅ Quill 에디터 모듈 설정
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"], // ✅ 이미지 업로드 버튼 추가
                [{ align: [] }],
                ["clean"],
            ],
            handlers: {
                image: handleImageUpload, // ✅ 이미지 업로드 기능 연결
            },
        },
    }), []);

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
        <div className="review-container">
            <h2 className="review-title">후기 작성</h2>
            <form className="board-write-form" onSubmit={handleSubmit}>
                <label className="board-form-label">제목</label>
                <input type="text" className="board-input" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label className="board-form-label">내용</label>
                <ReactQuill 
                    ref={quillRef}
                    value={content} 
                    onChange={setContent} 
                    modules={modules}    
                />
                {/* <textarea className="board-input board-textarea" value={content} onChange={(e) => setContent(e.target.value)} required /> */}
                
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

export default ReviewWritePage;
