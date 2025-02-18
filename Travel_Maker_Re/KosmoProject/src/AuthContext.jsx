import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

  // ✅ 서버에서 로그인 상태 확인 (쿠키 기반)
  useEffect(() => {
    fetch("http://localhost:8586/api/user/me", {
      method: "GET",
      credentials: "include", // ✅ 쿠키 포함 요청
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.email) {
          console.log("✅ 로그인 상태 유지됨:", data);
          setUser({ email: data.email, nickname: data.nickname });
        } else {
          console.log("❌ 로그인 정보 없음");
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("로그인 상태 확인 중 오류 발생:", error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // ✅ 로딩 상태 해제
      });
  }, []);

  // ✅ 로그인 (Context에 저장)
  const login = (userData) => {
    setUser(userData);
  };

  // ✅ 로그아웃 (Context & 쿠키 삭제)
  const logout = () => {
    setUser(null);
    fetch("http://localhost:8586/api/user/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => console.log("✅ 로그아웃 완료"));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context를 사용하기 위한 Hook
export const useAuth = () => useContext(AuthContext);
