import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetPwd = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail"); // ✅ 저장된 이메일 가져오기

  useEffect(() => {
    if (!email) {
      alert("⚠ 이메일 정보가 없습니다. 다시 시도해 주세요.");
      navigate("/find-password");
    }
  }, [email, navigate]);

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      alert("⚠ 비밀번호는 8~16자의 영문, 숫자 조합이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("⚠ 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8586/api/user/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: "POST",
      });

      if (response.ok) {
        alert("✅ 비밀번호가 변경되었습니다.");
        localStorage.removeItem("resetEmail"); // ✅ 이메일 정보 삭제
        navigate("/id-login"); // 로그인 페이지로 이동
      } else {
        alert("❌ 비밀번호 변경 실패.");
      }
    } catch (error) {
      console.error("❌ 비밀번호 변경 요청 실패:", error);
      alert("❌ 서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="reset-password-title">비밀번호 재설정</h2>
        <p style={{color:"red",fontSize:"14px"}}>*비밀번호를 변경해 주세요.</p>
        <p style={{color:"red",fontSize:"12px"}}>(영어, 숫자 조합으로 8자리 이상으로 해주세요)</p>
        <form onSubmit={handleSubmit}>
          <input type="password" className="input" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <input type="password" className="input" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button className="button" type="submit">확인</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPwd;
