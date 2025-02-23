import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import '../App.css';

const MyPage = () => {
    const { userId } = useParams();
    const currentUserId = userId ? parseInt(userId, 10) : 1; // 🔹 기본값 1 (숫자로 변환)

    // ✅ 사용자 프로필 (임시 데이터)
    const [profile, setProfile] = useState({
        name: "뺵곰",
        email: "travelisgood@naver.com",
        mapCount: 10,
        travelLevel: "Explorer",
        points: 1500,
        profilePicture: "/images/default-profile.webp",
    });

    // ✅ 상태 관리
    const [friends, setFriends] = useState([]); // 친구 목록
    const [friendRequests, setFriendRequests] = useState([]); // 친구 요청 목록
    const [searchTerm, setSearchTerm] = useState(""); // 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과

    // ✅ 친구 요청 목록 불러오기 (PENDING 상태)
    const fetchFriendRequests = () => {
        fetch(`http://localhost:8586/api/friends/requests?userId=${currentUserId}`)
            .then(response => response.json())
            .then(data => {
                console.log("✅ 불러온 친구 요청 목록:", data);
                // PENDING 상태만 필터링 (혹시라도 ACCEPTED가 포함되어 있다면 제외)
                const pendingRequests = data.filter(request => request.status === "PENDING");
                setFriendRequests(pendingRequests);
            })
            .catch(error => console.error("❌ 친구 요청 불러오기 오류:", error));
    };

    // ✅ 친구 목록 불러오기 (ACCEPTED 상태만 필터링)
    const fetchFriends = () => {
        fetch(`http://localhost:8586/api/friends/list?userId=${currentUserId}`)
            .then(response => response.json())
            .then(data => {
                console.log("✅ 불러온 친구 목록 데이터:", data);
    
                // 데이터를 배열 형태로 변환
                const friendsArray = Array.isArray(data) ? data : [];
    
                console.log("✅ 배열화된 친구 목록:", friendsArray);
    
                // 🔹 friendsArray 구조 확인 후 필터링 수정
                const acceptedFriends = friendsArray
                    .filter(friend => friend.status && friend.status.toUpperCase() === 'ACCEPTED');
    
                console.log("✅ 필터링된 친구 목록:", acceptedFriends);
                setFriends(acceptedFriends);
            })
            .catch(error => console.error("❌ 친구 목록 불러오기 오류:", error));
    };
    
    // ✅ 초기 데이터 로드 (useEffect)
    useEffect(() => {
        console.log("🔍 현재 userId:", currentUserId);
        fetchFriendRequests();  // 친구 요청 목록 불러오기
        fetchFriends();         // 친구 목록 불러오기
    }, [currentUserId]);    

    // ✅ 친구 요청 수락 (요청 목록에서 제거 + 친구 목록 새로고침)
    const handleAcceptRequest = (requestId, username) => {
        fetch(`http://localhost:8586/api/friends/${requestId}/accept`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`❌ 친구 요청 수락 실패: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // ✅ 서버에서 받은 메시지 출력
    
            // ✅ 친구 요청 목록에서 제거
            setFriendRequests(prevRequests => prevRequests.filter(request => request.requestId !== requestId));
    
            // ✅ 친구 목록 다시 불러오기
            fetchFriends(); // 🔥 ACCEPTED된 친구 목록 다시 가져오기
        })
        .catch(error => console.error("❌ 친구 요청 수락 오류:", error));
    };
    
    // ✅ 친구 요청 거절 (요청 목록에서 즉시 제거)
    const handleRejectRequest = (requestId) => {
        fetch(`http://localhost:8586/api/friends/${requestId}/reject`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error(`❌ 친구 요청 거절 실패: ${response.status}`);
            return response.json();
        })
        .then(data => {
            alert(data.message); // ✅ 서버에서 받은 메시지 출력

            // ✅ 친구 요청 목록에서 제거 (즉시 반영)
            setFriendRequests(prev => prev.filter(request => request.requestId !== requestId));
        })
        .catch(error => console.error("❌ 친구 요청 거절 오류:", error));
    };

    // ✅ 사용자 검색
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8586/api/users/search?query=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("❌ 사용자 검색 오류:", error);
        }
    };

    // ✅ 친구 요청 보내기
    const handleSendRequest = (receiverId) => {
        fetch(`http://localhost:8586/api/friends/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requesterId: currentUserId, receiverId }),
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchFriendRequests(); // 요청 목록 업데이트
        })
        .catch(error => console.error("❌ 친구 요청 전송 오류:", error));
    };

    const handleLogout = () => {
        // ✅ 로컬 스토리지에서 토큰 삭제 후 로그인 페이지로 이동
        localStorage.removeItem("token");
        alert("로그아웃 되었습니다.");
        window.location.href = "/login"; // 로그인 페이지로 이동
    };
    
    const handleDeleteAccount = () => {
        if (window.confirm("정말로 회원탈퇴를 진행하시겠습니까?")) {
            fetch(`http://localhost:8586/api/users/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = "/login"; // 회원탈퇴 후 로그인 페이지로 이동
            })
            .catch(error => console.error("❌ 회원탈퇴 오류:", error));
        }
    };
    

    return (
        <div className="my-page">
            <h1>마이페이지</h1>
    
            {/* 🔹 프로필 카드 */}
            <div className="profile-card-container">
                <img src={profile.profilePicture} alt="프로필 사진" className="profile-picture" />
                <div className="profile-details">
                    <h2>{profile.name}</h2>
                    <p>{profile.email}</p>
                    <div className="stats">
                        <div><strong>지도 만든 횟수</strong><p>{profile.mapCount}</p></div>
                        <div><strong>회원 등급</strong><p>{profile.travelLevel}</p></div>
                        <div><strong>포인트</strong><p>{profile.points} P</p></div>
                    </div>
                </div>
                <div className="settings-container" onClick={() => navigate('/edit-profile', { state: { profile } })}>
                    <FaCog className="settings-icon" />
                    <span className="settings-text">개인정보 수정</span>
                </div>
            </div>
    
            {/* 🔹 친구 추가 (검색) */}
            <section className="friend-request-section">
                <h3>친구 추가</h3>
                <div className="search-bar">
                    <input type="text" placeholder="아이디 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button onClick={handleSearch}>검색</button>
                </div>
                <ul className="search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <li key={user.id}>
                                <span>{user.name}</span>
                                <button onClick={() => handleSendRequest(user.id)}>친구 요청</button>
                            </li>
                        ))
                    ) : (
                        <li>검색 결과가 없습니다.</li>
                    )}
                </ul>
            </section>
    
            {/* 🔹 친구 목록 */}
    <section className="friend-list-container">
        <h3 className="friend-list-title">친구 목록</h3>
        <ul className="friend-list">
            {friends.length > 0 ? (
                friends.map((friend) => {
                    const friendNickname =
                        friend.requester?.userId !== currentUserId
                            ? friend.requester?.nickname
                            : friend.receiver?.nickname;

                    return (
                        <li className="friend-item" key={friend.requestId}>
                            {friendNickname || "알 수 없는 사용자"}
                        </li>
                    );
                })
            ) : (
                <li className="friend-item">친구가 없습니다.</li>
            )}
        </ul>
    </section>


            {/* 🔹 친구 요청 목록 */}
            <section className="my-page-section">
                <h3>친구 요청</h3>
                <ul className="friend-requests-list">
                    {friendRequests.length > 0 ? (
                        friendRequests.map((request) => (
                            <li key={request.requestId}>
                                <span>{request.requesterNickname}님</span>
                                <div className="friend-buttons">
                                    <button className="accept-button" onClick={() => handleAcceptRequest(request.requestId, request.requesterNickname)}>✅ 수락</button>
                                    <button className="reject-button" onClick={() => handleRejectRequest(request.requestId)}>❌ 거절</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>친구 요청이 없습니다.</li>
                    )}
                </ul>
                </section>

        {/* 🔹 로그아웃 & 회원탈퇴 섹션 */}
        <section className="account-actions-section">
            <div className="account-actions">
                <button className="logout-btn" onClick={handleLogout}>🚪 로그아웃</button>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>❌ 회원탈퇴</button>
            </div>
        </section>
                </div>
            );
        };

export default MyPage;
