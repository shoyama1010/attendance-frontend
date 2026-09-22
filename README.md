# attendance-frontend（勤怠管理：フロントエンド）

# 作成した目的
既存のLaravelによる勤怠管理アプリをベースに、バックエンドをLaravel API、フロントエンドをNext.jsに分離し、API連携によるSPA構成を実装してみました。

APIから勤怠データを取得・更新することで、ページ全体を再読み込みせずに操作できる画面構成を目指しています。

またLaravelとNext.jsを組み合わせたフロントエンド・バックエンド分離構成や、API連携、認証処理について理解を深めることも開発目的の一つです。

今後は、一般ユーザー・スタッフ・管理者など、権限に応じて利用できる機能を分ける認証・認可機能の拡張を予定しています。

# アプリケーションURL
ローカル環境
http://localhost/3000/attendance

# 機能一覧

＊ログイン機能は、簡易的なマルチログイン画面を実装。

①バックエンド側のマルチログイン(一般、新規登録、管理者)ページの「Next版」ボタンから仮ログインページに遷移

②localhost:3000/login(仮のログインページ) で、一般ユーザーか管理者を選んで、ログイン。

③Laravel が XSRF-TOKEN + laravel_session Cookie を発行。

④Next.js 側の API リクエスト時に、その Cookie が自動的に送信される⇒Laravel は「ログイン済みユーザー」として認証。

・マルチログイン
<img width="1204" height="666" alt="Image" src="https://github.com/user-attachments/assets/6eb85adb-bf37-43a2-ad47-7feb0c7471da" />

・全ユーザー取得機能
- 個人別ではなく、「全ユーザー取得機能」として、フロントエンド用にページ作成しました。
<img width="1337" height="665" alt="スクリーンショット (7301)" src="https://github.com/user-attachments/assets/946ade52-b905-4a4f-a9a6-b01790497fd1" />

・ユーザー側・ＣＲＵＤ機能（勤怠情報取得、月情報取得、詳細遷移）
<img width="1351" height="669" alt="スクリーンショット (7302)" src="https://github.com/user-attachments/assets/823d8ae9-7428-4940-b3b1-94fc2a29e7f6" />

・ユーザー側・勤怠詳細⇒修正申請機能（承認済＝承認済情報取得、申請詳細表示）
<img width="1353" height="679" alt="スクリーンショット (7303)" src="https://github.com/user-attachments/assets/57b1c4fd-5eed-4a60-98f4-40d492555042" />

管理側・申請一覧⇒修正申請機能
<img width="1355" height="677" alt="スクリーンショット (7304)" src="https://github.com/user-attachments/assets/18694489-266c-4b80-bdf5-21ed2c5e4498" />

ユーザー側・勤怠一覧機能
<img width="1355" height="679" alt="スクリーンショット (7305)" src="https://github.com/user-attachments/assets/6717afde-1936-443e-833a-6d89986a3f42" />

スタッフ一覧・スタッフ勤怠
<img width="1351" height="673" alt="スクリーンショット (7306)" src="https://github.com/user-attachments/assets/db252584-26d8-407c-a0b4-2e06863d82e4" />
<img width="1349" height="681" alt="スクリーンショット (7307)" src="https://github.com/user-attachments/assets/e696533a-85ff-4463-a7f1-beae4d195b29" />
<img width="1351" height="675" alt="スクリーンショット (7308)" src="https://github.com/user-attachments/assets/bd19c859-9e75-4e77-b0fc-29cfde0dcd17" />

# 使用技術
・Next.js 14

・Node.js

・TypeScript

・Vercel

# 環境構築

## 1. リポジトリをクローン

git clone https://github.com/shoyama1010/attendance-frontend.git

cd attendance-frontend

## 2.　パッケージをインストール

npm install

## 3. 環境変数ファイルを作成

.env.local をプロジェクト直下に作成し、以下を設定してください。

（API エンドポイントをバックエンド側 Laravel の URL に合わせてください）

NEXT_PUBLIC_API_BASE_URL=http://localhost/api

## 4. 開発サーバーを起動

yarn dev（または npm run dev）

## 5. ビルド（本番用）

yarn run build

npm run start

公開デモ（Vercelで開発中）

https://attendance-frontend-seven-zeta.vercel.app/login

＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
