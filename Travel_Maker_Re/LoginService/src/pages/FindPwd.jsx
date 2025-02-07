import "../App.css";
import { useNavigate } from "react-router-dom"; // useNavigate import

const FindPwd = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleNext = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    navigate("/pwd-next"); // 다음 페이지로 이동
  };

  return (
    <div className="app-container">
      <div className="card">
        <img
          src="/travel_maker.png"
          alt="Travel Maker Logo"
          className="logo"
        />
        <h2 className="findpwd-title" style={{ fontSize: "13px" }}>
          비밀번호를 찾고자 하는 아이디를 입력해주세요.
        </h2>
        <form>
          <div className="form-row">
            <label className="form-label" htmlFor="userid">
              : 아이디를 입력하세요.
            </label>
            <input
              type="text"
              id="userid"
              className="input"
              placeholder="아이디를 입력하세요."
            />
          </div>
          <button
            className="button"
            type="button" // 버튼 타입 변경
            onClick={handleNext} // 버튼 클릭 시 이동 함수 호출
          >
            다음
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPwd;
