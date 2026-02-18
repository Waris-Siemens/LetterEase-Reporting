# Deploy LetterEase to Vercel - Step by Step

## Prerequisites (2 minutes)
- [ ] GitHub account (free) - [Sign up here](https://github.com/signup)
- [ ] Vercel account (free) - [Sign up here](https://vercel.com/signup)

## Step 1: Push Code to GitHub (3 minutes)

### Option A: Using GitHub Desktop (Easiest)
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop
3. Click "File" → "Add Local Repository"
4. Select your LetterEase project folder
5. Click "Create a repository"
6. Name it: `letterease`
7. Click "Publish repository"
8. ✅ Done! Your code is on GitHub

### Option B: Using Command Line
1. Open Terminal/Command Prompt in your project folder
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial LetterEase deployment"
   ```
3. Go to [GitHub](https://github.com/new)
4. Create a new repository named `letterease`
5. Copy the commands from GitHub and run them:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/letterease.git
   git branch -M main
   git push -u origin main
   ```
6. ✅ Done! Your code is on GitHub

## Step 2: Deploy to Vercel (2 minutes)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign In" (use GitHub account)

2. **Import Project**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find `letterease` and click "Import"

3. **Configure Project**
   - Project Name: `letterease` (or any name you want)
   - Framework Preset: Vite (should auto-detect)
   - Root Directory: `./` (leave as is)
   - Build Command: (leave default)
   - Output Directory: (leave default)
   - Click "Deploy"

4. **Wait for Deployment**
   - Watch the build logs (takes 1-2 minutes)
   - You'll see a success message with your URL
   - Your URL will be something like: `https://letterease.vercel.app`

5. ✅ **Done! Your app is live!**

## Step 3: Upload Data to Deployed Site (3 minutes)

**IMPORTANT:** You must upload data on the deployed site, not localhost!

1. **Visit Your Deployed URL**
   - Click the URL from Vercel (e.g., `https://letterease.vercel.app`)
   - You should see the login page

2. **Login**
   - Click "Login to Upload Data"
   - Enter password: `LetterEase2024`
   - Click "Login"

3. **Upload Excel File**
   - Click "Upload New File" button
   - Select your Excel file (with Requested Date, Country Name, Region, Letter ID columns)
   - Wait for "Upload successful!" message
   - You should see:
     - Last Updated date
     - Total records count
     - Year buttons (e.g., 2023, 2024)

4. **Test Dashboard**
   - Click on a year button (e.g., "2024")
   - Verify you see:
     - Total Letters count
     - Monthly line chart
     - Country breakdown
     - Region and Country filters
   - ✅ Data uploaded successfully!

## Step 4: Test Sharing (2 minutes)

**This is crucial to verify sharing works!**

1. **Copy Dashboard URL**
   - While viewing a dashboard, copy the URL
   - Example: `https://letterease.vercel.app/dashboard/2024`

2. **Test in Incognito/Private Window**
   - Open a new Incognito/Private browser window
   - Paste the dashboard URL
   - Press Enter

3. **Verify Public Access**
   - ✅ You should see the dashboard WITHOUT logging in
   - ✅ Charts, filters, and data should be visible
   - ❌ If you see "No Data Available", go back to Step 3 and re-upload

4. **Share with Others**
   - Send the dashboard URL to your team
   - They can view it without any login!

## Step 5: Customize (Optional)

### Change Admin Password
1. In your code editor, open: `/src/app/context/AuthContext.tsx`
2. Find line 10:
   ```typescript
   const ADMIN_PASSWORD = 'LetterEase2024';
   ```
3. Change to your secure password:
   ```typescript
   const ADMIN_PASSWORD = 'MySecurePassword123!';
   ```
4. Save the file
5. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update admin password"
   git push
   ```
6. Vercel will auto-deploy (takes 1 minute)

### Custom Domain (Optional)
1. In Vercel, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `reports.yourcompany.com`)
4. Follow Vercel's DNS instructions
5. ✅ Your app will be at your custom domain!

## Troubleshooting

### "No Data Available" for viewers
**Cause:** Data uploaded locally, not on deployed site
**Fix:** 
- Go to your deployed URL (not localhost)
- Login and upload Excel file there

### Build failed on Vercel
**Cause:** Missing dependencies or build errors
**Fix:**
- Check Vercel build logs for specific error
- Make sure package.json is committed
- Try running `npm run build` locally first

### Dashboard redirects to home
**Cause:** Invalid year or no data
**Fix:**
- Check that you uploaded data on deployed site
- Verify year in URL matches uploaded data

### Can't login with password
**Cause:** Password changed but not deployed
**Fix:**
- Make sure you pushed code to GitHub
- Vercel should auto-deploy
- Check Vercel deployment status

## Monthly Update Workflow (15th of Each Month)

1. **Go to deployed URL:** `https://your-site.vercel.app`
2. **Login** with your admin password
3. **Click "Upload New File"**
4. **Select new Excel file**
5. **Verify update:**
   - Check "Last Updated" date
   - Click year button to view dashboard
   - Verify new month's data appears
6. ✅ **Done!** Team sees updated data automatically

## Your Deployed URLs

After deployment, you'll have:

- **Login/Admin:** `https://your-site.vercel.app/login`
- **Home:** `https://your-site.vercel.app/`
- **Dashboards:** `https://your-site.vercel.app/dashboard/YEAR`
  - Example: `https://your-site.vercel.app/dashboard/2024`
  - Example: `https://your-site.vercel.app/dashboard/2023`

**Share the dashboard URLs with your team!**

## Quick Checklist

- [ ] GitHub account created
- [ ] Vercel account created
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Deployment successful
- [ ] Visited deployed URL
- [ ] Logged in successfully
- [ ] Excel file uploaded
- [ ] Dashboard displays data
- [ ] Tested in incognito window
- [ ] Shared URL with team
- [ ] Changed default password (recommended)

## Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)
- **Build Errors:** Check Vercel deployment logs
- **Data Issues:** Make sure to upload on deployed site, not localhost

---

**Total Time:** ~10-15 minutes for first deployment
**Monthly Updates:** ~2 minutes on the 15th of each month

🚀 Happy Deploying!
