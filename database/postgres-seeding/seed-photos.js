const db = require('./seeding.js');
let start = Date.now();
db.seedPhotos();
const used = process.memoryUsage()
console.log('Memory:', used);
console.log('Time to Seed Users:', ((Date.now() - start)/1000/60).toFixed(4));