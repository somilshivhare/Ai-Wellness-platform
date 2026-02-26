# MindBridge AI - Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] MongoDB running locally or MongoDB Atlas account
- [ ] Gmail account (for email notifications)
- [ ] Google Gemini API key
- [ ] Git installed

## Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Enable 2-factor authentication
3. Go to Security → App passwords
4. Generate password for "Mail" and "Windows Computer"
5. Copy the 16-character password (no spaces)

## Step 2: Get Gemini API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key" 
3. Create new API key in Google Cloud Console
4. Copy the key

## Step 3: Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your credentials
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/mindbridgeai
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_12345
NODE_ENV=development
PORT=5000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
EOF

# Start backend
npm run dev
```

Backend will run on `http://localhost:5000`

## Step 4: Setup Frontend

```bash
# In a new terminal, navigate to client
cd client

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:5000/api
EOF

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## Step 5: Test the Application

1. Open http://localhost:5173
2. Click "Get Started"
3. Sign up as a Patient or Therapist
4. For patients:
   - Complete wellness assessment
   - Browse doctors
   - Book an appointment
5. For therapists:
   - Update profile with specialization and rate
   - View appointments

## Troubleshooting Quick Fixes

### MongoDB Not Running
```bash
# macOS/Linux
mongod

# Windows
# Use MongoDB Compass or verify MongoDB service is running
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti :5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti :5173 | xargs kill -9
```

### CORS Error
- Backend FRONTEND_URL must match actual frontend URL
- Update if frontend running on different port

### WebRTC Issues
- Check camera/microphone permissions in browser
- Ensure both users' browsers support WebRTC
- Try Chrome or Firefox if issues persist

### Email Not Sending
- Verify 2FA is enabled on Gmail
- Use 16-char app password (no spaces)
- Check spam folder
- Verify EMAIL_USER is correct Gmail address

## Key Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend configuration |
| `client/.env` | Frontend API base URL |
| `server/server.js` | Main Express + Socket.io server |
| `client/src/App.jsx` | React router setup |
| `server/models/` | MongoDB schemas |
| `client/src/pages/` | Page components |

## Common Tasks

### Add New Doctor Specialization
Edit `server/models/Doctor.js` line 10:
```javascript
enum: ['Clinical Psychologist', 'Psychiatrist', 'Therapist', 'Counselor', 'Life Coach', 'YOUR_SPECIALTY'],
```

### Change JWT Expiration
Edit `server/controllers/authController.js` line 15:
```javascript
{ expiresIn: '7d' }  // Change 7d to desired period
```

### Add New Assessment Field
1. Edit `server/models/Assessment.js` - add field
2. Edit `client/src/pages/Assessment.jsx` - add form input
3. Update form handler in Assessment component

### Change Frontend Colors
Edit `client/tailwind.config.js` colors section

## Production Deployment

### Deploy Backend (Heroku example)
```bash
heroku login
heroku create mindbridge-api
git push heroku main
```

### Deploy Frontend (Vercel example)
```bash
npm install -g vercel
vercel --prod
```

### Production Environment Variables

**Backend .env**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mindbridgeai
JWT_SECRET=very_long_random_string_at_least_32_chars_long
NODE_ENV=production
PORT=5000
EMAIL_USER=notifications@yourdomain.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://yourdomain.com
```

**Frontend .env.production**
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## Support Files

- `README.md` - Complete documentation
- `SETUP_GUIDE.md` - This file
- `.env.example` - Environment template (coming soon)

## Next Steps

1. Customize branding colors in tailwind.config.js
2. Add your logo and images
3. Setup payment integration
4. Deploy to production
5. Configure custom domain
6. Setup SSL certificate
7. Monitor with error tracking

## Getting Help

1. Check README.md troubleshooting section
2. Review browser console for errors
3. Check backend logs for API errors
4. Verify all .env variables are set correctly
