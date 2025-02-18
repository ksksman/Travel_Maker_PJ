import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PwdNext = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // 🔹 타이머 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);

  const handleSendCode = async () => {
    if (!email) {
      alert("이메일을 입력하세요!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/user/find-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      if (response.ok) {
        setMessage("✅ 인증번호가 이메일로 전송되었습니다!");
        setTimeLeft(300); // 🔹 5분(300초) 타이머 시작
      } else {
        const errorMessage = await response.text();
        setMessage("❌ 오류 발생: " + errorMessage);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      setMessage("❌ 서버에 연결할 수 없습니다.");
    }
  };

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
        navigate("/resetpwd");
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
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-row">
            <button
              className="button small"
              type="button"
              style={{ width: "150px", marginBottom: "15px" }}
              onClick={handleSendCode}
              disabled={timeLeft > 0}
            >
              {"인증번호 받기"}
            </button>
          </div>
          {message && <p style={{ fontSize: "14px", color: "blue" }}>{message}</p>}

          <div className="form-row">
            <label className="form-label">인증번호</label>
            <input
              type="text"
              className="input"
              placeholder="인증번호 6자리 입력"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              disabled={timeLeft === 0}
            />
          </div>

          {/* 🔥 남은 시간 빨간색 표시 */}
          {timeLeft > 0 ? (
            <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
              ⏳ 남은 시간: {formatTime(timeLeft)}
            </p>
          ) : (
            <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
              ⏳ 인증번호가 만료되었습니다. 다시 요청해주세요.
            </p>
          )}

          <button className="button" type="submit" onClick={handleNextClick} disabled={timeLeft === 0}>
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

export default PwdNext;
