# Pythonベースイメージ
FROM python:3.9-slim-buster

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# ポートを公開 (オプション、Docker Composeでポートマッピングするので必須ではないが、情報として)
EXPOSE 8000

# コマンドはdocker-compose.ymlで指定