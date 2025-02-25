import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CreateTripPage.css";
import { useAuth } from "../AuthContext";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tripTitle, setTripTitle] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(true);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 친구 목록: API로 받아온 객체 배열 [{ nickname, userId }]
  const [friendsList, setFriendsList] = useState([]);
  // 초대된 친구: 객체 배열
  const [inviteList, setInviteList] = useState([]);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = ("0" + (date.getMonth() + 1)).slice(-2);
    const dd = ("0" + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    console.log("CreateTripPage - 로그인된 user 정보:", user);
    if (user && user.user_Id) {
      fetch(`http://localhost:8586/api/friends/list?userId=${user.user_Id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("친구 목록 API 응답:", data);
          const myId = user.user_Id;
          const acceptedFriends = data.filter(
            (f) => f.status && f.status.toUpperCase() === "ACCEPTED"
          );
          const friendObjects = acceptedFriends.map((f) => {
            if (f.receiverUserId === myId) {
              return { nickname: f.requester.nickname, userId: f.requester.userId };
            } else {
              return { nickname: f.receiver.nickname, userId: f.receiver.userId };
            }
          });
          setFriendsList(friendObjects);
        })
        .catch((error) => console.error("친구 목록 불러오기 실패:", error));
    }
  }, [user]);

  const handleNext = () => {
    if (tripTitle.trim() === "") {
      alert("여행 제목을 입력해주세요.");
      return;
    }
    setShowTitleInput(false);
    setShowCalendar(true);
  };

  const handleConfirmDates = () => {
    if (!startDate || !endDate) {
      alert("가는 날과 오는 날을 선택해주세요.");
      return;
    }
    setShowCalendar(false);
    setShowInvitePopup(true);
  };

  const handlePreviousTitle = () => {
    setShowCalendar(false);
    setShowTitleInput(true);
    setStartDate(null);
    setEndDate(null);
  };

  const handleEditDates = () => {
    setShowCalendar(true);
    setShowInvitePopup(false);
  };

  const handleAddFriend = (friendObj) => {
    if (inviteList.some((f) => f.userId === friendObj.userId)) {
      alert("이미 초대한 친구입니다.");
      return;
    }
    setInviteList([...inviteList, friendObj]);
  };

  const handleRemoveInvite = (friendObj) => {
    setInviteList(inviteList.filter((f) => f.userId !== friendObj.userId));
  };

  const goToPlanTrip = () => {
    if (!startDate || !endDate) {
      alert("날짜를 선택해주세요.");
      return;
    }
    if (!user || !user.user_Id) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    const tripData = {
      userId: user.user_Id,
      title: tripTitle,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };
    fetch("http://localhost:8586/api/trips/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.tripId) {
          alert("여행이 성공적으로 생성되었습니다.");
          navigate(`/plan-trip/${data.tripId}`, {
            state: {
              tripId: data.tripId,
              title: tripTitle,
              startDate: formatDate(startDate),
              endDate: formatDate(endDate),
              inviteList: inviteList, // 초대된 친구 정보 전달
            },
          });
        } else {
          throw new Error("tripId가 응답에 포함되지 않았습니다.");
        }
      })
      .catch((error) => {
        console.error("여행 생성 실패:", error);
        alert("여행 생성에 실패했습니다.");
      });
  };

  return (
    <div className="create-trip-container">
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

      {showInvitePopup && (
        <div className="invite-popup">
          <h3>동행자 초대</h3>
          <div className="friends-list">
            <p>초대할 친구를 선택하세요:</p>
            <ul>
              {friendsList.length > 0 ? (
                friendsList.map((friendObj, index) => (
                  <li key={index}>
                    {friendObj.nickname}{" "}
                    <button onClick={() => handleAddFriend(friendObj)}>초대</button>
                  </li>
                ))
              ) : (
                <li>친구 목록이 없습니다.</li>
              )}
            </ul>
          </div>
          <h4>초대된 친구 목록</h4>
          <ul className="invite-list">
            {inviteList.map((f, index) => (
              <li key={index}>
                {f.nickname}{" "}
                <button onClick={() => handleRemoveInvite(f)}>삭제</button>
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
    </div>
  );
};

export default CreateTripPage;
