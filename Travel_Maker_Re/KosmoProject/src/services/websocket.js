import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// WebSocket 서버 주소 설정
const SOCKET_URL = "http://localhost:8586/ws"; // Spring Boot WebSocket 엔드포인트

// WebSocket 클라이언트 생성 함수
export const createWebSocketClient = (onMessageReceived) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL), // SockJS를 사용하여 WebSocket 연결
        reconnectDelay: 5000, // 연결이 끊어지면 5초 후 재연결
        debug: (str) => console.log(str), // 디버깅 로그
        onConnect: () => {
            console.log("✅ WebSocket 연결 성공");

            // 메시지 수신 구독
            client.subscribe("/topic/chat", (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log("📩 받은 메시지:", receivedMessage);
                onMessageReceived(receivedMessage);
            });
        }
    });

    return client;
};
