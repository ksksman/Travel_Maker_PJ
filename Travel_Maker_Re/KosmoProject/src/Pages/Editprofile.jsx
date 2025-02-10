import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 프로필 데이터 가져오기
    const profile = location.state?.profile || { name: '', email: '' };

    // 상태 설정
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = () => {
        if (name.trim() === '' || email.trim() === '') {
            alert('닉네임과 이메일은 필수입니다.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setErrorMessage('');
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);

        // 여기에 서버나 상태 관리에 변경 내용을 반영하는 로직 추가 가능
        alert('개인정보가 성공적으로 변경되었습니다.');

        navigate('/mypage', { state: { profile: { ...profile, name, email } } });
    };

    return (
        <div className="edit-profile-page">
            <h1 className="page-title">개인정보 수정</h1>
            <div className="form-container">
                <div className="form-group">
                    <label htmlFor="name">닉네임</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="current-password">현재 비밀번호</label>
                    <input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-input"
                        placeholder="현재 비밀번호"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">새 비밀번호</label>
                    <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input"
                        placeholder="새 비밀번호"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">비밀번호 확인</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                        placeholder="비밀번호 확인"
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="save-button" onClick={handleSave}>
                    저장
                </button>
                {isSaved && <p className="success-message">저장되었습니다!</p>}
            </div>
        </div>
    );
};

export default EditProfile;
