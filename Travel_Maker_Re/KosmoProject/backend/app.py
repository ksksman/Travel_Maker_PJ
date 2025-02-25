import os
import pandas as pd
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_FOLDER = "data"

def get_tourist_data(age_group):
    all_data = []
    print(f"📂 요청된 연령대: {age_group}대")
    
    files = os.listdir(DATA_FOLDER)
    print(f"📁 data 폴더 내 파일 목록: {files}")  # ✅ 파일 목록 출력하여 확인

    for file in files:
        # ✅ 파일명이 "세대별 인기관광지_20대.csv" 형식일 경우, 괄호 없이 체크
        if file.endswith(".csv") and f"{age_group}대" in file:
            file_path = os.path.join(DATA_FOLDER, file)
            print(f"📖 파일 읽는 중: {file_path}")

            try:
                # 🔹 여러 인코딩 방식으로 파일을 읽기
                try:
                    df = pd.read_csv(file_path, encoding="utf-8")  # UTF-8로 읽기 시도
                except UnicodeDecodeError:
                    try:
                        df = pd.read_csv(file_path, encoding="cp949")  # CP949(Windows)로 읽기 시도
                    except UnicodeDecodeError:
                        df = pd.read_csv(file_path, encoding="utf-8-sig")  # UTF-8-SIG로 읽기
                
                print(df.head())  # ✅ 데이터의 첫 5줄 출력
                
                df["연령대"] = f"{age_group}대"  # ✅ 연령대 컬럼 추가
                all_data.append(df)

            except Exception as e:
                print(f"❌ 파일 읽기 오류: {file_path} - {str(e)}")

    if all_data:
        final_df = pd.concat(all_data, ignore_index=True)
        return final_df.to_dict(orient="records")
    else:
        print(f"⚠️ {age_group}대 데이터 없음.")
        return []

@app.route("/api/tourist-data/<age_group>")
def tourist_data(age_group):
    try:
        data = get_tourist_data(age_group)
        return app.response_class(
            response=json.dumps(data, ensure_ascii=False),
            mimetype="application/json"
        )
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
