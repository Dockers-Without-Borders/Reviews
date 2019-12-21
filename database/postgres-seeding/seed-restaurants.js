const db = require('./seeding.js');
let start = Date.now();
db.seedRestaurants();
const used = process.memoryUsage()
console.log('Memory:', used);
console.log('Time to Seed Restaurants:', ((Date.now() - start)/1000/60).toFixed(4));