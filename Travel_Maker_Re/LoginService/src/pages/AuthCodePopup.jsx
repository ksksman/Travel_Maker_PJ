import "../App.css";

const AuthCodePopup = ({ onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <h3>인증번호 입력</h3>
        <p>인증번호를 입력해 주세요.</p>
        <input type="text" className="input" placeholder="6자리 인증번호 입력" />
        <button className="button">확인</button>
        <button className="text-link" onClick={onClose} style={{marginTop:"10px"}}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default AuthCodePopup;
