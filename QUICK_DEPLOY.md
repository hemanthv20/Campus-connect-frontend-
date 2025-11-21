# Quick Deployment Reference

## 🚀 Deploy in 5 Minutes

### Step 1: Set Environment Variable

**Your Backend URL:** `https://your-backend-url.onrender.com`

Set this in your deployment platform:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Deploy Commands

**Netlify:**

```bash
Base directory: front-end
Build command: npm run build
Publish directory: front-end/build
```

**Vercel:**

```bash
Root Directory: front-end
Build Command: npm run build
Output Directory: build
```

**Render:**

```bash
Root Directory: front-end
Build Command: npm ci && npm run build
Publish Directory: build
```

### Step 3: Update Backend CORS

After deployment, update backend environment variable:

```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.netlify.app
```

## ✅ That's It!

Your app should now be live and working.

---

## 🔑 All Environment Variables

Copy these to your deployment platform:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_FIREBASE_API_KEY=AIzaSyDpBQ2HrCURYsKvqTKQnpO_TiJjb956pOI
REACT_APP_FIREBASE_AUTH_DOMAIN=campusconnect-10901.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=campusconnect-10901
REACT_APP_FIREBASE_STORAGE_BUCKET=campusconnect-10901.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1076337721495
REACT_APP_FIREBASE_APP_ID=1:1076337721495:web:1fe749ff4f6fd1f62ea9d2
REACT_APP_FIREBASE_MEASUREMENT_ID=G-219N5ZL046
```

**Remember:** Replace `your-backend-url.onrender.com` with your actual backend URL!
