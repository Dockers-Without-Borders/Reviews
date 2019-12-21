const faker = require('faker');
const { Pool, Client } = require('pg');
const restaurantsList = require('../restaurantList.js');
const photosList = require('../photosList.js');
const restaurants = restaurantsList.restaurants;
const maxIntents = 4000;
const maxphotosPerReview = 3;
const numUsers = 1000000;
const numRestaurants = 1000000; // leave equal to num users otherwise might break some function below
const numReviews = 20000000;
const reviewsPerRest = numReviews/ numRestaurants;

const pool = new Pool({
  user: 'postgres',
  password: 'AKK',
  database: 'yelpreviews',
  port: 5432
});

let db = {

  querySQL: function (query, successLog = 'Success') {
    let result = new Promise((resolve, reject) => {
      pool.query(query, function (err, resp) {
        if (err) {
          // console.log(query);
          console.log('query failed: ', err)
          reject('query error', err);
        } else {
          console.log(successLog);
          resolve(resp);
        }
      })
    });
    return result;
  },

  seedRestaurants: async function () {
    let count = 0;
    let query = `INSERT INTO restaurants (restname) VALUES `;
    for (let i = 0; i < numRestaurants; i++) {
      if (i === numRestaurants - 1) {
        query += `('${restaurants[Math.floor(Math.random() * restaurants.length - 1)]}');`;
        break;
      }
      count++;
      if (count === maxIntents) {
        query += `('${restaurants[Math.floor(Math.random() * restaurants.length - 1)]}');`;
        db.querySQL(query, `Seeding Restaurants: ${i + 1}/${numRestaurants}`);
        query = `INSERT INTO restaurants (restname) VALUES `;
        count = 0;
      } else {
        query += `('${restaurants[Math.floor(Math.random() * restaurants.length - 1)]}'),`;
      }
    }
    return await db.querySQL(query, `Seeding Restaurants: ${numRestaurants}/${numRestaurants}`);
  },

  seedUsers: async function () {
    let count = 0;
    let query = `INSERT INTO users (name, location, friends, elite, picture) VALUES `;
    let firstName, lastInitial, name, location, friends, chanceOfElite, elite, picture;
    for (let i = 0; i < numUsers; i++) {
      firstName = faker.name.firstName().replace('\'', '');
      lastInitial = String.fromCharCode(Math.floor((Math.random() * 26) + 65)) + '.';
      name = `${firstName} ${lastInitial}`;
      location = `${faker.address.city().replace('\'', '')}, ${faker.address.stateAbbr()}`;
      friends = Math.floor(Math.random() * 200);
      chanceOfElite = Math.floor(Math.random() * 9);
      elite = 0;
      picture = faker.image.avatar();

      //10% chance of elite status
      if (chanceOfElite < 1) {
        elite = 1;
      }
      if (i === numUsers - 1) {
        query += `('${name}', '${location}', ${friends}, ${elite}, '${picture}');`;
        break;
      }
      count++;
      if (count === maxIntents) {
        query += `('${name}', '${location}', ${friends}, ${elite}, '${picture}');`;
        db.querySQL(query, `Seeding Users: ${i + 1}/${numUsers}`);
        query = `INSERT INTO users (name, location, friends, elite, picture) VALUES `;
        count = 0;
      } else {
        query += `('${name}', '${location}', ${friends}, ${elite}, '${picture}'),`;
      }
    }
    return await db.querySQL(query, `Seeding Users: ${numUsers}/${numUsers}`);
    
  },

  seedReviews: async function () {
    let query = `INSERT INTO reviews(date, review, stars) VALUES `;
    let count = 0;
    let date, review, stars;
    let restUserId = 1;
    //select random restaurant and user
    for (let i = 0; i < numReviews; i++) {
      date = faker.date.recent(1600).toISOString().split('T')[0];
      review = faker.lorem.paragraph();
      stars = Math.floor(Math.random() * 4) + 1;

      if ((count + 1) % reviewsPerRest === 0) {
        restUserId++;
      }

      if (i === numReviews - 1) {
        query += `('${date}', '${review}', ${stars});`;
        break;
      }
      count++;
      if (count === maxIntents) {
        query += `('${date}', '${review}', ${stars});`;
        console.log('sending reviews', i);
        db.querySQL(query, `Seeding Reviews: ${i + 1}/${numReviews}`);
        query = `INSERT INTO reviews(date, review, stars) VALUES `;
        count = 0;
      } else {
        query += `('${date}', '${review}', ${stars}),`;
      }
    }
    return await db.querySQL(query, `Seeding Reviews: ${numReviews}/${numReviews}`);
  },

  seedPhotos: async function () {
    let query = `INSERT INTO photos(photo, photoCaption) VALUES `;
    let count = 0;
    let numPics;
    //select random restaurant and user
    for (let i = 0; i < numReviews; i++) {
      numPics = Math.ceil(Math.random() * maxphotosPerReview);
      for (let i = 0; i < numPics; i++) {
        query += `('${photosList[Math.floor(Math.random() * photosList.length)]}', 'DELICIOUS')`;
        if (i !== numPics - 1) {
          query += ',';
        }
      }
      if (i === numReviews - 1) {
        query += ';';
        break;
      }

      count++;
      if (count === maxIntents / 2) {
        query += ';';
        db.querySQL(query, `Seeding photos of review: ${i + 1}/${numReviews}`);
        query = `INSERT INTO photos(photo, photoCaption) VALUES `;
        count = 0;
      } else {
        query += ',';
      }
    }
    return await db.querySQL(query, `Seeding photos of review: ${numReviews}/${numReviews}`);
  },

  addReviewForeignKeys: async function () {
    let query = 'UPDATE reviews SET ';
    let start = 0
    let end = start + reviewsPerRest; //remember to subtrat 1
    let restUserId = 0;
    for (let i = 0; i < numReviews; i += reviewsPerRest) {
      query += `user_id = ${restUserId}, restaurant_id = ${restUserId} WHERE id >= ${start} AND id < ${end}`;
      db.querySQL(query, `updating reviews: ${i}/${numReviews}`);
      query = 'UPDATE reviews SET ';
    }
    return await db.querySQL(query, `updating reviews: ${numReviews}/${numReviews}`);
  }
}
let startAll = Date.now();
let startUser = Date.now();
let startRestaurants, startReviews, startPhotos, startForeignKeys;
db.seedUsers()
  .then(() => {
    startUser = ((Date.now() - startUser) / 1000 / 60).toFixed(4);
    startRestaurants = Date.now();
    return db.seedRestaurants(); })
  .then(() => {
    startRestaurants = ((Date.now() - startRestaurants) / 1000 / 60).toFixed(4);
    startReviews = Date.now();
    return db.seedReviews(); })
  .then(() => {
    startReviews = ((Date.now() - startReviews) / 1000 / 60).toFixed(4);
    startPhotos = Date.now();
    return db.seedPhotos(); })
  // .then(() => {
  //   startPhotos = ((Date.now() - startPhotos) / 1000 / 60).toFixed(4);
  //   startForeignKeys = Date.now();
  //   return db.addReviewForeignKeys(); })
  .then(() => {
    startPhotos = ((Date.now() - startPhotos) / 1000 / 60).toFixed(4);
    const used = process.memoryUsage();
    console.log('Memory:', used);
    console.log('Time to Seed Users:', startUser);
    console.log('Time to Seed Restaurants:', startRestaurants);
    console.log('Time to Seed Reviews:', startReviews);
    console.log('Time to Seed Photos:', startPhotos);
    console.log('Time to Seed All:', ((Date.now() - startAll) / 1000 / 60).toFixed(4));
    pool.end(); })
  .catch((err) => {
    console.log('err', err); });

module.exports = db; 