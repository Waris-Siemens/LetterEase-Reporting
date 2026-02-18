# LetterEase - Data Persistence Guide

## Overview
LetterEase now automatically saves your uploaded Excel data in browser storage. Your dashboards remain accessible until you upload a new Excel file on the 15th of each month (or whenever you need to update the data).

## How Data Persistence Works

### Automatic Saving
- **Upload Once**: When you upload an Excel file, it's automatically saved to browser storage
- **Persistent Access**: Close your browser, restart your computer - the data remains available
- **No Re-upload Needed**: Access dashboards anytime without re-uploading the file
- **Auto-Loading**: The app automatically loads saved data when you open it

### Data Lifecycle
```
1. Upload Excel (15th of month) → Data saved to browser storage
2. Access dashboards anytime → Data loaded automatically
3. Share dashboard links → Others see the same data
4. Upload new Excel → Old data replaced with new data
```

## Storage Details

### What's Stored
- All Excel records (date, country, region, letter ID)
- Processed data structures (years, regions, countries)
- Last updated timestamp
- Computed monthly aggregations

### Storage Location
- **Browser Storage**: Data is stored in your browser's `localStorage`
- **Storage Key**: `letterease_dashboard_data`
- **Persistent**: Survives browser restarts
- **Local Only**: Data stays on your device (not sent to any server)

### Storage Limits
- Modern browsers support ~5-10MB in localStorage
- Typical Excel files with thousands of records fit comfortably
- If you exceed limits, the app will show an error and you may need to clear old data

## Monthly Update Workflow

### On the 15th of Each Month:
1. **Login**: Access the upload page with your admin password
2. **Upload New Excel**: Click "Upload New File" button
3. **Auto-Replace**: New data automatically replaces old data
4. **Dashboard Update**: All dashboards immediately reflect the new data
5. **Share Links**: Dashboard URLs remain the same, viewers see updated data

## Managing Data

### View Current Data
- Login to the homepage
- See "Last Updated" date and total records
- View available years

### Replace Data
- Use the "Upload New File" button on the homepage
- New data completely replaces old data
- No manual cleanup needed

### Clear Data
- Use the "Clear Data" button on the homepage (requires confirmation)
- Removes all stored data from browser
- Useful for testing or starting fresh

## Sharing Dashboards

### How It Works
- **Your Browser**: Contains the uploaded data
- **Viewer's Browser**: Loads data from your deployment
- **Shared Storage**: If deployed to a server, all users see the same data

### Important Notes
1. **Local Development**: Data only exists in your browser
2. **Deployed App**: Data must be uploaded on the deployed version for others to see
3. **Dashboard Links**: Share URLs like `https://yoursite.com/dashboard/2024`
4. **No Login Required**: Viewers access dashboards without authentication

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Private/Incognito Mode
- ⚠️ Data will NOT persist in private browsing mode
- Upload in normal browser window for persistent storage

### Multiple Browsers
- Data is stored per-browser
- Upload separately in each browser if needed
- Or deploy to a server for shared access

## Troubleshooting

### "No data available" message
**Cause**: No data uploaded yet or data was cleared
**Solution**: Login and upload an Excel file

### Dashboard redirects to home
**Cause**: Invalid year or no data for that year
**Solution**: Check available years on homepage, upload fresh data

### Data disappeared after browser restart
**Cause**: Private browsing mode or browser cleared cache
**Solution**: Re-upload Excel file, avoid private mode

### Storage quota exceeded
**Cause**: Excel file too large for browser storage
**Solution**: 
- Clear other browser data to free space
- Reduce Excel file size (remove unnecessary columns/rows)
- Consider database solution for very large datasets

## Production Deployment

### For Server Deployment:
1. **Backend Storage**: Consider adding a database for persistent storage across all users
2. **API Integration**: Upload endpoint to save data server-side
3. **Authentication**: Implement server-side auth for production security
4. **Backups**: Regularly backup data to prevent loss

### Current Implementation:
- **Client-Side Only**: Data stored in browser localStorage
- **Perfect For**: Personal use, small teams, prototyping
- **Limitations**: Data not shared across devices/users in local mode

## Best Practices

### For Admins (You)
1. ✅ Upload new data on schedule (15th of month)
2. ✅ Use normal browser window (not incognito)
3. ✅ Check "Last Updated" date to confirm upload success
4. ✅ Test dashboards after uploading
5. ✅ Keep a backup of your Excel files

### For Viewers
1. ✅ Bookmark dashboard links for quick access
2. ✅ Refresh page to see latest data
3. ✅ Report any data discrepancies to admin
4. ✅ No login needed - just access dashboard URLs

## Security Considerations

### Data Privacy
- Data stored locally in your browser
- Not transmitted to external servers (in current implementation)
- Only accessible to users with the dashboard URL

### Access Control
- Upload page: Password protected (admin only)
- Dashboard pages: Public (anyone with link)
- Logout clears authentication, but data remains

### Recommendations for Production
1. Add server-side authentication
2. Implement role-based access control
3. Use HTTPS for all connections
4. Add audit logging for data uploads
5. Implement data encryption at rest
