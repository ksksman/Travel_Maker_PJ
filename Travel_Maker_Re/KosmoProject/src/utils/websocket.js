import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 🔹 WebSocket 서버 주소 설정
const SOCKET_URL = "http://localhost:8586/ws"; // 백엔드 WebSocket 엔드포인트

// 🔹 STOMP 클라이언트 생성 함수
export const createWebSocketClient = (onMessageReceived) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL), // SockJS를 사용하여 WebSocket 연결
        reconnectDelay: 5000, // 연결이 끊어졌을 경우 5초 후 재연결
        debug: (str) => console.log(str), // 디버깅 로그 출력
        onConnect: () => {
            console.log("✅ WebSocket 연결 성공");
            client.subscribe("/topic/chat", (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log("📩 받은 메시지:", receivedMessage);
                onMessageReceived(receivedMessage);
            });
        }
    });

    return client;
};
