```markdown
# 💬 Real-Time Chat App

A full-stack real-time chat application built using the **MERN stack**, **Socket.io**, and **TailwindCSS**. It supports real-time messaging, secure JWT-based authentication, online user tracking, and much more.

🔗 **Live Demo**: [https://chat-app-pk01.onrender.com](https://chat-app-pk01.onrender.com)  
📂 **GitHub Repo**: [https://github.com/kapil5849/chat-app](https://github.com/kapil5849/chat-app)

## 🔧 Tech Stack

- **Frontend**: React, TailwindCSS, Daisy UI, Zustand
- **Backend**: Node.js, Express.js, MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Token)
- **Image Uploads**: Cloudinary
- **Deployment**: Vercel (Frontend), Render (Backend)

## ✨ Features

- 👤 User **Authentication & Authorization** (JWT)
- ⚡ **Real-time messaging** powered by Socket.io
- 🟢 **Online user tracking**
- 🌐 Global **state management** using Zustand
- 🐛 Robust **error handling** on both client and server
- 🎨 Clean, responsive UI using TailwindCSS + Daisy UI
- 📦 Organized, **modular** codebase
- 🚀 **Free deployment** using Render & Vercel
- 🔐 Environment variable support via `.env`

## 📁 Project Structure

CHAT-APP/
├── backend/                    # Node.js backend (Express + Socket.io)
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── lib/                # Utility functions (e.g. cloudinary, db connect)
│   │   ├── middleware/         # Auth & error middleware
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express API routes
│   │   ├── seeds/              # Sample data (if any)
│   │   └── index.js            # Main entry point (app setup)
│   ├── .env                    # Backend environment variables
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                   # React frontend (Vite + TailwindCSS)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── constants/          # Static values/config
│   │   ├── lib/                # Utilities (e.g. axios, auth)
│   │   ├── pages/              # Route/page components
│   │   ├── store/              # Zustand state store
│   │   ├── App.jsx             # App layout & routes
│   │   ├── main.jsx            # React app entry point
│   │   └── index.css           # TailwindCSS styles
│   ├── index.html              # Main HTML file
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind config
│   ├── postcss.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .eslintrc.cjs           # ESLint config (optional)
│   └── .gitignore
│
├── README.md                   # Project documentation
└── .gitignore


---

## 📦 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
````

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kapil5849/chat-app.git
cd chat-app
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set up environment

* Create and fill `.env` file in `backend/` (as shown above)

### 4. Run the app in development

```bash
# Start backend
cd backend
npm run dev

# In a new terminal tab, start frontend
cd frontend
npm run dev
```

## 🤝 Contribution

Feel free to fork this repository and submit pull requests to contribute.
For major changes, please open an issue first to discuss what you’d like to change.

---

## 💡 Author

👨‍💻 **Kapil Vaishnav**
GitHub: [@kapil5849](https://github.com/kapil5849)
Live Demo: [https://chat-app-pk01.onrender.com](https://chat-app-pk01.onrender.com)
