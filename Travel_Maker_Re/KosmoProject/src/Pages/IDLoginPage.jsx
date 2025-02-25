import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const IDLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔹 초기값을 불러오기 (localStorage에서 값 가져오기)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ useEffect를 이용해서 localStorage 값 가져오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);

        // ✅ 로그인 유지 체크 시 이메일 저장
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("rememberMe");
        }

        // ✅ 로그인 정보 저장
        const userData = { email: email, token: result.token };
        login(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/main");
      } else {
        const errorMessage = await response.text();
        alert("로그인 실패: " + errorMessage);
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const goToFindPWD = () => {
    navigate("/findpwd");
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="additional-options">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="remember-text">
              로그인 유지
            </label>
          </div>
          <button
            type="submit"
            className={`button email ${isFormValid ? "active" : "disabled"}`}
            disabled={!isFormValid}
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
