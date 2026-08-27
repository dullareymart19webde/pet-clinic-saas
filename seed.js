const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

// Fix private key formatting
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey) {
  privateKey = privateKey.replace(/^"|"$/g, '');
  privateKey = privateKey.replace(/\\n/g, '\n');
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  })
});

const db = getFirestore();

async function updatePrices() {
  console.log('Fetching services...');
  const snapshot = await db.collection('services').get();
  let updatedCount = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    // If it's already in the thousands, it might already be PHP, but I know they are all 50, 40, etc.
    if (data.price < 1000) {
      const newPrice = data.price * 55;
      await doc.ref.update({ price: newPrice });
      console.log(`Updated ${data.name}: ${data.price} -> ${newPrice}`);
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} services to PHP scale.`);
  process.exit(0);
}

updatePrices().catch(err => {
  console.error(err);
  process.exit(1);
});
