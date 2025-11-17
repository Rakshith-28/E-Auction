/**
 * MongoDB Shell Migration Script: Convert USD to INR
 * 
 * Run this directly in mongosh:
 * 1. Connect: mongosh "mongodb+srv://username:password@cluster0.bifkqkw.mongodb.net/eauction"
 * 2. Copy and paste this entire script
 * 
 * OR save as file and run:
 * mongosh "your-connection-string" < migrate-mongosh.js
 */

const USD_TO_INR_RATE = 83;

print('\n=== Starting USD to INR Migration ===\n');

// 1. Migrate items collection
print('=== Migrating items collection ===');
const itemsResult = db.items.updateMany(
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
print(`Items updated: ${itemsResult.modifiedCount}`);

// 2. Migrate bids collection
print('\n=== Migrating bids collection ===');
const bidsResult = db.bids.updateMany(
  {},
  [
    {
      $set: {
        bidAmount: { $multiply: [{ $ifNull: ["$bidAmount", 0] }, USD_TO_INR_RATE] }
      }
    }
  ]
);
print(`Bids updated: ${bidsResult.modifiedCount}`);

// 3. Migrate paymentRecords collection
print('\n=== Migrating paymentRecords collection ===');
const paymentResult = db.paymentRecords.updateMany(
  {},
  [
    {
      $set: {
        amount: { $multiply: [{ $ifNull: ["$amount", 0] }, USD_TO_INR_RATE] }
      }
    }
  ]
);
print(`Payment records updated: ${paymentResult.modifiedCount}`);

print('\n=== Migration Complete! ===');
print('All monetary values converted from USD to INR (× 83)');
print('\nVerify a few records:');
print('db.items.findOne({}, {title: 1, minimumBid: 1, currentBid: 1})');
print('db.bids.findOne({}, {bidAmount: 1})');
