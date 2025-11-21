# Frontend Deployment Guide - React App

## ✅ Deployment Preparation Complete

All hardcoded API URLs have been replaced with environment variables. Your React frontend is now ready for deployment!

---

## 📋 Task Summary

### Task 1: ✅ .env.example File Created

Location: `CampusConnect/front-end/.env.example`

The file already exists with all necessary environment variables including:

- `REACT_APP_API_URL` - Backend API URL
- Firebase configuration variables
- Application metadata

### Task 2: ✅ All Hardcoded URLs Replaced

All components now use the centralized API configuration from `src/config/api.js`

### Task 3: ✅ API Helper/Config File

Location: `CampusConnect/front-end/src/config/api.js`

This file exports:

- `API_BASE_URL` - Base URL for all API calls
- `API_ENDPOINTS` - Centralized endpoint definitions

### Task 4: ✅ Files Changed Summary

---

## 📁 Files Modified

### 1. **Navbar.js** ✅ UPDATED

**Location:** `src/components/Navbar.js`

**Before:**

```javascript
const response = await fetch(
  `${
    process.env.REACT_APP_API_URL || "http://localhost:8081"
  }/users/search/${searchTerm}?gender=${genderFilter}`
);
```

**After:**

```javascript
import { API_BASE_URL } from "../config/api";

const response = await fetch(
  `${API_BASE_URL}/users/search/${searchTerm}?gender=${genderFilter}`
);
```

**Changes:**

- Added import for `API_BASE_URL`
- Replaced inline environment variable with imported constant
- Applied to both search and autocomplete endpoints

---

### 2. **All Other Components** ✅ ALREADY CONFIGURED

The following components are already using `API_BASE_URL` correctly:

- ✅ `Users.js` - Uses `API_BASE_URL`
- ✅ `Register.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `Login.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `Profile.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `Feed.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `ChatWindow.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `ChatList.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `ChatIcon.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `Discover.js` - Uses `API_BASE_URL`
- ✅ `FollowButton.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `FollowersList.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `FollowingList.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `FollowStats.js` - Uses `API_BASE_URL` and `API_ENDPOINTS`
- ✅ `profile/SkillsSection.js` - Uses `API_BASE_URL`
- ✅ `profile/InterestsSection.js` - Uses `API_BASE_URL`
- ✅ `profile/ExperienceSection.js` - Uses `API_BASE_URL`
- ✅ `profile/ProjectsSection.js` - Uses `API_BASE_URL`
- ✅ `profile/GoalsSection.js` - Uses `API_BASE_URL`

---

## 🔧 Environment Configuration

### Complete .env.example File

```env
# Frontend Environment Variables Template
# Copy this file to .env.local and fill in your actual values

# Backend API Configuration
# For local development: http://localhost:8081
# For production: https://your-backend-domain.com
REACT_APP_API_URL=http://localhost:8081

# Firebase Configuration
# Get these values from your Firebase project settings
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Configuration
REACT_APP_APP_NAME=CampusConnect
REACT_APP_VERSION=1.0.0
```

---

## 🚀 Deployment Instructions

### For Netlify

1. **Connect Your Repository**

   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `front-end` directory as the base directory

2. **Build Settings**

   ```
   Base directory: front-end
   Build command: npm run build
   Publish directory: front-end/build
   ```

3. **Environment Variables**

   - Go to Site settings → Build & deploy → Environment
   - Add the following variables:

   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   REACT_APP_FIREBASE_API_KEY=AIzaSyDpBQ2HrCURYsKvqTKQnpO_TiJjb956pOI
   REACT_APP_FIREBASE_AUTH_DOMAIN=campusconnect-10901.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=campusconnect-10901
   REACT_APP_FIREBASE_STORAGE_BUCKET=campusconnect-10901.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1076337721495
   REACT_APP_FIREBASE_APP_ID=1:1076337721495:web:1fe749ff4f6fd1f62ea9d2
   REACT_APP_FIREBASE_MEASUREMENT_ID=G-219N5ZL046
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

---

### For Vercel

1. **Connect Your Repository**

   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Project Settings**

   ```
   Framework Preset: Create React App
   Root Directory: front-end
   Build Command: npm run build
   Output Directory: build
   ```

3. **Environment Variables**

   - Go to Project Settings → Environment Variables
   - Add the same variables as Netlify (see above)
   - Make sure to select "Production", "Preview", and "Development" for each variable

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

---

### For Render (Static Site)

1. **Create New Static Site**

   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect your GitHub repository

2. **Build Settings**

   ```
   Name: campusconnect-frontend
   Root Directory: front-end
   Build Command: npm ci && npm run build
   Publish Directory: build
   ```

3. **Environment Variables**

   - Add the same variables as above
   - Render will automatically inject them during build

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment

---

## 🔗 Update Backend CORS

After deploying your frontend, update your backend's CORS configuration:

### Backend Environment Variables (on Render)

```env
CORS_ALLOWED_ORIGINS=https://your-frontend-app.netlify.app,https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.netlify.app
```

**Important:** Replace with your actual frontend URL after deployment!

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] API calls reach the backend successfully
- [ ] Login/Register functionality works
- [ ] Posts can be created and viewed
- [ ] Chat functionality works
- [ ] Profile pages load correctly
- [ ] Search and discovery features work
- [ ] Follow/unfollow functionality works
- [ ] Firebase image uploads work

---

## 🐛 Troubleshooting

### Issue: API calls fail with CORS errors

**Solution:**

1. Check backend CORS configuration includes your frontend URL
2. Verify `CORS_ALLOWED_ORIGINS` in backend environment variables
3. Ensure no trailing slashes in URLs

### Issue: Environment variables not working

**Solution:**

1. Verify all variables start with `REACT_APP_`
2. Rebuild the application after adding variables
3. Check deployment logs for build errors

### Issue: Firebase errors

**Solution:**

1. Verify all Firebase environment variables are set
2. Check Firebase project settings match the variables
3. Ensure Firebase Storage rules allow uploads

### Issue: 404 errors on page refresh

**Solution:**

1. Add `_redirects` file in `public` folder:
   ```
   /*    /index.html   200
   ```
2. For Vercel, add `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/" }]
   }
   ```

---

## 📊 Deployment Status

| Component             | Status      | Notes                                   |
| --------------------- | ----------- | --------------------------------------- |
| Environment Variables | ✅ Complete | All configured in .env.example          |
| API Configuration     | ✅ Complete | Centralized in config/api.js            |
| Hardcoded URLs        | ✅ Removed  | All replaced with environment variables |
| CORS Setup            | ⚠️ Pending  | Update after frontend deployment        |
| Firebase Config       | ✅ Complete | Using environment variables             |

---

## 🎯 Next Steps

1. ✅ All code changes complete
2. 🔄 Commit and push changes to GitHub
3. 🚀 Deploy frontend to Netlify/Vercel/Render
4. 🔧 Update backend CORS with frontend URL
5. ✅ Test all functionality in production

---

## 📞 Support

If you encounter issues:

1. Check deployment logs in your hosting platform
2. Verify environment variables are set correctly
3. Test API endpoints directly using Postman/curl
4. Check browser console for errors

---

**Deployment Ready! 🎉**

Your React frontend is fully configured for deployment with environment-based configuration.
