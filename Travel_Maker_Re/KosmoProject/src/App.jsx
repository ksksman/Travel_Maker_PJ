import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';  // MyPage.jsx를 import
import EditProfile from './Pages/Editprofile';  // EditProfile.jsx 추가

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
                <Route path="/" element={<HomePage />} />
                <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 라우트 */}
                <Route path="/edit-profile" element={<EditProfile />} /> {/* 개인정보 수정 라우트 */}
            </Routes>
        </Router>
    );
};

export default App;
