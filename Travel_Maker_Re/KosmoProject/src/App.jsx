import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// 공통 컴포넌트
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";

// 여행 관련 컴포넌트
import HomePage from "./pages/HomePage";
import MyPage from "./Pages/Mypage";
import EditProfile from "./pages/EditProfile";
import TravelList from "./components/TravelList";
import TravelDetail from "./components/TravelDetail";
import CreateTripPage from "./Pages/CreateTripPage";
import PlanTripPage from "./Pages/PlanTripPage";
import ALHomePage from "./pages/ALHomePage";

// 로그인 & 회원가입 관련 컴포넌트
import LoginPage from "./pages/LoginPage";

import IDLoginPage from "./Pages/IDLoginPage";
import SignupAgreement from "./pages/SignupAgreement";
import Signup from "./Pages/Signup";
import FindPwd from "./pages/FindPwd";
import PwdNext from "./pages/PwdNext";
import ResetPwd from "./pages/ResetPwd";

// 게시판 관련 컴포넌트
import ReviewPage from './Pages/boards/review/ReviewPage';
import ReviewWritePage from "./Pages/boards/review/ReviewWritePage";
import ReviewViewPage from './Pages/boards/review/ReviewViewPage';
import ReviewEditPage from './Pages/boards/review/ReviewEditPage';
import NoticePage from './Pages/boards/notice/NoticePage';
import NoticeWritePage from "./Pages/boards/notice/NoticeWritePage";
import NoticeViewPage from './Pages/boards/notice/NoticeViewPage';
import NoticeEditPage from './Pages/boards/notice/NoticeEditPage';
import QnaPage from './Pages/boards/qna/QnaPage';
import QnaViewPage from './Pages/boards/qna/QnaViewPage';
import QnaWritePage from "./Pages/boards/qna/QnaWritePage";
import QnaEditPage from "./Pages/boards/qna/QnaEditPage";

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // 현재 페이지 경로 가져오기

    // ✅ 헤더 & 사이드 메뉴를 숨길 경로 설정 (동적 파라미터 포함)
    const hideHeaderRegex = /^\/plan-trip(\/\d+)?$/;

    return (
        <>
            {/* 📌 특정 경로에서는 헤더 & 사이드메뉴 숨김 */}
            {!hideHeaderRegex.test(location.pathname) && <Header toggleMenu={setIsMenuOpen} />}
            {!hideHeaderRegex.test(location.pathname) && <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

            <Routes>
                {/* 여행 관련 라우트 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/trips" element={<TravelList />} />
                <Route path="/trips/:tripId" element={<TravelDetail />} /> {/* ✅ tripId 일관성 유지 */}
                <Route path="/create-trip" element={<CreateTripPage />} />
                <Route path="/plan-trip/:tripId" element={<PlanTripPage />} /> {/* 헤더 없이 표시됨 */}

                {/* 로그인 및 회원가입 라우트 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/id-login" element={<IDLoginPage />} />
                <Route path="/signup-agreement" element={<SignupAgreement />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/findpwd" element={<FindPwd />} />
                <Route path="/pwd-next" element={<PwdNext />} />
                <Route path="/resetpwd" element={<ResetPwd />} />

                {/* 게시판 관련 라우트 */}
                <Route path="/reviewboard" element={<ReviewPage />} />
                <Route path="/reviewboard/write" element={<ReviewWritePage />} />
                <Route path="/reviewboard/:board_idx" element={<ReviewViewPage />} />
                <Route path="/reviewboard/edit/:board_idx" element={<ReviewEditPage />} />
                <Route path="/noticeboard" element={<NoticePage />} />
                <Route path="/noticeboard/write" element={<NoticeWritePage />} />
                <Route path="/noticeboard/:board_idx" element={<NoticeViewPage />} />
                <Route path="/noticeboard/edit/:board_idx" element={<NoticeEditPage />} />
                <Route path='/qnaboard' element={<QnaPage />} />
                <Route path='/qnaboard/:board_idx' element={<QnaViewPage />} />
                <Route path="/qnaboard/edit/:board_idx" element={<QnaEditPage />} />
                <Route path='/qnaboard/write' element={<QnaWritePage />} />

                {/* ✅ ALHomePage 경로 추가 */}
                <Route path="/main" element={<ALHomePage />} />
            </Routes>
        </>
    );
};

const AppWrapper = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default AppWrapper;
