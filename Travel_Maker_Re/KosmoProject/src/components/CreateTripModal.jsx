import React, { useState } from "react";
import "../styles/CreateTripModal.css"; // ✅ CSS 파일 추가

const CreateTripModal = ({ isOpen, onClose, onSave }) => {
  const [tripTitle, setTripTitle] = useState("");

  if (!isOpen) return null; // 모달이 열려있을 때만 렌더링

  const handleSave = () => {
    if (tripTitle.trim() === "") {
      alert("여행 제목을 입력해주세요!");
      return;
    }
    onSave(tripTitle);
    setTripTitle("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>당신의 여행 제목을 입력해주세요</h2>
        <input
          type="text"
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
          placeholder="여행 제목 입력"
        />
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="save-button" onClick={handleSave}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;
