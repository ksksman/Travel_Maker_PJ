import "../App.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const IDLoginPage = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [rememberMe, setRememberMe] = useState(false); // 로그인 유지 상태
  const emailInputRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // ✅ localStorage에서 이메일과 로그인 유지 상태 불러오기
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
      console.log("✅ 저장된 이메일 불러오기:", savedEmail);
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
        credentials: "include", // ✅ 쿠키 포함
      });

      if (response.ok) {
        const result = await response.text();
        console.log("✅ 로그인 결과:", result);
        alert(result);

        if (result === "로그인 성공") {
          const userData = { email: email, token: result.token };
          login(userData);

          // ✅ 로그인 유지 체크 여부에 따라 localStorage 저장
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.setItem("rememberMe", "false");
          }

          navigate("/main");
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } else {
        const errorMessage = await response.text();
        alert("로그인 실패: " + errorMessage);
      }
    } catch (error) {
      console.error("🚨 로그인 요청 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
    console.log("✅ 로그인 유지 체크 상태:", !rememberMe);
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
            ref={emailInputRef}
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
              onChange={handleRememberMeChange}
            />
            <label htmlFor="remember-me" className="remember-text">
            아이디 저장하기
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
