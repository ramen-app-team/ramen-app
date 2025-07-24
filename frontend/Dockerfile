# Node.jsベースイメージ
FROM node:24-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとyarn.lock/package-lock.jsonをコピー
COPY package.json yarn.lock* ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# Expo Metro Bundlerのポートを公開
EXPOSE 19000
EXPOSE 19001
EXPOSE 8081

# コマンドはdocker-compose.ymlで指定