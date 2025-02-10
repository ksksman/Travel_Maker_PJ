import { useState } from "react";
import "../App.css";
import AuthCodePopup from "./AuthCodePopup";

const Signup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="app-container">
      <div className="signup-card">
        <h2 className="signup-title">필수 정보 입력</h2>
        <p className="signup-subtitle">가입을 위해 필수 정보를 입력해 주세요.</p>

        <form>
          {/* 이메일 */}
          <div className="form-row">
            <label className="form-label">
              이메일<span className="required"> *</span>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "red",
                  marginTop: "5px",
                }}
              >
                ID는 반드시 본인 소유의 연락 가능한 이메일 주소를 사용하셔야 합니다.
              </span>
            </label>
            <input
              type="email"
              className="input"
              placeholder="abc@gccompany.co.kr"
            />
          </div>
          <div className="form-row">
            <button
              type="button"
              className="button small"
              onClick={handleOpenPopup} // 팝업 열기
            >
              인증번호 전송
            </button>
          </div>

          {/* 비밀번호 */}
          <div className="form-row">
            <label className="form-label">
              비밀번호<span className="required"> *</span>
            </label>
            <input
              type="password"
              className="input"
              placeholder="최소 8자 이상"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row">
            <label className="form-label">
              비밀번호 확인<span className="required"> *</span>
            </label>
            <input
              type="password"
              className="input"
              placeholder="위 비밀번호와 동일하게 입력"
            />
          </div>

          {/* 생년월일 */}
          <div className="form-row">
            <label className="form-label">
              생년월일<span className="required"> *</span>
            </label>
            <input type="date" className="input" />
          </div>

          {/* 성별 */}
          <div className="form-row">
            <label className="form-label">
              성별<span className="required"> *</span>
            </label>
            <div className="radio-group">
              <label>
                <input type="radio" name="gender" /> 여자
              </label>
              <label>
                <input type="radio" name="gender" /> 남자
              </label>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-row">
            <label className="form-label">
              휴대폰 번호<span className="required"> *</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="01012345678"
            />
          </div>

          {/* 닉네임 */}
          <div className="form-row">
            <label className="form-label">
              닉네임<span className="required"> *</span>
            </label>
            <input
              type="text"
              className="input nickname-input"
              placeholder="닉네임 입력"
            />
            <button className="text-link">중복확인</button>
          </div>

          {/* 회원가입 완료 */}
          <button className="button">회원가입 완료</button>
        </form>

        {/* 팝업 */}
        {showPopup && <AuthCodePopup onClose={handleClosePopup} />}
      </div>
    </div>
  );
};

export default Signup;
