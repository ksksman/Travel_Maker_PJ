import { useNavigate } from "react-router-dom";
import "../App.css"; // App.css 연결

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    if (provider === "kakao") {
      window.location.href = "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code";
    } else if (provider === "naver") {
      window.location.href = "https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code";
    }
  };

  const IDLogin = () => {
    navigate("/id-login");
  };

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
        <button className="text-link" onClick={goToSignup} style={{marginTop:"20px"}}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
