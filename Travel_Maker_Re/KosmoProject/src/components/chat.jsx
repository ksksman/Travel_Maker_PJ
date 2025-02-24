import React, { useState, useEffect } from "react";
import { createWebSocketClient } from "../services/websocket"; // WebSocket 설정 파일 가져오기

const Chat = ({ selectedFriend }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedFriend) {
            const client = createWebSocketClient((receivedMessage) => {
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });

            client.activate();
            setStompClient(client);

            return () => client.deactivate(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
        }
    }, [selectedFriend]);

    const sendMessage = () => {
        if (stompClient && newMessage.trim() !== "") {
            const chatMessage = {
                sender: "나",
                receiver: selectedFriend.nickname,
                content: newMessage,
                type: "CHAT",
            };

            stompClient.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
            });

            setMessages((prevMessages) => [...prevMessages, chatMessage]);
            setNewMessage("");
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>{selectedFriend.nickname}님과의 채팅</h3>
                <button onClick={() => setSelectedFriend(null)}>❌</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender === "나" ? "my-message" : "other-message"}`}>
                        <strong>{msg.sender}:</strong> {msg.content}
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
    );
};

export default Chat;
