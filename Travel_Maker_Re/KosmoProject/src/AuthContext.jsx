import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

  // ✅ 서버에서 로그인 상태 확인 (SNS & 일반 로그인)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // ✅ 1) 일반 로그인 (`/api/user/me`)
        const userResponse = await fetch("http://localhost:8586/api/user/me", {
          method: "GET",
          credentials: "include", // ✅ 쿠키 포함 요청
          headers: { "Content-Type": "application/json" },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.email) {
            console.log("✅ [기본 로그인] 유지됨:", userData);
            setUser({ email: userData.email, nickname: userData.nickname });
            return;
          }
        }

        // ✅ 2) SNS 로그인 (`/auth/me`)
        const oauthResponse = await fetch("http://localhost:8586/auth/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (oauthResponse.ok) {
          const oauthData = await oauthResponse.json();
          if (oauthData.nickname) {
            console.log("✅ [SNS 로그인] 유지됨:", oauthData);
            setUser({ email: oauthData.providerUserId + "@kakao.com", nickname: oauthData.nickname });
            return;
          }
        }

        console.log("❌ 로그인 정보 없음");
        setUser(null);
      } catch (error) {
        console.error("🚨 로그인 상태 확인 중 오류 발생:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // ✅ 로그인 (Context에 저장)
  const login = (userData) => {
    setUser(userData);
  };

 // ✅ 로그아웃 (일반 로그인 & SNS 로그인 모두 처리)
const logout = async () => {
  try {
    // ✅ 일반 로그인 로그아웃 호출
    await fetch("http://localhost:8586/api/user/logout", {
      method: "POST",
      credentials: "include",
    });

    // ✅ SNS 로그인 로그아웃 호출
    await fetch("http://localhost:8586/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    console.log("✅ 로그아웃 완료 (기본 & SNS)");
    setUser(null);
    localStorage.clear(); // ✅ 로컬스토리지 초기화
    sessionStorage.clear(); // ✅ 세션스토리지 초기화

    // ✅ 쿠키 삭제 (클라이언트에서 직접 삭제)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    window.location.href = "/login"; // ✅ 로그인 페이지로 이동
  } catch (error) {
    console.error("🚨 로그아웃 중 오류 발생:", error);
  }
};

  

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context를 사용하기 위한 Hook
export const useAuth = () => useContext(AuthContext);
