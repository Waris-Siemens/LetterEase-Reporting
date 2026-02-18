# LetterEase - Authentication Guide

## Overview
LetterEase now has password protection for the Excel upload page. This ensures only authorized users (admins) can upload and manage data, while dashboard viewers can access reports without authentication.

## How It Works

### For Admins (You)
1. **First Visit**: Navigate to the home page - you'll be redirected to `/login`
2. **Login**: Enter the admin password: `LetterEase2024`
3. **Upload Access**: After login, you can upload Excel files and manage data
4. **Persistent Login**: Your login status is saved in browser storage, so you stay logged in
5. **Logout**: Click the "Logout" button in the top-right corner to log out

### For Dashboard Viewers (Others)
- **Direct Access**: Share dashboard URLs like `/dashboard/2024` directly
- **No Login Required**: Viewers can access dashboards, filters, and charts without authentication
- **View Only**: They cannot access the upload page or modify data

## Changing the Password

To change the admin password:
1. Open `/src/app/context/AuthContext.tsx`
2. Find the line: `const ADMIN_PASSWORD = 'LetterEase2024';`
3. Replace `'LetterEase2024'` with your desired password
4. Save the file

**Example:**
```typescript
const ADMIN_PASSWORD = 'MySecurePassword123!';
```

## Routes

### Protected Routes (Require Login)
- `/` - Home page with Excel upload

### Public Routes (No Login Required)
- `/login` - Admin login page
- `/dashboard/:year` - Year-specific dashboards (can be shared)

## Security Notes

1. **Browser Storage**: Login status is stored in `localStorage` under the key `letterease_admin`
2. **Password Security**: Change the default password before deploying to production
3. **No Server Authentication**: This is client-side only. For production, consider server-side authentication
4. **Clear Logout**: Use the logout button to clear authentication when done

## Sharing Dashboards

To share a dashboard with others:
1. Upload your Excel file (while logged in)
2. Navigate to the dashboard year you want to share
3. Copy the URL (e.g., `https://yoursite.com/dashboard/2024`)
4. Share this URL - recipients can view without logging in

## Tips

- **Multiple Devices**: You'll need to log in separately on each browser/device
- **Private Browsing**: Login won't persist in incognito/private mode
- **Logout on Shared Computers**: Always logout when using shared computers
