import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';  // 설정 아이콘
import '../App.css';

const MyPage = () => {
    const [profile, setProfile] = useState({
        name: '뺵곰',
        email: 'travelisgood@naver.com',
        mapCount: 10,
        travelLevel: 'Explorer',
        points: 1500,
        profilePicture: '/images/default-profile.webp',
    });

    const [chatRooms, setChatRooms] = useState(['서울 강남구', '제주도 공항맛집', '강릉 속초 힐링 여행']);
    const [friends, setFriends] = useState(['백건우', '윤웅희', '이강산']);
    const [friendRequests, setFriendRequests] = useState(['김용환', '이가희']);

    const navigate = useNavigate();

    const handleEnterChatRoom = (roomName) => {
        alert(`"${roomName}" 지도를 출력합니다.`);
    };

    const handleStartChat = (friendName) => {
        alert(`${friendName}님과의 1대1 채팅을 시작합니다.`);
        // navigate(`/chat/${friendName}`); // 실제 채팅 페이지로 이동하는 코드 추가 가능
    };

    const handleLogout = () => {
        alert('로그아웃되었습니다.');
    };

    const handleAccountDeletion = () => {
        const confirmDelete = window.confirm('정말로 회원탈퇴 하시겠습니까?');
        if (confirmDelete) {
            alert('회원탈퇴가 완료되었습니다.');
        }
        
    };

    return (
        <div className="my-page">
            <h1>마이페이지</h1>

            {/* 프로필 카드 */}
            <div className="profile-card-container">
                <img src={profile.profilePicture} alt="프로필 사진" className="profile-picture" />
                <div className="profile-details">
                    <h2>{profile.name}</h2>
                    <p>{profile.email}</p>
                    <div className="stats">
                        <div>
                            <strong>지도 만든 횟수</strong>
                            <p>{profile.mapCount}</p>
                        </div>
                        <div>
                            <strong>회원 등급</strong>
                            <p>{profile.travelLevel}</p>
                        </div>
                        <div>
                            <strong>포인트</strong>
                            <p>{profile.points} P</p>
                        </div>
                    </div>
                </div>
                {/* 설정 아이콘과 텍스트 */}
                <div className="settings-container" onClick={() => navigate('/edit-profile', { state: { profile } })}>
                    <FaCog className="settings-icon" />
                    <span className="settings-text">개인정보 수정</span>
                </div>
            </div>

            {/* 생성한 채팅 방 목록 */}
            <section className="chat-room-section card">
                <h3>내가 생성한 스케쥴 지도 바로가기</h3>
                <ul>
                    {chatRooms.map((room, index) => (
                        <li key={index} className="chat-room-item">
                            <span>{room}</span>
                            <button className="enter-button" onClick={() => handleEnterChatRoom(room)}>
                                입장
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="friends-list-section card">
    <h3>친구 목록</h3>
    <ul>
        {friends.map((friend, index) => (
            <li key={index} className="friend-item">
                <span>{friend}</span>
                <button className="chat-button" onClick={() => handleStartChat(friend)}>
                    1대1 채팅
                </button>
            </li>
        ))}
    </ul>
</section>

            {/* 친구 요청 수락 및 거절 */}
            <section className="friend-requests-section card">
                <h3>친구 요청</h3>
                {friendRequests.length === 0 ? (
                    <p>친구 요청이 없습니다.</p>
                ) : (
                    <ul>
                        {friendRequests.map((request, index) => (
                            <li key={index} className="friend-request-item">
                                <span>{request}</span>
                                <div className="buttons-container">
                                    <button
                                        className="accept-button"
                                        onClick={() => {
                                            setFriends([...friends, request]);
                                            setFriendRequests(friendRequests.filter((r) => r !== request));
                                            alert(`${request}님을 친구로 추가했습니다.`);
                                        }}
                                    >
                                        수락
                                    </button>
                                    <button
                                        className="reject-button"
                                        onClick={() => {
                                            setFriendRequests(friendRequests.filter((r) => r !== request));
                                            alert(`${request}님의 친구 요청을 거절했습니다.`);
                                        }}
                                    >
                                        거절
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 로그아웃 및 회원탈퇴 */}
            <section className="logout-section card">
                <button className="small-button logout-button" onClick={handleLogout}>로그아웃</button>
                <button className="small-button delete-account-button" onClick={handleAccountDeletion}>
                    회원탈퇴
                </button>
            </section>
        </div>
    );
};

export default MyPage;
