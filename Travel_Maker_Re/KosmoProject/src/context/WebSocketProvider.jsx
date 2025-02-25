import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8586/ws"); // 🔥 백엔드 WebSocket 서버 주소
        setSocket(ws);

        ws.onopen = () => {
            console.log("✅ WebSocket 연결됨!");
        };

        ws.onmessage = (event) => {
            console.log("📩 WebSocket 메시지 수신:", event.data);
            setMessage(JSON.parse(event.data)); // JSON 데이터 파싱 후 상태 업데이트
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket 오류 발생:", error);
        };

        ws.onclose = () => {
            console.log("⚠️ WebSocket 연결 종료됨.");
        };

        return () => {
            ws.close(); // 컴포넌트 언마운트 시 WebSocket 연결 해제
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ message, socket }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket은 WebSocketProvider 내부에서 사용해야 합니다.");
    }
    return context;
};
