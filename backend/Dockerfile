# Pythonベースイメージ
FROM python:3.9-slim-bullseye
# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# アプリケーションコードをコピー
COPY . .

# ポートを公開 (オプション、Docker Composeでポートマッピングするので必須ではないが、情報として)
EXPOSE 8000

# コマンドはdocker-compose.ymlで指定