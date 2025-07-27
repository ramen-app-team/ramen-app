# Node.jsベースイメージ
FROM node:24-alpine

# pnpmをグローバルにインストール
RUN npm install -g pnpm @expo/cli @expo/ngrok

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpnpm-lock.yamlをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 依存関係をインストール
RUN pnpm install

# アプリケーションコードをコピー
COPY . .

# Expo Metro Bundlerのポートを公開
EXPOSE 19000
EXPOSE 19001
EXPOSE 8081

# コマンドはdocker-compose.ymlで指定