import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import "../../../App.css";

function QnaViewPage() {
  const { user } = useAuth();
  const { board_idx } = useParams();
  const navigate = useNavigate();
  const [qna, setQna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]); // ✅ 댓글 리스트
  const [newComment, setNewComment] = useState(""); // ✅ 새로운 댓글 입력 값
  const [editCommentId, setEditCommentId] = useState(null); // ✅ 수정할 댓글 ID
  const [editCommentText, setEditCommentText] = useState(""); // ✅ 수정할 댓글 내용

  // 🔍 특정 질문 게시글 상세 정보 불러오기
  useEffect(() => {
    fetch(`http://localhost:8586/restBoardView.do?board_idx=${board_idx}`)
      .then((response) => response.json())
      .then((data) => {
        setQna(data);
        setViews(parseInt(data.view_count));
        setLoading(false);
      })
      .catch((error) => {
        console.error("질문 게시판 상세 정보 API 호출 오류:", error);
        setLoading(false);
      });

    // ✅ 조회수 증가 요청
    fetch(`http://localhost:8586/increaseViewCount.do?board_idx=${board_idx}`, {
      method: "PATCH",
    })
      .then(() => setViews((prevViews) => parseInt(prevViews) + 1))
      .catch((error) => console.error("조회수 증가 오류:", error));

    // ✅ 댓글 리스트 불러오기
    fetchComments();
  }, [board_idx]);

  // 🔍 댓글 리스트 불러오기
  function fetchComments() {
    fetch(`http://localhost:8586/getComments.do?qa_id=${board_idx}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data :>> ", data);
        setComments(data);
      })
      .catch((error) => {
        console.error("댓글 불러오기 오류:", error);
      });
  }

  // ✅ 댓글 작성 기능
  function handleAddComment() {
    if (!newComment.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    if (!user) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    const postData = {
      qa_id: board_idx, // ✅ 게시글 ID
      nickname: user.nickname, // ✅ 로그인한 사용자 닉네임
      content: newComment,
    };

    fetch(`http://localhost:8586/addComment.do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (response.ok) {
          setNewComment("");
          fetchComments(); // ✅ 댓글 리스트 갱신
        } else {
          alert("댓글 작성에 실패했습니다.");
        }
      })
      .catch((error) => console.error("댓글 작성 오류:", error));
  }

  // ✅ 댓글 수정 기능
  function handleEditComment(commentId, content) {
    setEditCommentId(commentId);
    setEditCommentText(content);
  }

  function handleUpdateComment() {
    fetch(`http://localhost:8586/updateComment.do`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment_idx: editCommentId,
        content: editCommentText,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setEditCommentId(comments.comment_idx);
          setEditCommentText(comments.content);
          fetchComments(); // ✅ 댓글 리스트 갱신
        } else {
          alert("댓글 수정에 실패했습니다.");
        }
      })
      .catch((error) => console.error("댓글 수정 오류:", error));
  }

  // ✅ 댓글 삭제 기능
  function handleDeleteComment(commentId) {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8586/deleteComment.do?comment_idx=${commentId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchComments(); // ✅ 댓글 리스트 갱신
          } else {
            alert("댓글 삭제에 실패했습니다.");
          }
        })
        .catch((error) => console.error("댓글 삭제 오류:", error));
    }
  }

  if (loading) {
    return <div className="loading">게시글을 불러오는 중...</div>;
  }

  if (!qna) {
    return <div className="error">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="review-view-container">
      <button className="back-button" onClick={() => navigate("/qnaboard")}>
        ← 목록으로 돌아가기
      </button>
      <h2 className="review-view-title">{qna.title}</h2>

      <div className="review-meta">
        <span className="author">작성자: {qna.nickname}</span>
        <div className="meta-right">
          <span>조회수: {views}</span>
        </div>
      </div>

      <div className="post-date">작성일: {qna.post_date}</div>

      <div className="review-content">
        <p>{qna.content}</p>
      </div>

      {/* ✅ 로그인한 사용자와 게시글 작성자가 같을 경우에만 수정, 삭제 버튼 표시 */}
      {user && user.nickname === qna.nickname && (
      <div className="button-container">
        <button
          className="edit-button"
          onClick={() => navigate(`/qnaboard/edit/${board_idx}`)}
        >
          ✏ 수정
        </button>
        <button
          className="delete-button"
          onClick={() => handleDeleteComment(board_idx)}
        >
          🗑 삭제
        </button>
      </div>
      )}

      {/* ✅ 댓글 목록 */}
      <div className="comments-section">
        <h3>댓글</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.comment_idx} className="comment">
              {editCommentId === comment.comment_idx ? (
                <div className="edit-comment">
                  <input
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                  />
                  <button onClick={handleUpdateComment}>💾 저장</button>
                  <button onClick={() => setEditCommentId(null)}>
                    ❌ 취소
                  </button>
                </div>
              ) : (
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-nickname"><strong>{comment.nickname}</strong></span>
                    <span className="comment-date">{comment.comment_date}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>

                  {/* ✅ 로그인한 사용자와 댓글 작성자가 같을 경우에만 수정, 삭제 버튼 표시 */}
                  {user && user.nickname === comment.nickname && (
                  <div className="comment-buttons">
                    <button
                      onClick={() =>
                        handleEditComment(comment.comment_idx, comment.content)
                      }
                    >
                      ✏ 수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.comment_idx)}
                    >
                      🗑 삭제
                    </button>
                  </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>

      {/* ✅ 댓글 작성 */}
      <div className="add-comment">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
        />
        <button onClick={handleAddComment}>💬 댓글 작성</button>
      </div>
    </div>
  );
}

export default QnaViewPage;
