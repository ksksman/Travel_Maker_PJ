import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기

const PwdNext = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate(); // navigate 함수 사용

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (verificationCode.trim() === "") {
      alert("인증번호를 입력해주세요."); // 간단한 유효성 검사
    } else {
      navigate("/resetpwd"); // 비밀번호 재설정 페이지로 이동
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="findpwd-title">비밀번호 찾기</h2>
        <p className="findpwd-subtitle" style={{fontSize:"10px", color:"red"}}>※입력하신 이메일로 인증번호 받기</p>
        <form>
          <div className="form-row">
            <label className="form-label">이름</label>
            <input
              type="text"
              className="input"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="form-row">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="input"
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="form-row">
            <button
              className="button small"
              type="button"
              style={{ width: "150px", marginBottom: "15px" }}
            >
              인증번호 받기
            </button>
          </div>
          <div className="form-row">
            <label className="form-label">인증번호</label>
            <input
              type="text"
              className="input"
              placeholder="인증번호 6자리 입력"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
          </div>
          <button className="button" type="submit" onClick={handleNextClick}>
            다음
          </button>
        </form>
      </div>
    </div>
  );
};

export default PwdNext;
