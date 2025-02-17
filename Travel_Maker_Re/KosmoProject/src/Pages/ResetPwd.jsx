import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 🔹 useLocation 추가

const ResetPwd = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // 🔹 현재 URL에서 이메일 정보 가져오기

  // 🔹 이메일 정보 가져오기 (비밀번호 찾기 페이지에서 전달)
  const queryEmail = new URLSearchParams(location.search).get("email");
  const storedEmail = localStorage.getItem("resetEmail");
  const email = queryEmail || storedEmail;

  // 🔹 이메일 정보가 없으면 경고 후 뒤로 가기
  useEffect(() => {
    if (!email) {
      alert("이메일 정보가 없습니다. 다시 시도해 주세요.");
      navigate("/find-password");
    }
  }, [email, navigate]);

  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자 조합이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, newPassword }),
      });

      const result = await response.text();
      if (response.ok) {
        alert(`✅ ${result}`);
        localStorage.removeItem("resetEmail"); // 이메일 정보 삭제
        navigate("/id-login"); // 🔹 로그인 페이지로 이동
      } else {
        alert(`❌ 비밀번호 변경 실패: ${result}`);
      }
    } catch (error) {
      console.error("비밀번호 변경 요청 실패:", error);
      alert("❌ 서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="reset-password-title">비밀번호 재설정</h2>
        <p className="reset-password-subtitle" style={{ fontSize: "11px" }}>
          비밀번호를 변경해 주세요. 다른 사이트에서 사용한 적 없는 안전한 비밀번호로 설정해 주세요.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">새 비밀번호</label>
            <input
              type="password"
              className="input"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-row">
            <label className="form-label">새 비밀번호 확인</label>
            <input
              type="password"
              className="input"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <p className="reset-password-note" style={{ fontSize: "9px", color: "red" }}>
            * 영문, 숫자, 특수문자를 포함한 8자 이상 16자 이하의 조합만 가능합니다.
          </p>
          <button className="button" type="submit">
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPwd;
