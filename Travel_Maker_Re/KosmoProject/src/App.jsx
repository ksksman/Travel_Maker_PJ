import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';  // MyPage.jsx를 import
import EditProfile from './Pages/Editprofile';  // EditProfile.jsx 추가
import TravelList from './components/TravelList';  // ✅ 여행 목록 추가
import TravelDetail from './components/TravelDetail';
import CreateTripPage from './Pages/CreateTripPage';

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
                <Route path="/trips" element={<TravelList />} /> {/* ✅ 여행 목록 */}
                <Route path="/trips/:id" element={<TravelDetail />} />
                <Route path="/create-trip" element={<CreateTripPage />} />
            </Routes>
        </Router>
    );
};

export default App;
