# 🎵 nhacCuaToi - Music Manager App

### Amazing music platform – all you need in one application!

🎶 Listen and manage your personal music library  
📊 Browse details of songs, albums, and artists  
🌐 Multi-language support to view the app in different languages, responsive UI for multi devices  
📝 Register, login, update password, reset password and manage accounts  
🎤 Upload music and cover images using Cloudinary  
⚡ Realtime notifications, chatting with others (coming soon)  
💳 Integrated PayOS for premium subscription & donations  
🌗 Dark/Light mode theme support  
🔀 Shuffle & Repeat playback  
👥 Listen Together (Group Session) (coming soon)  
👨🏼‍💼 Admin dashboard to manage users, playlists, songs, statistics, and payments (realtime)

### Let's see here

[**https://nhaccuanguyen.luontuoivui.xyz**](https://nhaccuanguyen.luontuoivui.xyz)

## Tech Stack

### Backend:

- ![Node.js](https://img.shields.io/badge/Node.js-22.14.0-green) Node.js
- ![Express.js](https://img.shields.io/badge/Express.js-5.x-blue) Express.js
- ![MySQL](https://img.shields.io/badge/MySQL-Sequelize-orange) MySQL (Sequelize ORM)
- ![JWT](https://img.shields.io/badge/JWT-Authentication-yellow) JSON Web Tokens
- ![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black) Socket.IO
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-lightblue) Cloudinary Upload
- ![Redis](https://img.shields.io/badge/Redis-Cache-red) Upstash Redis
- ![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-green) Swagger API Docs
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-green) Nodemailer / Resend
- ![PayOS](https://img.shields.io/badge/PayOS-Payment-blueviolet) PayOS SDK Integration

### Frontend:

- ![React](https://img.shields.io/badge/React-19-blue) React
- ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-State%20Management-purple) Redux Toolkit
- ![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-green) Axios
- ![Material UI](https://img.shields.io/badge/MUI-Styling-blue) Material UI
- ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animation-pink) Framer Motion
- ![Formik](https://img.shields.io/badge/Formik-Forms-yellow) Formik
- ![Yup](https://img.shields.io/badge/Yup-Validation-purple) Yup
- ![i18next](https://img.shields.io/badge/i18next-Internationalization-blue) React-i18next
- ![React Router](https://img.shields.io/badge/React%20Router-Routing-orange) React Router

### Deployment:

- ![Docker](https://img.shields.io/badge/Docker-Containerization-blue) Docker
- ![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-green) Nginx
- ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-Hosting-orange) AWS EC2
- ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-blue) GitHub Actions
- ![Railway](https://img.shields.io/badge/Railway-Deployment-black) Railway

## Installation

### Clone repository:

```bash
git clone https://github.com/your-username/music-manager-app.git
```

### Setup .env file in backend:

##### 1. Create .env file

##### 2. Copy all from .env.example into .env(remenber to replace with your valid key):

```bash
PORT=5000
ACTKN_SECRET_KEY=your_access_token_secret
REFRESHTKN_SECRET_KEY=your_refresh_token_secret
RESEND_API_KEY=your_resend_api_key

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

GMAIL_USER=your_email@example.com
GMAIL_APP_PASS=your_gmail_app_password

NODE_VERSION=v22.14.0
NPM_VERSION=10.9.2
```

### Setup .env file in frontend:

##### 1. Create .env file

##### 2. Copy all from .env.example into .env(remenber to replace with your valid key):

```bash
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Install dependencies:

```bash
cd backend
npm install

cd frontend
npm install --legacy-peer-deps
```

### Running

#### 1. In backend:

```bash
npm run dev
```

#### 2. In frontend:

```bash
npm start
```
