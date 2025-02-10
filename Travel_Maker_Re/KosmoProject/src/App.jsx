import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 공통 컴포넌트
import Header from './components/Header';
import SideMenu from './components/SideMenu';

// 첫 번째 프로젝트 컴포넌트
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import EditProfile from './pages/EditProfile';
import TravelList from './components/TravelList';
import TravelDetail from './components/TravelDetail';

// 두 번째 프로젝트 컴포넌트
import LoginPage from './Pages/LoginPage';
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
            {/* 공통 Header와 SideMenu */}
            <Header toggleMenu={toggleMenu} />
            <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <Routes>
                {/* 첫 번째 프로젝트 라우트 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/trips" element={<TravelList />} />
                <Route path="/trips/:id" element={<TravelDetail />} />

                {/* 두 번째 프로젝트 라우트 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/id-login" element={<IDLoginPage />} />
                <Route path="/signup-agreement" element={<SignupAgreement />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/findpwd" element={<FindPwd />} />
                <Route path="/pwd-next" element={<PwdNext />} />
                <Route path="/resetpwd" element={<ResetPwd />} />
            </Routes>
        </Router>
    );
};

export default App;
