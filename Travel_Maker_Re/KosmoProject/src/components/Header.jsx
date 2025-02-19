import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // ✅ 로그인 상태 가져오기

const Header = ({ toggleMenu }) => {
    const { user, logout } = useAuth(); // ✅ 로그인 상태 확인

    return (
        <header>
            <div className="logo-container">
                <button className="menu-button" onClick={toggleMenu}>
                    ☰
                </button>
                <Link to="/">
                    <img src="/images/logo.png" alt="Travel Maker 로고" className="logo" />
                </Link>
            </div>
            <div className="header-content">
                <h1 className="logo-text">TRAVEL MAKER</h1>
                <p className="header-subtext">함께 떠나는 랜선 여행, 그리고 더 많은 여행 이야기들.</p>
            </div>

            {/* ✅ 로그인 상태에 따라 UI 변경 */}
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/mypage">{user.nickname} 님</Link> {/* ✅ 로그인 시 마이페이지 표시 */}
                        <button onClick={logout} className="logout-button">로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup-agreement">회원가입</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
