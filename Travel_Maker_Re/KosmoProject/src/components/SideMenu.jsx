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
                <li><Link to="/trips" onClick={closeMenu}>내 여행</Link></li>
                <li><Link to="/create-trip" onClick={closeMenu}>여행만들기</Link></li>
            </ul>
            <hr />
            <ul>
                <li><Link to="/noticeboard" onClick={closeMenu}>공지사항</Link></li>
                <li><Link to="/reviewboard" onClick={closeMenu}>후기 게시판</Link></li>
                <li><Link to="/qnaboard" onClick={closeMenu}>질문 게시판</Link></li>

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
