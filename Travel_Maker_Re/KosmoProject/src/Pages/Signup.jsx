import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 네비게이션 추가
import "../App.css";
import AuthCodePopup from "./AuthCodePopup";

const Signup = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 훅 추가
  const [showPopup, setShowPopup] = useState(false);

  // ✅ 입력값 상태 저장
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState(null);

  // ✅ 이메일 인증 관련 상태
  const [authCode, setAuthCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // ✅ 팝업 열고 닫기
  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  // ✅ 닉네임 중복 확인 요청
  const checkNickname = async () => {
    if (!nickname) {
      alert("닉네임을 입력하세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8586/api/user/check-nickname/${nickname}`);
      if (response.ok) {
        setNicknameAvailable(true);
        alert("사용 가능한 닉네임입니다.");
      } else {
        setNicknameAvailable(false);
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 확인 요청 실패:", error);
      alert("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  // ✅ 이메일 인증번호 전송
  const sendVerificationCode = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8586/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      if (response.ok) {
        alert("인증번호가 전송되었습니다.");
        handleOpenPopup(); // ✅ 팝업 열기 추가
      } else {
        alert("인증번호 전송 실패!");
      }
    } catch (error) {
      console.error("인증번호 전송 오류:", error);
      alert("인증번호 전송 중 오류 발생!");
    }
  };

  // ✅ 회원가입 요청
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
        alert("이메일 인증을 완료해주세요.");
        return;
    }

    if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다!");
        return;
    }

    if (nicknameAvailable === false) {
        alert("닉네임을 다시 입력해주세요!");
        return;
    }

    const userData = { email, password, nickname, birthdate, gender, phoneNumber };

    try {
        const response = await fetch("http://localhost:8586/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.text(); // 🔥 서버가 보낸 응답 메시지를 받음

        if (response.ok) {
            alert("회원가입 성공!");
            navigate("/login"); // ✅ 회원가입 후 로그인 페이지로 이동
        } else {
            alert(result); // 🔥 "이미 가입된 이메일입니다." 등의 메시지 표시
        }
    } catch (error) {
        console.error("회원가입 요청 실패:", error);
        alert("회원가입 중 오류가 발생했습니다.");
    }
};


  return (
    <div className="app-container">
      <div className="signup-card">
        <h2 className="signup-title">필수 정보 입력</h2>
        <p className="signup-subtitle" style={{ color: "red", fontSize: "13px" }}>
          *가입을 위해 필수 정보를 입력해 주세요.
        </p>

        <form onSubmit={handleSignup}>
          {/* 이메일 입력 */}
          <div className="form-row">
            <label className="form-label">이메일 *</label>
            <input
              type="email"
              className="input"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="button" className="button small" onClick={sendVerificationCode} style={{ marginTop: "5px" }}>
              인증번호 전송
            </button>
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-row">
            <label className="form-label">비밀번호 *</label>
            <input
              type="password"
              className="input"
              placeholder="최소 8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row">
            <label className="form-label">비밀번호 확인 *</label>
            <input
              type="password"
              className="input"
              placeholder="비밀번호 재입력"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* 생년월일 */}
          <div className="form-row">
            <label className="form-label">생년월일 *</label>
            <input type="date" className="input" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
          </div>

          {/* 성별 선택 */}
          <div className="form-row">
            <label className="form-label">성별 *</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="gender" value="M" onChange={(e) => setGender(e.target.value)} required /> 남자
              </label>
              <label>
                <input type="radio" name="gender" value="F" onChange={(e) => setGender(e.target.value)} required /> 여자
              </label>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-row">
            <label className="form-label">휴대폰 번호 *</label>
            <input type="text" className="input" placeholder="01012345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>

          {/* 닉네임 입력 */}
          <div className="form-row">
            <label className="form-label">닉네임 *</label>
            <input type="text" className="input" placeholder="닉네임 입력" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
            <button type="button" className="text-link" onClick={checkNickname}>
              닉네임 중복확인
            </button>
          </div>

          {/* 회원가입 버튼 */}
          <button className="button" type="submit">
            회원가입 완료
          </button>
        </form>

        {/* 인증 팝업 */}
        {showPopup && <AuthCodePopup onClose={handleClosePopup} email={email} setEmailVerified={setEmailVerified} />}
      </div>
    </div>
  );
};

export default Signup;
