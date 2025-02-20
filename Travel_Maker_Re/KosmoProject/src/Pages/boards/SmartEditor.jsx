import React, { useEffect } from "react";

const SmartEditor = ({ setContent }) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/public/smarteditor/js/HuskyEZCreator.js"; // ✅ 에디터 JS 파일 로드
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.nhn && window.nhn.husky && window.nhn.husky.EZCreator) {
                window.nhn.husky.EZCreator.createInIFrame({
                    oAppRef: window.oEditor,
                    elPlaceHolder: "editor",
                    sSkinURI: "/public/smarteditor/SmartEditor2Skin.html", // ✅ 스마트에디터 HTML 경로 설정
                    fCreator: "createSEditor2"
                });
            }
        };
    }, []);

    // ✅ 에디터 내용 저장
    const handleSubmit = () => {
        window.oEditor.getById["editor"].exec("UPDATE_CONTENTS_FIELD", []); // ✅ 내용 동기화
        const editorContent = document.getElementById("editor").value;
        setContent(editorContent);
    };

    return (
        <div>
            {/* ✅ 에디터 텍스트 박스 */}
            <textarea id="editor" name="editor" rows="10" cols="100"></textarea>
            
            {/* ✅ 저장 버튼 */}
            <button onClick={handleSubmit}>저장</button>
        </div>
    );
};

export default SmartEditor;
