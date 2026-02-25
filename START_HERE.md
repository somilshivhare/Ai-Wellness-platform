# MindBridge AI - Start Here 🚀

## Issues Fixed ✅

### 1. Frontend White Screen
- **Problem**: App.jsx was missing `useState` import
- **Status**: FIXED ✓
- Your frontend should now show the Landing page with hero section

### 2. Backend Port 5000 Already in Use
- **Problem**: Another process was using port 5000
- **Status**: FIXED ✓
- Backend now auto-tries port 5001 if 5000 is busy
- Or use the kill script: `./kill-port.sh`

### 3. Gemini API Integrated
- **API Key**: AIzaSyBR_2saieDNOcltKuzUSoUAM0HaFRp10MM ✓
- **Status**: Ready for chat summaries
- **Location**: `/server/.env`

---

## Quick Start (5 Minutes)

### Step 1: Start MongoDB

**macOS/Linux**:
```bash
mongod
```

**Windows**:
Open Command Prompt and run:
```bash
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**With Homebrew (Mac)**:
```bash
brew services start mongodb-community
```

Leave this running.

---

### Step 2: Start Backend Server

Open a NEW terminal window:

```bash
cd server
npm install   # (only needed first time)
npm run dev
```

Expected output:
```
✓ Server running on port 5000
✓ MongoDB connected to mindbridgeai
```

If port 5000 is busy, it will auto-use 5001. That's fine!

---

### Step 3: Start Frontend

Open ANOTHER NEW terminal window:

```bash
cd client
npm install   # (only needed first time)
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### Step 4: Visit the App

Open browser to: **http://localhost:5173**

You should see:
- MindBridge AI Landing Page
- Hero section with "Your Path to Mental Wellness"
- Get Started button
- Beautiful gradient background

---

## Test the App

### 1. Create Account
- Click "Get Started"
- Fill signup form
- Choose "Patient" or "Doctor" role
- Submit

### 2. Login
- Enter email and password
- You'll be logged in!

### 3. Patient Flow
- Go to Assessment
- Fill out wellness questionnaire
- Browse available doctors
- Book an appointment

### 4. Doctor Flow
- Update profile
- View patient appointments
- Accept/manage appointments

### 5. Real-time Features
- **Chat**: Start a text conversation with Gemini AI summarization
- **Video**: Click to start WebRTC video call
- **Email**: Check spam folder for confirmation emails

---

## Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend config (MongoDB, APIs) |
| `client/.env` | Frontend config (API base URL) |
| `server/server.js` | Main backend entry point |
| `client/src/App.jsx` | Frontend router |
| `client/src/index.css` | Global styles |

---

## Environment Variables

### Backend (.env file in `/server` directory)

```env
# Database
MONGO_URI=mongodb://localhost:27017/mindbridgeai
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# APIs
GEMINI_API_KEY=AIzaSyBR_2saieDNOcltKuzUSoUAM0HaFRp10MM
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password_16_chars

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env file in `/client` directory)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Note**: If backend uses port 5001 instead of 5000, update both the API URL and FRONTEND_URL accordingly.

---

## Commands Cheatsheet

```bash
# Start everything
mongod                    # Terminal 1
cd server && npm run dev  # Terminal 2
cd client && npm run dev  # Terminal 3

# Free up port 5000 if needed
./kill-port.sh

# Install dependencies (first time)
cd server && npm install
cd client && npm install

# Build for production
cd client && npm run build
cd server && npm install --production

# Remove node_modules and reinstall (if issues)
rm -rf node_modules package-lock.json
npm install
```

---

## Verify Everything Works

### ✅ Frontend
- [ ] Page loads at http://localhost:5173
- [ ] No white screen
- [ ] Landing page visible with styling
- [ ] Can navigate to Login page
- [ ] Responsive on mobile

### ✅ Backend
- [ ] Server running on port 5000 or 5001
- [ ] MongoDB connected
- [ ] No error messages in console

### ✅ Database
- [ ] MongoDB running
- [ ] Can create new users
- [ ] Users appear in database

### ✅ Real-time (Optional for now)
- [ ] Socket.io connections working
- [ ] Chat messages appear
- [ ] Video calls initialize

### ✅ APIs
- [ ] Signup works
- [ ] Login works
- [ ] API calls succeed (check Network tab in F12)

---

## Troubleshooting

### White Screen on Frontend
```bash
# Clear cache and rebuild
cd client
rm -rf .vite
npm run dev
```

### Port 5000 Already in Use
```bash
# Kill the process
./kill-port.sh

# Or manually
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod

# Or with Homebrew
brew services start mongodb-community
```

### Backend Crashes Immediately
```bash
# Check error message (usually in red)
# Most common: Port in use or MongoDB not running

# Try different port
PORT=5001 npm run dev
```

### Dependencies Missing
```bash
# Reinstall everything
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Still broken?
See `TROUBLESHOOTING.md` for comprehensive debugging guide!

---

## Project Structure

```
mindbridge-ai/
├── server/                 # Express backend
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation
│   ├── config/            # Database config
│   ├── .env               # Configuration
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API calls
│   │   ├── App.jsx        # Router
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite config
│   ├── .env               # Configuration
│   └── package.json       # Dependencies
│
└── README.md              # Full documentation
```

---

## Next Steps

1. ✅ Get frontend and backend running
2. ✅ Create a test account
3. ✅ Explore all pages and features
4. ✅ Test chat and video (real-time features)
5. ✅ Check email notifications
6. 📝 Customize colors, text, and styling
7. 🚀 Deploy to production (Vercel, Heroku, etc.)

---

## Support

- Check `TROUBLESHOOTING.md` for common issues
- Check `README.md` for full documentation
- Check browser console (F12) for errors
- Check backend terminal for server logs
- Add `console.log("[v0] ...")` to debug code

---

## Technology Stack

**Frontend**:
- React 18
- Vite (fast bundler)
- React Router (routing)
- Zustand (state management)
- Socket.io (real-time)
- Tailwind CSS (styling)
- Lucide Icons

**Backend**:
- Express.js (server framework)
- MongoDB + Mongoose (database)
- Socket.io (WebRTC signaling)
- JWT (authentication)
- Nodemon (auto-reload)
- Google Gemini API (AI summaries)
- NodeMailer (emails)

**Deployment Ready**:
- Can deploy to Vercel, Heroku, AWS, DigitalOcean
- MongoDB Atlas for cloud database
- Gmail for email service
- Google Cloud for Gemini API

---

Let's build something amazing! 🎯

Good luck, and feel free to customize everything to match your vision!
