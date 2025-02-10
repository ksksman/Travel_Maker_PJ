import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const IDLoginPage = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const navigate = useNavigate();

  const isFormValid = email.trim() !== "" && password.trim() !== ""; // 유효성 검사

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 처리
    if (isFormValid) {
      alert("로그인 성공!"); // 실제로는 서버 요청으로 대체
    } else {
      alert("이메일과 비밀번호를 입력해주세요.");
    }
  };

  const goToFindPWD = () => {
    navigate("/findpwd"); // 비밀번호 찾기 페이지로 이동
  };

  return (
    <div className="app-container">
      <div className="card">
        <img src="/travel_maker.png" alt="Travel Maker Logo" className="logo" />
        <h2>이메일 로그인</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력값 업데이트
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 입력값 업데이트
          />
          <div className="additional-options">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me" className="remember-text">
              로그인 유지
            </label>
          </div>
          <button
            type="submit"
            className={`button email ${isFormValid ? "active" : "disabled"}`} // 클래스 동적 추가
            disabled={!isFormValid} // 버튼 활성화 조건
          >
            로그인
          </button>
        </form>
        <div className="additional-links">
          <button className="text-link" onClick={goToFindPWD} style={{ marginTop: "10px" }}>
            비밀번호 찾기
          </button>
          <button className="text-link" onClick={() => navigate("/")}>
            다른 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDLoginPage;
