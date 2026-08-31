# attendance-frontend（勤怠管理：フロントエンド）

# 作成した目的

Laravelでのバックエンド側だけでなく、API連携により、Next.jsで画面構成（CSRにて）を実装することで、高速なページを表示させる機能を目的としてます。
（フロントエンドのスキル習得も目的にしており、管理側とスタッフ側が合わさった「マルチログイン」なども将来的に実装中です）

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
- http://localhost/3000/attendance は、個人別ではなく、「全ユーザー取得機能」として、フロントエンド用にページ作成しました。
<img width="1352" height="679" alt="Image" src="https://github.com/user-attachments/assets/bddf26e2-0949-4511-83af-cf170cf686c2" />

・ユーザー側・ＣＲＵＤ機能（勤怠情報取得、月情報取得、詳細遷移）
<img width="1366" height="683" alt="Image" src="https://github.com/user-attachments/assets/aac35554-3815-443d-9011-3b0acce3fdfc" />

・ユーザー側・勤怠詳細⇒修正申請機能（承認待ち＝承認済情報取得、申請詳細表示）
<img width="1359" height="675" alt="Image" src="https://github.com/user-attachments/assets/52c9a38c-6621-4ee0-9348-c52b55a3dffe" />

管理側・申請一覧⇒修正申請機能　http://localhost:3000/admin/corrections/list　
<img width="1355" height="671" alt="Image" src="https://github.com/user-attachments/assets/fa207cad-ae2b-4715-98c0-7f84b6055bcc" />

ユーザー側・勤怠一覧機能
<img width="1335" height="660" alt="Image" src="https://github.com/user-attachments/assets/39e3bd19-a94a-44fb-af6a-a493ddcf8df9" />

スタッフ一覧・スタッフ勤怠
<img width="1354" height="659" alt="Image" src="https://github.com/user-attachments/assets/a61b725e-10ef-4848-93ba-69390f0dfbd0" />
<img width="1343" height="666" alt="Image" src="https://github.com/user-attachments/assets/b301d2da-f535-4779-a61a-9ce191e5bce5" />
<img width="1350" height="671" alt="Image" src="https://github.com/user-attachments/assets/25ea6b8d-d1a9-4cd5-ba89-a437175a2b92" />

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
