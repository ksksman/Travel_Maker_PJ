if (typeof global === "undefined") {
    window.global = window;
}

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import "../App.css";

const MyPage = () => {
    const { userId } = useParams();
    const currentUserId = userId ? parseInt(userId, 10) : 59;
    const navigate = useNavigate();

    // ✅ 사용자 프로필
    const [profile, setProfile] = useState({
        name: "뺵곰",
        email: "travelisgood@naver.com",
        mapCount: 10,
        travelLevel: "Explorer",
        points: 1500,
        profilePicture: "/images/default-profile.webp",
    });

    // ✅ 친구 목록 및 상태 관리
    const [friends, setFriends] = useState([]); 
    const [friendRequests, setFriendRequests] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); // 🔹 입력된 아이디 (검색어)
    const [requestStatus, setRequestStatus] = useState(null); // 🔹 요청 결과 메시지


    // ✅ 채팅 관련 상태
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState(null); // ✅ stompClient를 useState로 저장

    // ✅ 메시지 전송 중 여부 확인하는 상태 추가
const [isSending, setIsSending] = useState(false);

// ✅ 구독 ID를 저장할 state 추가
const [subscription, setSubscription] = useState(null);

useEffect(() => {
    const socket = new SockJS("http://localhost:8586/ws");
    const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log("✅ WebSocket 연결됨");

            // ✅ 기존 구독이 있으면 해제 후 새로 구독
            if (subscription) {
                console.log("🔄 기존 구독 해제");
                subscription.unsubscribe();
            }

            const newSubscription = client.subscribe("/topic/chat", (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log("📩 받은 메시지:", receivedMessage);

                // ✅ 같은 메시지가 중복으로 추가되지 않도록 필터링
                setMessages((prevMessages) => {
                    if (!prevMessages.some(msg => msg.content === receivedMessage.content && msg.sender === receivedMessage.sender)) {
                        return [...prevMessages, receivedMessage];
                    }
                    return prevMessages;
                });
            });

            setSubscription(newSubscription); // ✅ 새 구독 저장
            setStompClient(client);
        },
        onDisconnect: () => {
            console.warn("⚠️ WebSocket 연결 종료됨");
            if (subscription) {
                subscription.unsubscribe();
                setSubscription(null);
            }
            setStompClient(null);
        },
    });

    client.activate();

    return () => {
        console.log("🔻 WebSocket 해제");
        if (subscription) {
            subscription.unsubscribe(); // ✅ 기존 구독 해제
            setSubscription(null);
        }
        client.deactivate();
        setStompClient(null);
    };
}, []);

    // ✅ 친구 목록 불러오기
    useEffect(() => {
        fetch(`http://localhost:8586/api/friends/list?userId=${currentUserId}`)
            .then((response) => response.json())
            .then((data) => {
                const acceptedFriends = data.filter(
                    (friend) => friend.status && friend.status.toUpperCase() === "ACCEPTED"
                );
                setFriends(acceptedFriends);
            })
            .catch((error) => console.error("❌ 친구 목록 불러오기 오류:", error));
    }, [currentUserId]);

    // ✅ 친구 요청 목록 불러오기
    useEffect(() => {
        fetch(`http://localhost:8586/api/friends/requests?userId=${currentUserId}`)
            .then((response) => response.json())
            .then((data) => {
                const pendingRequests = data.filter(request => request.status === "PENDING");
                setFriendRequests(pendingRequests);
            })
            .catch(error => console.error("❌ 친구 요청 불러오기 오류:", error));
    }, [currentUserId]);

    // ✅ 1:1 채팅 창 열기
    const openChat = (friend) => {
        setSelectedFriend(friend);
        setChatOpen(true);
    };

       // ✅ 메시지 전송 함수 (중복 실행 방지 추가)
       const sendMessage = () => {
        if (!stompClient || !selectedFriend || isSending || newMessage.trim() === "") return;
    
        setIsSending(true); 
    
        const chatMessage = {
            sender: currentUserId,
            receiver: selectedFriend.requester?.userId !== currentUserId 
                ? selectedFriend.requester?.userId
                : selectedFriend.receiver?.userId,
            content: newMessage,
            type: "CHAT",
        };
    
        stompClient.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(chatMessage),
        });
    
        // ✅ WebSocket으로 받은 메시지를 다시 추가하지 않도록 변경
        setMessages((prevMessages) => {
            if (!prevMessages.some(msg => msg.content === chatMessage.content && msg.sender === chatMessage.sender)) {
                return [...prevMessages, chatMessage];
            }
            return prevMessages;
        });
    
        setNewMessage("");
        setTimeout(() => setIsSending(false), 500);
    };
    
    // ✅ 친구 요청 수락 (친구 목록 추가)
    const acceptFriendRequest = (requestId) => {
        fetch(`http://localhost:8586/api/friends/${requestId}/accept`, {  // 🔥 URL 수정
            method: "PATCH",  // 🔥 PATCH 요청으로 변경
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            alert("✅ 친구 요청을 수락했습니다!");

            // ✅ 친구 요청 목록에서 제거
            setFriendRequests((prevRequests) => prevRequests.filter(request => request.requestId !== requestId));
            
            // ✅ 친구 목록에 추가
            fetch(`http://localhost:8586/api/friends/list?userId=${currentUserId}`)
                .then((response) => response.json())
                .then((data) => {
                    const acceptedFriends = data.filter(friend => friend.status.toUpperCase() === "ACCEPTED");
                    setFriends(acceptedFriends);  // ✅ 친구 목록 업데이트
                })
                .catch((error) => console.error("❌ 친구 목록 업데이트 오류:", error));
        })
        .catch((error) => console.error("❌ 친구 요청 수락 오류:", error));
       
    };
    
    const rejectFriendRequest = (requestId) => {
        fetch(`http://localhost:8586/api/friends/${requestId}/reject`, {  // 🔥 URL 수정
            method: "PATCH",  // 🔥 PATCH 요청으로 변경
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            alert("❌ 친구 요청을 거절했습니다!"); 

            // ✅ 친구 요청 목록에서 제거
            setFriendRequests((prevRequests) => prevRequests.filter(request => request.requestId !== requestId));
        })
        .catch((error) => console.error("❌ 친구 요청 거절 오류:", error));
    };
    
    // ✅ 친구 요청 보내기 함수
    const sendFriendRequest = () => {
        if (!searchTerm.trim()) {
            alert("❌ 아이디를 입력하세요!");
            return;
        }
        fetch("http://localhost:8586/api/friends/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requesterId: currentUserId, // 현재 로그인한 사용자 ID
                receiverNickname: searchTerm, // 입력한 닉네임
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            setRequestStatus(data.message);
            alert(data.message); // ✅ 성공/실패 메시지 표시
        })
        .catch((error) => console.error("❌ 친구 요청 오류:", error));
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
            </div>

            {/* 🔹 친구 추가 */}
<section className="friend-request-section">
    <h3>친구 추가</h3>
    <div className="search-bar">
        <input
            type="text"
            placeholder="닉네임 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={sendFriendRequest}>친구 요청 보내기</button>
    </div>
    {requestStatus && <p className="request-status-message">{requestStatus}</p>}
</section>


            {/* 🔹 친구 목록 */}
            <section className="friend-list-container">
                <h3>친구 목록</h3>
                <ul>
                    {friends.length > 0 ? (
                        friends.map((friend) => {
                            // 요청자가 현재 사용자가 아닐 경우 상대방 닉네임을 가져옴
                            const friendNickname =
                                friend.requester?.userId !== currentUserId
                                    ? friend.requester?.nickname
                                    : friend.receiver?.nickname;
                            const friendId =
                                friend.requester?.userId !== currentUserId
                                    ? friend.requester?.userId
                                    : friend.receiver?.userId;

                            return (
                                <li key={friendId} className="friend-list-item">
                                    <div className="friend-info">
                                        <span className="friend-nickname">{friendNickname}</span>
                                    </div>
                                    <button className="chat-button" onClick={() => openChat(friend)}>
                                        💬 1:1 채팅
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <li>친구가 없습니다.</li>
                    )}
                </ul>
            </section>

            {/* 🔹 채팅창 */}
            {chatOpen && selectedFriend && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>
                            {/* ✅ 선택된 친구 닉네임이 올바르게 표시되도록 수정 */}
                            {(selectedFriend.requester?.userId !== currentUserId
                                ? selectedFriend.requester?.nickname
                                : selectedFriend.receiver?.nickname) || "알 수 없는 사용자"}{" "}
                            님과의 채팅
                        </h3>
                        <button onClick={() => setChatOpen(false)}>❌</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.sender === currentUserId ? "my-message" : "other-message"}`}
                            >
                                <strong>{msg.sender === currentUserId ? "나" : selectedFriend.nickname}:</strong> {msg.content}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            )}



            {/* 🔹 친구 요청 목록 */}
            <section className="my-page-section">
            <h3>친구 요청</h3>
                <ul>
                    {friendRequests.length > 0 ? (
                        friendRequests.map((request) => (
                            <li key={request.requestId}>
                                {request.requesterNickname}님
                                <div className="friend-request-buttons">
                                    <button onClick={() => acceptFriendRequest(request.requestId)}>✅ 수락</button>
                                    <button onClick={() => rejectFriendRequest(request.requestId)}>❌ 거절</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>친구 요청이 없습니다.</li>
                    )}
                </ul>
            </section>

            {/* 🔹 로그아웃 & 회원탈퇴 */}
            <section className="account-actions-section">
                <button className="logout-btn" onClick={() => alert("로그아웃 완료")}>🚪 로그아웃</button>
                <button className="delete-account-btn" onClick={() => alert("회원탈퇴 완료")}>❌ 회원탈퇴</button>
            </section>

            
        </div>
    );
};

export default MyPage;
