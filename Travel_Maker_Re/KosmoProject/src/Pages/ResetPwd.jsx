import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPwd = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/id-login"); // IDLoginPage로 리다이렉션
    } else {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="reset-password-title">비밀번호 재설정</h2>
        <p className="reset-password-subtitle" style={{fontSize:"11px"}}>
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
          <p className="reset-password-note" style={{fontSize:"9px", color:"red"}}>
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
