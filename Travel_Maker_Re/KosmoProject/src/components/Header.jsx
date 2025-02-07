import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ toggleMenu }) => {
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
            <div className="nav-links">
                <Link to="/login">로그인</Link>
                <Link to="/register">회원가입</Link>
            </div>
        </header>
    );
};

export default Header;
