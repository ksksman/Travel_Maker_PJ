import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const SignupAgreement = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });
  const [expandedItems, setExpandedItems] = useState({
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const navigate = useNavigate();

  const handleAllCheck = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setCheckedItems({
      terms: newValue,
      privacy: newValue,
      age: newValue,
      marketing: newValue,
    });
    setExpandedItems({
      terms: newValue,
      privacy: newValue,
      age: newValue,
      marketing: newValue,
    });
  };

  const handleSingleCheck = (key) => {
    setCheckedItems({
      ...checkedItems,
      [key]: !checkedItems[key],
    });
    setExpandedItems({
      ...expandedItems,
      [key]: !expandedItems[key],
    });
  };

  const canProceed = checkedItems.terms && checkedItems.privacy && checkedItems.age;

  return (
    <div className="app-container">
      <div className="card">
        <img src="/travel_maker.png" alt="Travel Maker Logo" className="logo" />
        <h2>약관 동의</h2>
        <hr />
        <div>
          <label>
            <input type="checkbox" checked={allChecked} onChange={handleAllCheck} />
            약관 전체 동의
          </label>
        </div>
        <hr />
        <div className="agreement-container">
          <div className="checkbox-group">
            <div className="checkbox-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkedItems.terms}
                  onChange={() => handleSingleCheck("terms")}
                />
                이용 약관 동의 <span className="required">(필수)</span>
              </label>
              {expandedItems.terms && (
                <div className="agreement-details">
                  이용 약관에 대한 세부 내용이 여기에 표시됩니다.
                </div>
              )}
            </div>
            <div className="checkbox-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkedItems.privacy}
                  onChange={() => handleSingleCheck("privacy")}
                />
                개인정보 수집 및 이용 동의 <span className="required">(필수)</span>
              </label>
              {expandedItems.privacy && (
                <div className="agreement-details">
                  개인정보 수집 및 이용에 대한 세부 내용이 여기에 표시됩니다.
                </div>
              )}
            </div>
            <div className="checkbox-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkedItems.age}
                  onChange={() => handleSingleCheck("age")}
                />
                만 14세 이상 확인 <span className="required">(필수)</span>
              </label>
              {expandedItems.age && (
                <div className="agreement-details">
                  만 14세 이상 확인에 대한 세부 내용이 여기에 표시됩니다.
                </div>
              )}
            </div>
            <div className="checkbox-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkedItems.marketing}
                  onChange={() => handleSingleCheck("marketing")}
                />
                마케팅 수신 동의 <span className="optional">(선택)</span>
              </label>
              {expandedItems.marketing && (
                <div className="agreement-details">
                  마케팅 수신 동의에 대한 세부 내용이 여기에 표시됩니다.
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          className={`button next ${canProceed ? "active" : "disabled"}`}
          disabled={!canProceed}
          onClick={() => navigate("/signup")}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SignupAgreement;
