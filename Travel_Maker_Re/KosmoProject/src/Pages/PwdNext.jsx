import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기

const PwdNext = () => {
  const [email, setEmail] = useState(""); // ✅ 이메일 입력값 상태 저장
  const [verificationCode, setVerificationCode] = useState(""); // ✅ 인증번호 입력값 상태 저장
  const [message, setMessage] = useState(""); // ✅ 서버 응답 메시지 저장
  const navigate = useNavigate(); // navigate 함수 사용

  // ✅ 이메일 입력 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // ✅ 인증번호 입력 핸들러
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // ✅ "인증번호 받기" 버튼 클릭 시 API 요청
  const handleSendCode = async () => {
    if (!email) {
      alert("이메일을 입력하세요!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/user/find-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }), // 이메일 데이터를 서버로 보냄
      });

      if (response.ok) {
        setMessage("✅ 인증번호가 이메일로 전송되었습니다!");
      } else {
        const errorMessage = await response.text();
        setMessage("❌ 오류 발생: " + errorMessage);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      setMessage("❌ 서버에 연결할 수 없습니다.");
    }
  };

  // ✅ "다음" 버튼 클릭 시 인증번호 확인 후 비밀번호 재설정 페이지로 이동
  const handleNextClick = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/user/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, code: verificationCode }),
      });

      if (response.ok) {
        alert("✅ 인증 성공! 비밀번호를 재설정해주세요.");
        navigate("/resetpwd"); // 비밀번호 재설정 페이지로 이동
      } else {
        alert("❌ 인증 실패! 올바른 코드를 입력하세요.");
      }
    } catch (error) {
      console.error("인증번호 확인 실패:", error);
      alert("❌ 서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="findpwd-title">비밀번호 찾기</h2>
        <p className="findpwd-subtitle" style={{ fontSize: "10px", color: "red" }}>
          ※ 입력하신 이메일로 인증번호 받기
        </p>
        <form>
          <div className="form-row">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="input"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailChange} // ✅ 이메일 입력값 업데이트
            />
          </div>
          <div className="form-row">
            <button
              className="button small"
              type="button"
              style={{ width: "150px", marginBottom: "15px" }}
              onClick={handleSendCode} // ✅ "인증번호 받기" 클릭 시 API 요청 실행
            >
              인증번호 받기
            </button>
          </div>
          {message && <p style={{ fontSize: "14px", color: "blue" }}>{message}</p>} {/* ✅ 메시지 표시 */}

          <div className="form-row">
            <label className="form-label">인증번호</label>
            <input
              type="text"
              className="input"
              placeholder="인증번호 6자리 입력"
              value={verificationCode}
              onChange={handleVerificationCodeChange} // ✅ 인증번호 입력값 업데이트
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
