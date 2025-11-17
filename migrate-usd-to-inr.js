/**
 * MongoDB Migration Script: Convert USD to INR
 * 
 * This script multiplies all monetary values by 83 to convert from USD to INR storage.
 * 
 * IMPORTANT: 
 * - Run this ONCE before deploying the updated backend/frontend code
 * - Make a backup of your database before running
 * - Update the connection string below with your MongoDB Atlas credentials
 * 
 * To run:
 * 1. Install MongoDB shell: npm install -g mongosh
 * 2. Run: mongosh "your-connection-string" < migrate-usd-to-inr.js
 * 
 * Or use this file with Node.js:
 * 1. npm install mongodb
 * 2. node migrate-usd-to-inr.js
 */

const USD_TO_INR_RATE = 83;

// Update your MongoDB connection string here
const MONGODB_URI = "mongodb+srv://username:password@cluster0.bifkqkw.mongodb.net/eauction?retryWrites=true&w=majority";

// For mongosh:
// db = connect(MONGODB_URI);

async function migrateToINR() {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('eauction'); // Update database name if different
    
    // 1. Migrate items collection
    console.log('\n=== Migrating items collection ===');
    const itemsResult = await db.collection('items').updateMany(
      {},
      [
        {
          $set: {
            minimumBid: { $multiply: [{ $ifNull: ["$minimumBid", 0] }, USD_TO_INR_RATE] },
            currentBid: { $multiply: [{ $ifNull: ["$currentBid", 0] }, USD_TO_INR_RATE] },
            bidIncrement: { $multiply: [{ $ifNull: ["$bidIncrement", 0] }, USD_TO_INR_RATE] }
          }
        }
      ]
    );
    console.log(`Items updated: ${itemsResult.modifiedCount}`);
    
    // 2. Migrate bids collection
    console.log('\n=== Migrating bids collection ===');
    const bidsResult = await db.collection('bids').updateMany(
      {},
      [
        {
          $set: {
            bidAmount: { $multiply: [{ $ifNull: ["$bidAmount", 0] }, USD_TO_INR_RATE] }
          }
        }
      ]
    );
    console.log(`Bids updated: ${bidsResult.modifiedCount}`);
    
    // 3. Migrate paymentRecords collection (if exists)
    console.log('\n=== Migrating paymentRecords collection ===');
    const paymentResult = await db.collection('paymentRecords').updateMany(
      {},
      [
        {
          $set: {
            amount: { $multiply: [{ $ifNull: ["$amount", 0] }, USD_TO_INR_RATE] }
          }
        }
      ]
    );
    console.log(`Payment records updated: ${paymentResult.modifiedCount}`);
    
    console.log('\n=== Migration Complete! ===');
    console.log('All monetary values have been converted from USD to INR (multiplied by 83)');
    console.log('\nNext steps:');
    console.log('1. Deploy the updated backend code (CurrencyUtil.java changes)');
    console.log('2. Deploy the updated frontend code (currencyUtils.js changes)');
    console.log('3. Restart your backend server');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrateToINR()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { migrateToINR };
