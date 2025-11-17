# Currency Migration Guide: USD to INR

## Overview
This guide documents the complete migration of the e-auction application from USD storage to INR storage.

**Previous Architecture:**
- Database: All amounts stored in USD
- Backend: Stored and calculated in USD
- Frontend: Converted USD → INR for display, INR → USD for submission

**New Architecture:**
- Database: All amounts stored in INR
- Backend: Stores and calculates in INR directly
- Frontend: No conversion needed, works with INR natively

---

## Migration Steps

### 1. Database Migration (MUST RUN FIRST!)

**⚠️ CRITICAL: Backup your database before running migration!**

Two migration scripts have been created in the root directory:

#### Option A: Using Node.js
```bash
# Install MongoDB driver
npm install mongodb

# Update connection string in migrate-usd-to-inr.js
# Then run:
node migrate-usd-to-inr.js
```

#### Option B: Using mongosh (MongoDB Shell)
```bash
# Connect to your database
mongosh "mongodb+srv://username:password@cluster0.bifkqkw.mongodb.net/eauction"

# Copy and paste the contents of migrate-mongosh.js
# Or run directly:
mongosh "your-connection-string" < migrate-mongosh.js
```

**What the migration does:**
- Multiplies all USD values by 83 in:
  - `items` collection: `minimumBid`, `currentBid`, `bidIncrement`
  - `bids` collection: `bidAmount`
  - `paymentRecords` collection: `amount`

**Verification:**
```javascript
// Check a few records after migration
db.items.findOne({}, {title: 1, minimumBid: 1, currentBid: 1})
db.bids.findOne({}, {bidAmount: 1})
```

---

### 2. Backend Changes

#### Files Modified:

**`CurrencyUtil.java`**
- ✅ Removed `USD_TO_INR_RATE` constant
- ✅ Removed `usdToInr()` method
- ✅ Updated `formatInr()` to format INR directly (no conversion)

**`Item.java`**
- ✅ Added comments: `minimumBid`, `currentBid`, `bidIncrement` are in INR

**`Bid.java`**
- ✅ Added comment: `bidAmount` is in INR

**`PaymentRecord.java`**
- ✅ Added comment: `amount` is in INR

**Services (BidService, AuctionService)**
- ✅ No changes needed - `formatInr()` still works, just formats INR values

---

### 3. Frontend Changes

#### Files Modified:

**`currencyUtils.js`**
- ✅ Removed `USD_TO_INR_RATE` constant
- ✅ Removed `usdToInr()` function
- ✅ Removed `inrToUsd()` function
- ✅ Updated `formatInr()` - now formats INR directly (no conversion)
- ✅ Updated `formatInrLocale()` - now formats INR directly
- ✅ Added `parseAmount()` - parses INR input from users

**Pages Updated:**
1. ✅ `CreateItemPage.jsx` - Submit INR directly, removed `inrToUsd()` conversion
2. ✅ `EditItemPage.jsx` - Load/submit INR directly, removed conversions
3. ✅ `ItemDetailsPage.jsx` - Display/submit INR directly, removed conversions
4. ✅ `AuctionDetailsPage.jsx` - Display/submit INR directly, removed conversions
5. ✅ `AdminDashboardPage.jsx` - Display INR directly using `formatInrLocale()`
6. ✅ `NotificationCenterPage.jsx` - Format INR messages directly
7. ✅ `NotificationBell.jsx` - Format INR messages directly

**Components Updated:**
1. ✅ `PaymentModal.jsx` - Display INR directly, removed `usdToInr()`
2. ✅ `BidConfirmationModal.jsx` - Display INR directly, removed `usdToInr()`

**No Changes Needed:**
- `ItemCard.jsx` - Already uses `formatInr()` which now works with INR
- `MyItemsPage.jsx` - Already uses `formatInr()` which now works with INR
- All other components using `formatInr()` - Function signature unchanged

---

## Deployment Checklist

### Pre-Deployment
- [ ] Backup MongoDB database
- [ ] Test migration script on staging/dev environment
- [ ] Verify sample records after migration
- [ ] Code review all changes

### Deployment Order (CRITICAL!)
1. [ ] **Run database migration first** (migrate-usd-to-inr.js or migrate-mongosh.js)
2. [ ] Verify migration completed successfully
3. [ ] Deploy backend changes (stop server, pull code, restart)
4. [ ] Deploy frontend changes (build and deploy)
5. [ ] Clear browser caches (or version your assets)

### Post-Deployment Verification
- [ ] Create new item - verify prices display correctly in INR
- [ ] Place a bid - verify amounts are correct
- [ ] Check notifications - verify INR formatting
- [ ] View admin dashboard - verify revenue displays in INR
- [ ] Test payment flow - verify amounts are correct

---

## Testing Scenarios

### 1. Create Item
- Enter minimum bid: ₹8,300
- **Expected**: Stored as 8300 in database (not 100)
- **Verify**: Check database record

### 2. Place Bid
- Bid amount: ₹10,000
- **Expected**: Stored as 10000 in database (not 120.48)
- **Verify**: Check bids collection

### 3. Notifications
- **Old notifications** (from before migration): Should still display correctly
- **New notifications** (after migration): Should display INR amounts
- **Verify**: Check notification messages

### 4. Admin Dashboard
- Revenue should display with proper Indian formatting (lakhs/crores)
- **Example**: ₹1,23,456.00 (not ₹1,234,56.00)

---

## Rollback Plan

**If migration fails or has issues:**

1. **Database Rollback:**
   ```javascript
   // Divide all values by 83 to revert to USD
   db.items.updateMany({}, [
     {$set: {
       minimumBid: {$divide: [{$ifNull: ["$minimumBid", 0]}, 83]},
       currentBid: {$divide: [{$ifNull: ["$currentBid", 0]}, 83]},
       bidIncrement: {$divide: [{$ifNull: ["$bidIncrement", 0]}, 83]}
     }}
   ]);
   
   db.bids.updateMany({}, [
     {$set: {bidAmount: {$divide: [{$ifNull: ["$bidAmount", 0]}, 83]}}}
   ]);
   
   db.paymentRecords.updateMany({}, [
     {$set: {amount: {$divide: [{$ifNull: ["$amount", 0]}, 83]}}}
   ]);
   ```

2. **Code Rollback:**
   - Revert to previous Git commit
   - Redeploy backend and frontend

---

## Summary of Changes

### Database
- **Collections**: items, bids, paymentRecords
- **Change**: All monetary values multiplied by 83

### Backend (Java)
- **Files Modified**: 4 files
  - CurrencyUtil.java (removed conversion logic)
  - Item.java (added INR comments)
  - Bid.java (added INR comments)
  - PaymentRecord.java (added INR comments)

### Frontend (JavaScript/React)
- **Files Modified**: 11 files
  - currencyUtils.js (removed conversions)
  - 7 pages (CreateItem, EditItem, ItemDetails, AuctionDetails, Admin, NotificationCenter, NotificationBell)
  - 2 components (PaymentModal, BidConfirmationModal)

### Total Impact
- **Backend**: 4 files, ~50 lines changed
- **Frontend**: 11 files, ~100 lines changed
- **Database**: 3 collections, all monetary fields × 83

---

## Validation Queries

### Check Items
```javascript
db.items.find({}, {title: 1, minimumBid: 1, currentBid: 1}).limit(5)
// Before: minimumBid: 100 (USD)
// After: minimumBid: 8300 (INR)
```

### Check Bids
```javascript
db.bids.find({}, {bidAmount: 1, createdAt: 1}).limit(5)
// Before: bidAmount: 150 (USD)
// After: bidAmount: 12450 (INR)
```

### Check Payments
```javascript
db.paymentRecords.find({}, {amount: 1, createdAt: 1}).limit(5)
// Before: amount: 200 (USD)
// After: amount: 16600 (INR)
```

---

## Support

If you encounter any issues during migration:

1. Check the console logs for errors
2. Verify database connection strings
3. Ensure all files were updated
4. Check browser console for frontend errors
5. Verify backend compilation successful

**Emergency Contact:**
- Backup database before making changes
- Test on staging environment first
- Keep this guide for reference during deployment
