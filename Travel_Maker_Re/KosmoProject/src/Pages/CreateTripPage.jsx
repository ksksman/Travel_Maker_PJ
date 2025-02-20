import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CreateTripPage.css";
// AuthContext에서 로그인 정보 가져오기
import { useAuth } from "../AuthContext";


const CreateTripPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인된 사용자 정보 (예: user.id, user.nickname 등)
  
  // 여행 제목 상태
  const [tripTitle, setTripTitle] = useState("");

  // UI 상태
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(true);
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  // 날짜 상태
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 하드코딩된 친구 목록 (초대할 수 있는 친구 목록)
  const [friendsList] = useState(["김철수", "이영희", "박지민", "최윤아", "정우성"]);

  // 초대된 친구 목록 (동행자)
  const [inviteList, setInviteList] = useState([]);

  // 로컬 날짜를 "YYYY-MM-DD" 형식으로 변환하는 함수
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = ("0" + (date.getMonth() + 1)).slice(-2);
    const dd = ("0" + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  };

  // 컴포넌트 마운트 시 AuthContext에서 받은 user 정보 확인 (디버깅)
  useEffect(() => {
    console.log("CreateTripPage - 로그인된 user 정보:", user);
  }, [user]);

  // "다음" 버튼 클릭 → 제목 입력창 숨기고 달력 표시
  const handleNext = () => {
    if (tripTitle.trim() === "") {
      alert("여행 제목을 입력해주세요.");
      return;
    }
    setShowTitleInput(false);
    setShowCalendar(true);
  };

  // "날짜 선택 완료" 버튼 클릭 → 동행자 초대 팝업 표시
  const handleConfirmDates = () => {
    if (!startDate || !endDate) {
      alert("가는 날과 오는 날을 선택해주세요.");
      return;
    }
    setShowCalendar(false);
    setShowInvitePopup(true);
  };

  // "이전" 버튼 클릭 → 제목 입력 화면으로 돌아감
  const handlePreviousTitle = () => {
    setShowCalendar(false);
    setShowTitleInput(true);
    setStartDate(null);
    setEndDate(null);
  };

  // 날짜 수정 버튼 클릭 → 달력 화면 다시 표시
  const handleEditDates = () => {
    setShowCalendar(true);
    setShowInvitePopup(false);
  };

  // 친구 초대 추가 (동일 친구 중복 초대 방지)
  const handleAddFriend = (friend) => {
    if (inviteList.includes(friend)) {
      alert("이미 초대한 친구입니다.");
      return;
    }
    setInviteList([...inviteList, friend]);
  };

  // 초대된 친구 삭제
  const handleRemoveInvite = (friend) => {
    setInviteList(inviteList.filter((invite) => invite !== friend));
  };

  // 여행 생성 API 호출 후, /plan-trip 페이지로 이동
  const goToPlanTrip = () => {
    if (!startDate || !endDate) {
      alert("날짜를 선택해주세요.");
      return;
    }
    if (!user || !user.id) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    const tripData = {
      userId: user.id, // AuthContext에서 가져온 로그인된 사용자 ID 사용
      title: tripTitle,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };

    // 백엔드 API 호출 (POST)
    fetch("http://localhost:8586/api/trips/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripData)
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("API 호출 실패, 상태: " + response.status);
        }
      })
      .then((message) => {
        alert(message);
        const plan = {
          title: tripTitle,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          inviteList: inviteList
        };
        navigate("/plan-trip", { state: { plan } });
      })
      .catch((error) => {
        console.error("여행 생성 실패:", error);
        alert("여행 생성에 실패했습니다.");
      });
  };

  return (
    <div className="create-trip-container">
      {/* 여행 제목 입력 */}
      {showTitleInput && !showCalendar && !showInvitePopup && (
        <div className="trip-title-section">
          <h2>새 여행 만들기</h2>
          <div className="trip-title-input">
            <label>여행 제목을 입력해주세요</label>
            <input
              type="text"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="ex) 1박2일 해운대 여행!"
            />
          </div>
          <button className="next-button" onClick={handleNext}>
            다음
          </button>
        </div>
      )}

      {/* 여행 날짜 선택 */}
      {showCalendar && (
        <div className="calendar-popup">
          <h3>여행 날짜 선택</h3>
          <div className="date-picker-container">
            <div>
              <p>가는 날</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy.MM.dd"
                className="date-input"
                placeholderText="직접 입력 가능"
              />
            </div>
            <div>
              <p>오는 날</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy.MM.dd"
                className="date-input"
                placeholderText="직접 입력 가능"
              />
            </div>
          </div>
          <div className="calendar-buttons">
            <button className="previous-button" onClick={handlePreviousTitle}>
              이전
            </button>
            <button className="confirm-dates-button" onClick={handleConfirmDates}>
              날짜 선택 완료
            </button>
          </div>
        </div>
      )}

      {/* 동행자 초대 팝업 */}
      {showInvitePopup && (
        <div className="invite-popup">
          <h3>동행자 초대</h3>
          <div className="friends-list">
            <p>초대할 친구를 선택하세요:</p>
            <ul>
              {friendsList.map((friend, index) => (
                <li key={index}>
                  {friend}
                  <button onClick={() => handleAddFriend(friend)}>초대</button>
                </li>
              ))}
            </ul>
          </div>
          <h4>초대된 친구 목록</h4>
          <ul className="invite-list">
            {inviteList.map((friend, index) => (
              <li key={index}>
                {friend} <button onClick={() => handleRemoveInvite(friend)}>삭제</button>
              </li>
            ))}
          </ul>
          <div className="invite-buttons">
            <button className="edit-dates-button" onClick={handleEditDates}>
              날짜 수정
            </button>
            <button className="next-step-button" onClick={goToPlanTrip}>
              관광지 계획짜기
            </button>
          </div>
        </div>
      )}

      {/* 선택된 날짜 표시 (동행자 초대 후) */}
      {!showCalendar && !showInvitePopup && startDate && endDate && (
        <div className="selected-dates">
          <p>가는 날: {startDate.toLocaleDateString()}</p>
          <p>오는 날: {endDate.toLocaleDateString()}</p>
          <div className="final-buttons">
            <button className="edit-dates-button" onClick={handleEditDates}>
              날짜 수정
            </button>
            <button className="next-step-button" onClick={goToPlanTrip}>
              관광지 계획짜기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTripPage;
