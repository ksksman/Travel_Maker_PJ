import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 공통 컴포넌트
import Header from './components/Header';
import SideMenu from './components/SideMenu';

// 여행 관련 컴포넌트
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import EditProfile from './pages/EditProfile';
import TravelList from './components/TravelList';
import TravelDetail from './components/TravelDetail';
import CreateTripPage from './pages/CreateTripPage';
import PlanTripPage from "./pages/PlanTripPage";
import ALHomePage from './pages/ALHomePage';  // ALHomePage 추가

// 로그인 & 회원가입 관련 컴포넌트
import LoginPage from './pages/LoginPage';
import IDLoginPage from './pages/IDLoginPage';
import SignupAgreement from './pages/SignupAgreement';
import Signup from './pages/Signup';
import FindPwd from './pages/FindPwd';
import PwdNext from './pages/PwdNext';
import ResetPwd from './pages/ResetPwd';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <Header toggleMenu={toggleMenu} />
            <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <Routes>
                {/* 여행 관련 라우트 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/trips" element={<TravelList />} />
                <Route path="/trips/:id" element={<TravelDetail />} />
                <Route path="/create-trip" element={<CreateTripPage />} />
                <Route path="/plan-trip" element={<PlanTripPage />} />

                {/* 로그인 및 회원가입 라우트 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/id-login" element={<IDLoginPage />} />
                <Route path="/signup-agreement" element={<SignupAgreement />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/findpwd" element={<FindPwd />} />
                <Route path="/pwd-next" element={<PwdNext />} />
                <Route path="/resetpwd" element={<ResetPwd />} />

                {/* 로그인 후 메인 페이지 라우트 */}
                <Route path="/ALHomePage" element={<ALHomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
