import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../../App.css';

function ReviewEditPage() {
    const { board_idx } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8586/restBoardView.do?board_idx=${board_idx}`)
            .then((response) => response.json())
            .then((data) => {
                setTitle(data.title);
                setContent(data.content);
            })
            .catch((error) => console.error("게시글 불러오기 오류:", error));
    }, [board_idx]);

    function handleUpdate() {
        fetch(`http://localhost:8586/updateBoard.do`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                board_idx: board_idx,
                title: title,
                content: content,
            }),
        })
        .then((response) => {
            if (response.ok) {
                alert("게시글이 수정되었습니다.");
                navigate(`/review/${board_idx}`);
            } else {
                alert("게시글 수정에 실패했습니다.");
            }
        })
        .catch((error) => console.error("게시글 수정 오류:", error));
    }

    return (
      <div className="review-edit-container">
      <h2>게시글 수정</h2>
      <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-input"
          placeholder="제목을 입력하세요"
      />
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="edit-textarea"
          placeholder="내용을 입력하세요"
      />
      <div className="button-container">
          <button className="update-button" onClick={handleUpdate}>수정 완료</button>
          <button className="cancel-button" onClick={() => navigate(-1)}>취소</button>
      </div>
  </div>
    );
}

export default ReviewEditPage;
