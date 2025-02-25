import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SideMenu = ({ isMenuOpen, setIsMenuOpen }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const closeMenu = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            setIsMenuOpen(false);
        }, 300);
    };

    useEffect(() => {
        const body = document.body;
        if (isMenuOpen) {
            body.classList.add('menu-open');
        } else {
            body.classList.remove('menu-open');
        }

        return () => body.classList.remove('menu-open');
    }, [isMenuOpen]);

    return (
        <div className={`side-menu ${isMenuOpen ? 'open' : ''} ${isAnimating ? 'closing' : ''}`}>
            <button className="close-button" onClick={closeMenu}>×</button>
            <div className="menu-header">
                <h2>Menu</h2>
            </div>
            <ul>
                <li><Link to="/trips" onClick={closeMenu}>일정 만들기</Link></li>
                <li><Link to="/schedule/load" onClick={closeMenu}>일정 불러오기</Link></li>
                <li><Link to="/schedule/share" onClick={closeMenu}>일정 공유하기</Link></li>
            </ul>
            <hr />
            <ul>
                <li><Link to="/notice" onClick={closeMenu}>Q&A 게시판</Link></li>
                <li><Link to="/board" onClick={closeMenu}>후기 게시판</Link></li>
            </ul>
            <hr />
            <ul>
                <li><Link to="/tourist" onClick={closeMenu}>연령대별 관광지 분석</Link></li>

            </ul>
            <hr />
            <ul>
                <li><Link to="/mypage" onClick={closeMenu}>마이페이지</Link></li>
            </ul>
        </div>
    );
};

export default SideMenu;
