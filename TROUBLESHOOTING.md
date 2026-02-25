# MindBridge AI - Troubleshooting Guide

## Frontend Issues

### Issue: White Screen / Page Not Loading

**Problem**: Frontend shows blank white screen even though it's running.

**Solution**:
1. Check browser console for errors (F12 → Console tab)
2. Clear browser cache: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
3. Verify `App.jsx` has all required imports
4. Restart frontend: `npm run dev` in `/client`

**Root Cause**: Missing React imports or import statements.

**Status**: ✅ Fixed - Added `useState` import to App.jsx

---

### Issue: API Connection Errors

**Problem**: Frontend loads but API calls fail with 404 or ECONNREFUSED

**Solution**:
1. Verify backend is running: `npm run dev` in `/server`
2. Check VITE_API_BASE_URL in `client/.env` is correct
3. Ensure MongoDB is running
4. Check browser Network tab (F12 → Network) to see actual requests

**Expected Setup**:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

---

### Issue: Styling Not Loading (Tailwind CSS)

**Problem**: Page loads but has no styling, looks broken

**Solution**:
1. Rebuild frontend: `npm run dev`
2. Check `client/src/index.css` exists and has Tailwind imports
3. Verify `tailwind.config.js` has correct content paths
4. Clear Vite cache: Delete `client/.vite` folder

---

## Backend Issues

### Issue: EADDRINUSE - Port 5000 Already in Use

**Problem**: 
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution 1** (Recommended - Automatic):
The server now automatically tries port 5001 if 5000 is busy. Just restart:
```bash
cd server
npm run dev
# Will use 5000 or 5001 depending on availability
```

**Solution 2** (Manual - Free Port 5000):
```bash
# Kill process on port 5000
./kill-port.sh    # On Mac/Linux
# Or manually find and kill:
lsof -ti:5000 | xargs kill -9
```

**Solution 3** (Use Different Port):
```bash
PORT=5001 npm run dev
```

**Root Cause**: Previous server instance wasn't properly closed or was restarted too quickly.

---

### Issue: MongoDB Connection Refused

**Problem**:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
1. Start MongoDB:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or run directly
   mongod
   
   # Windows
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   ```

2. Verify MongoDB is running:
   ```bash
   mongo --version
   mongosh  # Test connection
   ```

3. Check MONGO_URI in `server/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/mindbridgeai
   ```

---

### Issue: Nodemon Not Restarting on File Changes

**Problem**: You edit a file but backend doesn't auto-reload

**Solution**:
1. Verify nodemon is installed: `npm list nodemon` in `/server`
2. Check `nodemon.json` exists (should auto-create)
3. Restart manually: Stop (Ctrl+C) and run `npm run dev` again
4. Ensure file is saved (look for dot on file tab in editor)

---

### Issue: Environment Variables Not Working

**Problem**: `process.env.GEMINI_API_KEY` is undefined

**Solution**:
1. Create `.env` file in `/server` directory (not `/server/config`)
2. Add variables:
   ```
   MONGO_URI=mongodb://localhost:27017/mindbridgeai
   JWT_SECRET=your_secret_key_here
   GEMINI_API_KEY=AIzaSyBR_2saieDNOcltKuzUSoUAM0HaFRp10MM
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

3. Restart backend: `npm run dev`

**Note**: Never commit `.env` file with real credentials!

---

## Real-time Features Issues

### Issue: Socket.io Connection Failed

**Problem**: Chat/Video not working, socket connection fails

**Solution**:
1. Verify backend is running on correct port
2. Check browser console for socket connection errors
3. Verify FRONTEND_URL in `server/.env` matches your frontend URL
4. Check browser Network tab → WS (WebSocket) tab for socket.io connection

**Expected**: 
- Socket should connect to `http://localhost:5000`
- See "Socket connected" message in browser console

---

### Issue: WebRTC Video Not Working

**Problem**: Video call page loads but no video appears

**Solution**:
1. Grant browser permissions: Check address bar → lock icon → camera/microphone
2. Verify browser supports WebRTC (Chrome, Firefox, Safari, Edge all support it)
3. Check console for WebRTC errors
4. Test microphone/camera work in system settings
5. Ensure backend Socket.io is connected first

---

## Gmail Email Not Sending

### Issue: Emails Not Received

**Problem**: Contact form or confirmation emails don't arrive

**Solution**:

1. **Verify Gmail Credentials**:
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASS` must be 16-character **App Password**, NOT regular password

2. **Generate App Password** (Required):
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google generates 16-char password
   - Copy into `server/.env` as EMAIL_PASS

3. **Enable 2-Factor Authentication**:
   - App passwords only work with 2FA enabled
   - Settings → Security → 2-Step Verification

4. **Check Gmail Spam**:
   - Might be marked as spam initially
   - Mark as "Not Spam" to whitelist sender

5. **Verify SMTP Settings**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx (16 chars with spaces)
   ```

6. **Check Backend Console**:
   - Look for email send logs
   - Should see "Email sent to user@example.com" or error messages

---

## Gemini API Issues

### Issue: Chat Summary Generation Fails

**Problem**: Chat ends but no AI summary is generated

**Solution**:

1. **Verify API Key**:
   ```bash
   # In server/.env
   GEMINI_API_KEY=AIzaSyBR_2saieDNOcltKuzUSoUAM0HaFRp10MM
   ```

2. **Check API Quota**:
   - Visit https://console.cloud.google.com/
   - Check API usage for Google Generative AI
   - Free tier has rate limits

3. **Restart Backend**:
   ```bash
   cd server
   npm run dev
   ```

4. **Check Backend Console**:
   - Should see "Generating AI summary..." when chat ends
   - Look for error messages about API

5. **Test Manually**:
   - Add `console.log("[v0] Gemini API Response:", response)` in chatController.js
   - Check actual API response in backend logs

---

## Database Issues

### Issue: Mongoose Validation Errors

**Problem**: 
```
ValidationError: Field X is required / Cast to ObjectId failed
```

**Solution**:
1. Check required fields in model schema
2. Verify you're sending correct data types
3. Look at API request body in Network tab
4. Check model definition in `/server/models/`

---

### Issue: Duplicate Key Error

**Problem**:
```
MongoError: E11000 duplicate key error
```

**Solution**:
1. Usually caused by duplicate email during signup
2. Check if user already exists before creating
3. Clear database if testing: `db.users.deleteMany({})` in MongoDB shell
4. Restart backend

---

## Performance Issues

### Issue: App Loading Slowly

**Problem**: Frontend takes 10+ seconds to load

**Solution**:
1. Check Network tab (F12) for slow requests
2. Verify MongoDB connection is fast
3. Check if large images are being loaded
4. Rebuild frontend: Delete `client/.vite` and `client/node_modules/.vite`

---

### Issue: Backend API Responses Slow

**Problem**: Requests take 5+ seconds

**Solution**:
1. Check MongoDB indexes on frequently queried fields
2. Look at API route complexity
3. Verify database query efficiency
4. Check server console for warnings

---

## Quick Restart Guide

If everything breaks and you need a fresh start:

```bash
# Stop everything (Ctrl+C in all terminals)

# Kill any lingering processes
./kill-port.sh

# Clean installations
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev

# In another terminal
cd ../client
rm -rf node_modules package-lock.json
npm install
npm run dev

# In another terminal (if using local MongoDB)
mongod
```

---

## Debug Mode

Enable detailed logging:

**Backend** (add to server.js):
```javascript
console.log("[v0] Incoming request:", req.method, req.path);
console.log("[v0] User authenticated:", req.user?._id);
console.log("[v0] Database query result:", result);
```

**Frontend** (add to components):
```javascript
console.log("[v0] Component mounted:", componentName);
console.log("[v0] API response:", response.data);
console.log("[v0] State updated:", newState);
```

Then check browser Console (F12) and terminal output for `[v0]` messages.

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `EADDRINUSE` | Port in use | Run `./kill-port.sh` |
| `ECONNREFUSED` | MongoDB not running | Start `mongod` |
| `Cannot GET /api/...` | Route not defined | Check routes files |
| `jwt malformed` | Bad token format | Re-login |
| `Cast to ObjectId failed` | Invalid MongoDB ID | Verify object ID format |
| `Module not found` | Missing dependency | Run `npm install` |
| `Cannot find module` | Wrong import path | Check file locations |

---

## Still Having Issues?

1. Check backend console for error messages
2. Check browser console (F12) for JavaScript errors
3. Check Network tab to see actual API responses
4. Add `console.log("[v0] ...")` statements to debug
5. Restart both frontend and backend
6. Clear browser cache
7. Make sure MongoDB is running
8. Verify all environment variables are set

Good luck! 🚀
