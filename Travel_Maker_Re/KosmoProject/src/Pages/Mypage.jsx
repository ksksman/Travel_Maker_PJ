import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
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

    const [chatRooms, setChatRooms] = useState(['부산 해운대 여행', '제주도 힐링 여행', '강릉 감성 여행']);
    const [friends, setFriends] = useState(['백건우', '윤웅희', '이강산']);
    const [friendRequests, setFriendRequests] = useState(['김용환', '이가희']);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    const handleEnterChatRoom = (roomName) => {
        alert(`"${roomName}" 지도를 출력합니다.`);
    };

    const handleStartChat = (friendName) => {
        alert(`${friendName}님과의 1대1 채팅을 시작합니다.`);
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

    const handleSearch = () => {
        // 예시 사용자 데이터 (실제 API 호출로 대체 가능)
        const sampleUsers = ['최민호', '박지은', '김용환', '이가희'];
        const results = sampleUsers.filter((user) => user.includes(searchTerm));
        setSearchResults(results);
    };

    const handleSendFriendRequest = (user) => {
        if (pendingRequests.includes(user)) {
            alert(`${user}님에게 이미 친구 요청을 보냈습니다.`);
            return;
        }

        // 친구 요청 전송 로직 (실제 API 호출로 대체 가능)
        setPendingRequests([...pendingRequests, user]);
        alert(`${user}님에게 친구 요청을 보냈습니다.`);
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
                <div className="settings-container" onClick={() => navigate('/edit-profile', { state: { profile } })}>
                    <FaCog className="settings-icon" />
                    <span className="settings-text">개인정보 수정</span>
                </div>
            </div>

            {/* 생성한 채팅 방 목록 */}
            <section className="my-page-section">
                <h3>나의 여행 목록</h3>
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

            {/* 친구 목록 */}
            <section className="my-page-section">
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

            {/* 친구 요청 섹션 */}
            <section className="my-page-section">
                <div className="section-header">
                    <h3>친구 요청</h3>
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="이름 검색"
                        />
                        <button onClick={handleSearch}>검색</button>
                    </div>
                </div>
                <ul className="friend-requests-list">
                    {friendRequests.map((request, index) => (
                        <li key={index} className="request-item">
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

                {/* 검색 결과 표시 */}
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h3>검색 결과</h3>
                        <ul>
                            {searchResults.map((result, index) => (
                                <li key={index}>
                                    <span>{result}</span>
                                    <button
                                        onClick={() => handleSendFriendRequest(result)}
                                        disabled={pendingRequests.includes(result)}
                                    >
                                        {pendingRequests.includes(result) ? '요청 중' : '친구 요청 보내기'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* 로그아웃 및 회원탈퇴 */}
            <section className="logout-section my-page-card">
                <button className="small-button logout-button" onClick={handleLogout}>
                    로그아웃
                </button>
                <button className="small-button delete-account-button" onClick={handleAccountDeletion}>
                    회원탈퇴
                </button>
            </section>
        </div>
    );
};

export default MyPage;
