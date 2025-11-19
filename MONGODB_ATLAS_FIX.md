# MongoDB Atlas Connection Fix

## Steps to Fix Network Access:

### 1. Login to MongoDB Atlas
- Go to https://cloud.mongodb.com/
- Login with your credentials

### 2. Check Network Access
- Click on "Network Access" in the left sidebar (under Security)
- Check if your current IP is whitelisted

### 3. Add IP Address
**Option A - Add Your Current IP:**
- Click "Add IP Address" button
- Click "Add Current IP Address"
- Click "Confirm"

**Option B - Allow from Anywhere (For Testing):**
- Click "Add IP Address" button
- Enter `0.0.0.0/0` in the IP Address field
- Add description: "Allow from anywhere (temporary)"
- Click "Confirm"
- ⚠️ **WARNING**: This allows connections from any IP. Remove this after testing!

### 4. Check Database User
- Click on "Database Access" in the left sidebar
- Verify user `rakshithlk28` exists
- If password has special characters, consider changing it to a simple one (letters + numbers only)

### 5. Get Fresh Connection String
- Go to your cluster (click "Database" in left sidebar)
- Click "Connect" button on your cluster
- Choose "Connect your application"
- Select Driver: **Java** and Version: **5.2 or later**
- Copy the connection string
- Replace `<password>` with your actual password
- Replace `<db_name>` with `eauction`

### 6. Update application.properties
Use the connection string format:
```
mongodb+srv://rakshithlk28:<password>@cluster0.bifkqkw.mongodb.net/eauction?retryWrites=true&w=majority
```

## Current Issues:
- SSL handshake error: "Received fatal alert: internal_error"
- This is often caused by:
  1. ❌ IP not whitelisted
  2. ❌ Incorrect password/URL encoding
  3. ❌ Cluster paused/sleeping
  4. ❌ Network/firewall blocking MongoDB Atlas ports

## Quick Test:
After fixing network access, run this in PowerShell to test connectivity:
```powershell
Test-NetConnection -ComputerName cluster0.bifkqkw.mongodb.net -Port 27017
```

If it shows "TcpTestSucceeded : True", your network can reach MongoDB Atlas.

---

**Once you've completed the above steps, let me know and I'll help restart the backend!**
