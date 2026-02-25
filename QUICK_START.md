# Quick Start - MindBridge AI

## ✅ Current Setup Status

- ✓ Gemini API Key: **CONFIGURED** (AIzaSyBR_2saieDNOcltKuzUSoUAM0HaFRp10MM)
- ✓ Server Dependencies: Ready to install
- ✓ Client Dependencies: Ready to install
- ✓ Database: MongoDB local instance required
- ✓ All routes and controllers: Complete

## 🚀 How to Start the Preview

### Prerequisites
Ensure you have:
- Node.js 16+ installed
- MongoDB running locally (`mongod` command)
- Terminal access

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies  
```bash
cd ../client
npm install
```

### Step 3: Start MongoDB (in a separate terminal)
```bash
mongod
```

### Step 4: Start Both Servers

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend Client:**
```bash
cd client
npm run dev
# Client will run on http://localhost:5173
```

## 🌐 Access the Application

Once both servers are running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Socket.io**: ws://localhost:5000

## 🔑 Test Credentials

### Create New Account
1. Go to http://localhost:5173
2. Click "Get Started" or navigate to `/login`
3. Click "Sign Up"
4. Choose role: **Patient** or **Doctor**
5. Fill in details and create account

### Sample Patient Account
- Email: patient@test.com
- Password: TestPass123!
- Role: Patient

### Sample Doctor Account
- Email: doctor@test.com
- Password: TestPass123!
- Role: Doctor
- License: LIC12345

## 🎯 Features to Test

### 1. Authentication
- [ ] Sign up as Patient
- [ ] Sign up as Doctor
- [ ] Login with credentials
- [ ] Logout functionality
- [ ] Protected routes (requires login)

### 2. Patient Features
- [ ] Complete Wellness Assessment
- [ ] View doctor recommendations
- [ ] Browse available doctors
- [ ] View doctor details
- [ ] Schedule appointment
- [ ] View appointments dashboard
- [ ] Join real-time chat
- [ ] Start video call
- [ ] View chat summary (uses Gemini AI)

### 3. Doctor Features
- [ ] Update profile and specialization
- [ ] Set hourly rates and availability
- [ ] View patient appointments
- [ ] Join patient video calls
- [ ] Participate in real-time chat
- [ ] View doctor dashboard with stats

### 4. Real-time Features
- [ ] Socket.io chat messaging
- [ ] Typing indicators
- [ ] Video call with WebRTC
- [ ] Mute/unmute audio
- [ ] Turn video on/off
- [ ] End call gracefully

### 5. AI Features
- [ ] End chat session (triggers Gemini summary)
- [ ] View auto-generated session summary
- [ ] Regenerate summary on demand

### 6. Contact Form
- [ ] Submit contact message
- [ ] Receive confirmation email (if configured)

## 📧 Email Configuration (Optional)

To enable email notifications, update `server/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_16_char_app_password_here
```

Gmail App Password setup:
1. Enable 2FA on Gmail account
2. Go to myaccount.google.com/apppasswords
3. Select Mail and Windows Computer
4. Generate 16-character password
5. Paste into EMAIL_PASS

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod` in another terminal

### Socket.io Connection Refused
```
websocket connection failed: Error during WebSocket handshake
```
**Solution**: Ensure backend server is running on port 5000

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check `FRONTEND_URL` matches your client URL in server .env

### Gemini API Error
```
GEMINI_API_KEY not set or invalid
```
**Solution**: Verify API key in `server/.env` is correct (already configured)

### Port Already in Use
```
EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process on port 5000 or change PORT in server/.env

## 📁 Important Files

- **Server**: `/server/server.js` - Main Express server with Socket.io
- **Frontend**: `/client/src/App.jsx` - React Router configuration
- **Auth Store**: `/client/src/store/authStore.js` - User state management
- **Chat Controller**: `/server/controllers/chatController.js` - Gemini integration
- **WebRTC Utils**: `/client/src/utils/webrtc.js` - Video call setup

## 🔒 Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 7 days
- All sensitive routes require authentication
- WebRTC uses Google STUN servers for NAT traversal
- CORS only allows frontend origin

## 📊 Database Collections

The following collections will be auto-created:
- `users` - All registered users
- `doctors` - Doctor profiles
- `patients` - Patient profiles
- `appointments` - Appointments between patients and doctors
- `chatsessions` - Chat history and summaries
- `videosessions` - Video call logs
- `assessments` - Wellness assessment responses
- `contacts` - Contact form submissions

## 🎓 Next Steps

1. **Test the flow**: Patient → Finds Doctor → Books Appointment → Starts Chat/Video
2. **Check logs**: Monitor server console for Socket.io events
3. **Inspect network**: Use browser DevTools to see API calls
4. **Review data**: Check MongoDB collections with MongoDB Compass
5. **Deploy**: Follow README.md deployment section when ready

## 💬 Need Help?

Check these files for more info:
- `README.md` - Complete API documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Technical architecture overview
- Server console logs - Real-time debugging information

---

**Happy Testing! 🎉**

The platform is fully functional and ready for development. All Gemini AI integration is active.
