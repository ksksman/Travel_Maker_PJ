import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PwdNext = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
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

  const handleSendCode = async () => {
    if (!email.trim()) {
      alert("⚠ 이메일을 입력하세요!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8586/api/user/find-password?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );

      if (response.ok) {
        setMessage("✅ 인증번호가 이메일로 전송되었습니다!");
        setTimeLeft(300); // 5분 타이머 시작
        localStorage.setItem("resetEmail", email); // ✅ 이메일 저장하여 ResetPwd에서 활용
      } else {
        setMessage("❌ 오류 발생: 이메일을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ API 요청 실패:", error);
      setMessage("❌ 서버에 연결할 수 없습니다.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      alert("⚠ 인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8586/api/user/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`,
        { method: "POST" }
      );

      if (response.ok) {
        alert("✅ 인증 성공! 비밀번호를 재설정해주세요.");
        navigate("/resetpwd");
      } else {
        alert("❌ 인증 실패! 올바른 코드를 입력하세요.");
      }
    } catch (error) {
      console.error("❌ 인증번호 확인 실패:", error);
      alert("❌ 서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="findpwd-title">비밀번호 찾기</h2>
        <p className="findpwd-subtitle" style={{ color: "red", fontSize: "13px" }}>
          ※ 입력하신 이메일로 인증번호 받기
        </p>
        <form>
          <div className="form-row">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="input"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="button small"
            type="button"
            onClick={handleSendCode}
            disabled={timeLeft > 0}
            style={{ width: "120px", fontSize: "13px", padding: "8px" }} // 🔹 버튼 크기 축소
          >
            인증번호 받기
          </button>
          {message && <p style={{ fontSize: "12px", color: "blue" }}>{message}</p>}

          <div className="form-row">
            <label className="form-label">인증번호</label>
            <input
              type="text"
              className="input"
              placeholder="인증번호 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          {/* 남은 시간이 0보다 클 때만 표시 */}
          {timeLeft > 0 && (
            <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
              ⏳ 남은 시간: {formatTime(timeLeft)}
            </p>
          )}

          {/* 시간이 다 되면 "인증번호 만료" 메시지 출력 */}
          {timeLeft === 0 && message === "✅ 인증번호가 이메일로 전송되었습니다!" && (
            <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
              ⏳ 인증번호가 만료되었습니다. 다시 요청해주세요.
            </p>
          )}

          <button className="button" type="submit" onClick={handleVerifyCode} disabled={timeLeft === 0}>
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

export default PwdNext;
