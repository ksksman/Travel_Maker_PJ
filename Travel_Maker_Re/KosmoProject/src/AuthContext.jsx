import { createContext, useState, useContext, useEffect } from "react";

// AuthContext 생성
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 로그인 상태 확인 (일반 로그인 & SNS 로그인)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // ✅ 일반 로그인 & SNS 로그인 API 병렬 요청
        const [userResponse, oauthResponse] = await Promise.allSettled([
          fetch("http://localhost:8586/api/user/me", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("http://localhost:8586/auth/me", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        // ✅ 1) SNS 로그인이 성공하면 우선적으로 설정
        if (oauthResponse.status === "fulfilled" && oauthResponse.value.ok) {
          const oauthData = await oauthResponse.value.json();
          if (oauthData.nickname) {
            console.log("✅ [SNS 로그인] 유지됨:", oauthData);
            setUser({
              email: oauthData.providerUserId + "@kakao.com",
              nickname: oauthData.nickname,
              authType: "kakao",
            });
            return;
          }
        }

        // ✅ 2) 일반 로그인 확인 (SNS 로그인이 실패한 경우)
        if (userResponse.status === "fulfilled" && userResponse.value.ok) {
          const userData = await userResponse.value.json();
          if (userData.email) {
            console.log("✅ [기본 로그인] 유지됨:", userData);
            setUser({ email: userData.email, nickname: userData.nickname, authType: "local" });
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

  // ✅ 로그아웃 (일반 & SNS 로그아웃 처리)
  const logout = async () => {
    try {
      console.log("🔹 로그아웃 요청 시작");
  
      // 로그아웃 요청
      await Promise.allSettled([
        fetch("http://localhost:8586/api/user/logout", { method: "POST", credentials: "include" }),
        fetch("http://localhost:8586/auth/logout", { method: "POST", credentials: "include" }),
      ]);
  
      console.log("✅ 로그아웃 완료: 세션 제거 시작");
  
      // 1️⃣ 사용자 상태 초기화
      setUser(null);
  
      // 2️⃣ localStorage & sessionStorage 삭제
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.clear();
  
      // 3️⃣ 모든 쿠키 삭제 (자동 로그인 방지)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
  
      // 4️⃣ UI 강제 업데이트 (새로고침)
      setTimeout(() => {
        window.location.href = "/login";  // 로그인 페이지로 이동
      }, 100);
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
