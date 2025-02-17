import { useState, useEffect } from "react";
import "../App.css";

const AuthCodePopup = ({ onClose, email, setEmailVerified }) => {
  const [authCode, setAuthCode] = useState(""); // 입력된 인증번호
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지
  const [timeLeft, setTimeLeft] = useState(300); // ⏳ 타이머 5분 (300초)

  // ✅ 타이머 감소 로직
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // ✅ 인증번호 확인 요청
  const verifyAuthCode = async () => {
    if (timeLeft <= 0) {
      setErrorMessage("인증 시간이 만료되었습니다. 다시 요청하세요.");
      return;
    }

    if (!authCode) {
      setErrorMessage("인증번호를 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, code: authCode }),
      });

      const result = await response.json(); // JSON으로 응답 받기

      if (response.ok && result.status === "success") {
        setEmailVerified(true);  // ✅ 이메일 인증 성공 상태 업데이트
        alert("이메일 인증이 완료되었습니다.");
        onClose();  // ✅ 팝업 닫기
      } else {
        setErrorMessage("인증번호가 다릅니다.");
      }
    } catch (error) {
      console.error("이메일 인증 오류:", error);
      setErrorMessage("인증번호 확인 중 오류 발생!");
    }
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <h3>인증번호 입력</h3>
        <p>인증번호를 입력해 주세요.</p>
        <input
          type="text"
          className="input"
          placeholder="6자리 인증번호 입력"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          disabled={timeLeft <= 0} // ⏳ 타이머 만료 시 입력 비활성화
        />

        {/* ⏳ 남은 시간 표시 (항상 빨간색) */}
        <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
          ⏳ 남은 시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초
        </p>

        {errorMessage && <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>}

        <button className="button" onClick={verifyAuthCode} disabled={timeLeft <= 0}>
          확인
        </button>
        <button className="text-link" onClick={onClose} style={{ marginTop: "10px" }}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default AuthCodePopup;
