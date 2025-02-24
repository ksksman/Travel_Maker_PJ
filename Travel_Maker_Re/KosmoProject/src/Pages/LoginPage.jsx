import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // ✅ 로그인 상태 확인을 위한 useEffect 추가
import "../App.css"; // App.css 연결

const LoginPage = () => {
  const navigate = useNavigate();


  // ✅ 로그인 후 자동으로 main 페이지로 이동
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("redirect")) {
      console.log("✅ 로그인 후 자동 이동");
      navigate("/main"); // ✅ main으로 이동
    }
  }, [navigate]);

  // ✅ 카카오/네이버 로그인 핸들러
  const handleSocialLogin = (provider) => {
    if (provider === "kakao") {
      window.location.href = 
      `https://kauth.kakao.com/oauth/authorize?client_id=389b95d1ffd38f723c94e788919d6b4d&redirect_uri=http://localhost:8586/auth/kakao/callback&response_type=code&prompt=login`;
    } else if (provider === "naver") {
      // 🔹 프론트에서 직접 URL을 만드는 것이 아니라, 백엔드에서 받은 URL을 사용
      fetch("http://localhost:8586/auth/naver/login", {
          method: "GET",
          credentials: "include" // ✅ 세션 유지
      })
      .then(response => response.json())
      .then(data => {
          if (data.loginUrl) {
              window.location.href = data.loginUrl; // ✅ 백엔드에서 생성한 URL 사용
          }
      })
      .catch(error => console.error("🚨 네이버 로그인 URL 요청 실패:", error));
    }
};

  // ✅ 아이디 로그인 페이지 이동
  const IDLogin = () => {
    navigate("/id-login");
  };

  // ✅ 회원가입 페이지 이동
  const goToSignup = () => {
    navigate("/signup-agreement"); // 올바른 경로
  };

  return (
    <div className="app-container">
      <div className="card">
        {/* 이미지 추가 */}
        <img src="/travel_maker.png" alt="Travel Maker Logo" className="logo" />
        <h2>로그인/회원가입</h2>
        <button className="button kakao" onClick={() => handleSocialLogin("kakao")}>
          💬 카카오로 시작하기
        </button>
        <button className="button naver" onClick={() => handleSocialLogin("naver")}>
          N 네이버로 시작하기
        </button>
        <button className="button id" onClick={IDLogin}>
          아이디 입력하기
        </button>
        <button className="text-link" onClick={goToSignup} style={{ marginTop: "20px" }}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginPage;