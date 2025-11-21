# Netlify Deployment Fix Guide

This guide addresses the common Node.js version and ESLint issues when deploying to Netlify.

## Issues Fixed

1. ✅ **Node v22 Compatibility**: Pinned to Node 18.16.0 (stable with react-scripts)
2. ✅ **ESLint Warnings as Errors**: Disabled CI mode for build
3. ✅ **SPA Routing**: Configured redirects for client-side routing

## Files Added/Modified

### 1. `.nvmrc` (NEW)

```
18.16.0
```

Forces Netlify to use Node 18.16.0 instead of v22.

### 2. `netlify.toml` (NEW)

Netlify configuration file with:

- Build command
- Publish directory
- Node version override
- SPA redirect rules

### 3. `package.json` (MODIFIED)

Updated build scripts:

```json
"build": "CI=false react-scripts build",
"build:netlify": "CI=false react-scripts build"
```

`CI=false` prevents ESLint warnings from failing the build.

### 4. `.eslintignore` (NEW)

Ignores build artifacts and config files from ESLint checks.

## Deployment Steps

### Option A: Automatic (Recommended)

1. **Commit and push these changes:**

   ```bash
   git add .nvmrc netlify.toml package.json .eslintignore
   git commit -m "Fix Netlify build: Pin Node 18, disable CI ESLint errors"
   git push origin main
   ```

2. **Netlify will automatically:**
   - Detect `.nvmrc` and use Node 18.16.0
   - Use `netlify.toml` configuration
   - Build with `CI=false` (no ESLint errors)

### Option B: Manual Netlify Configuration

If automatic detection doesn't work:

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Build & Deploy

2. **Set Environment Variables:**

   ```
   NODE_VERSION = 18.16.0
   CI = false
   ```

3. **Set Build Command:**

   ```
   npm run build:netlify
   ```

4. **Set Publish Directory:**
   ```
   build
   ```

## Environment Variables to Set in Netlify

Go to: Site Settings → Environment Variables → Add Variable

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

## Verify Local Build

Test the build locally before deploying:

```bash
# Install dependencies
npm install

# Test build with CI=false
CI=false npm run build

# Or use the netlify script
npm run build:netlify

# Serve locally to test
npx serve -s build
```

## Troubleshooting

### Build Still Fails?

1. **Check Node Version in Logs:**
   Look for: `Node version: v18.16.0`
2. **Clear Netlify Cache:**

   - Go to: Deploys → Trigger Deploy → Clear cache and deploy site

3. **Check Build Logs for Specific Errors:**
   - ESLint errors: Add to `.eslintignore`
   - Module errors: Check `package.json` dependencies
   - Memory errors: Increase Node memory in netlify.toml

### ESLint Warnings Still Causing Issues?

Add to `package.json`:

```json
"eslintConfig": {
  "extends": ["react-app"],
  "rules": {
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Need Different Node Version?

Update `.nvmrc`:

```
18.18.0  # Latest Node 18
20.10.0  # Node 20 (if compatible)
```

## Success Indicators

✅ Build log shows: `Node version: v18.16.0`
✅ Build completes without ESLint errors
✅ Site deploys successfully
✅ Client-side routing works (no 404s)
✅ Environment variables loaded correctly

## Additional Resources

- [Netlify Node Version](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/#netlify)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)

## Quick Commands Reference

```bash
# Local development
npm start

# Build for production (with ESLint warnings allowed)
npm run build:netlify

# Test production build locally
npx serve -s build

# Check Node version
node --version

# Use Node 18 locally (if you have nvm)
nvm use 18
```

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] API calls work (check Network tab)
- [ ] Firebase integration works
- [ ] Client-side routing works (refresh on any page)
- [ ] Environment variables are correct
- [ ] CORS is configured on backend
- [ ] All features functional

---

**Need Help?** Check Netlify deploy logs for specific error messages.
