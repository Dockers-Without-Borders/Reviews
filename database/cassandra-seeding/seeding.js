const faker = require('faker');
const path = require('path');
const { Pool, Client } = require('pg');
const restaurantsList = require('../restaurantList.js');
const photosList = require('../photosList.js');
const restaurants = restaurantsList.restaurants;
const maxIntents = 4000;
const maxphotosPerReview = 3;
const numUsers = 1000000;
const numRestaurants = 1000000; // leave equal to num users otherwise might break some function below
const numReviews = 10000000;
const reviewsPerRest = numReviews/ numRestaurants;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const pool = new Pool({
  user: 'postgres',
  password: 'AKK',
  database: 'yelpreviews',
  port: 5432
});

const writeToCsv = (header, records, filename) => {
  let csvWriter = createCsvWriter({
    path: `database/postgres-seeding/csv/${filename}.csv`,
    header: header
  });
  console.log(`Writing ${filename}`);
  return csvWriter.writeRecords(records);
}

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
    const header = [
      {id: 'restname', title: 'restname'}
    ]
    let records = []
    for (let i = 0; i < numRestaurants; i++) {
      records.push({ restname: restaurants[Math.floor(Math.random() * restaurants.length - 1)]});
    }
    return writeToCsv(header, records, 'restaurants');
  },

  seedUsers: async function () {
    let count = 0;
    let query = `INSERT INTO users (name, location, friends, elite, picture) VALUES `;
    const header = [
      {id: 'name', title: 'name'},
      {id: 'location', title: 'location'},
      {id: 'friends', title: 'friends'},
      {id: 'elite', title: 'elite'},
      {id: 'picture', title: 'picture'}
    ]
    let records = [];
    let firstName, lastInitial, chanceOfElite;
    for (let i = 0; i < numUsers; i++) {
      let user = {}
      firstName = faker.name.firstName().replace('\'', '');
      lastInitial = String.fromCharCode(Math.floor((Math.random() * 26) + 65)) + '.';
      user.name = `${firstName} ${lastInitial}`;
      user.location = `${faker.address.city().replace('\'', '')}, ${faker.address.stateAbbr()}`;
      user.friends = Math.floor(Math.random() * 200);
      chanceOfElite = Math.floor(Math.random() * 9);
      user.elite = 0;
      user.picture = faker.image.avatar();

      //10% chance of elite status
      if (chanceOfElite < 1) {
        user.elite = 1;
      }
      records.push(user);
    }
    return writeToCsv(header, records, 'users');
    
  },

  seedReviews: async function () {
    const header = [
      {id: 'date', title: 'date'},
      {id: 'review', title: 'review'},
      {id: 'stars', title: 'stars'}
      //add in user and rest aurant foriegn key ids
    ]
    let records = [];
    //select random restaurant and user
    for (let i = 0; i < numReviews; i++) {
      let review = {};
      review.date = faker.date.recent(1600).toISOString().split('T')[0];
      review.review = faker.lorem.paragraph();
      review.stars = Math.floor(Math.random() * 4) + 1;

      records.push(review);
    }
    return writeToCsv(header, records, 'reviews');
  },

  seedPhotos: async function () {
    const header = [
      {id: 'photo', title: 'photo'},
      {id: 'photocaption', title: 'photocaption'}
    ]
    let records = [];
    let numPics;
    //select random restaurant and user
    for (let i = 0; i < numReviews; i++) {
      let photo = {};
      numPics = Math.ceil(Math.random() * maxphotosPerReview);
      for (let i = 0; i < numPics; i++) {
        photo.photo = photosList[Math.floor(Math.random() * photosList.length)];
        photo.photocaption = 'DELICIOUS';
        records.push(photo);
      }
    }
    return writeToCsv(header, records, 'photos');
  }
}
let startAll = Date.now();
let startUser = Date.now();
let startRestaurants, startReviews, startPhotos, startForeignKeys;
db.seedUsers()
  .then(() => {
    console.log('users csv written');
    startUser = ((Date.now() - startUser) / 1000 / 60).toFixed(4);
    startRestaurants = Date.now();
    return db.seedRestaurants(); })
  .then(() => {
    console.log('restaurants csv written');
    startRestaurants = ((Date.now() - startRestaurants) / 1000 / 60).toFixed(4);
    startReviews = Date.now();
    return db.seedReviews(); })
  .then(() => {
    console.log('reviews csv written');
    startReviews = ((Date.now() - startReviews) / 1000 / 60).toFixed(4);
    startPhotos = Date.now();
    return db.seedPhotos(); })
  .then(() => {
    console.log('photos csv written');
    startPhotos = ((Date.now() - startPhotos) / 1000 / 60).toFixed(4);
    const used = process.memoryUsage();
    console.log('Memory:', used);
    console.log('Time to Seed Users:', startUser);
    console.log('Time to Seed Restaurants:', startRestaurants);
    console.log('Time to Seed Reviews:', startReviews);
    console.log('Time to Seed Photos:', startPhotos);
    console.log('Time to Seed All:', ((Date.now() - startAll) / 1000 / 60).toFixed(4));
    return db.querySQL(`\copy users(name,location,friends,elite,picture) FROM '${path.resolve(__dirname, 'csv/users.csv')}' DELIMITER ',' CSV HEADER;`, 'Users seeded'); })
  .then(() => db.querySQL(`\copy restaurants(restname) FROM '${path.resolve(__dirname, 'csv/restaurants.csv')}' DELIMITER ',' CSV HEADER;`, 'Restaurants seeded'))
  .then(() => db.querySQL(`\copy reviews(date, review, stars) FROM '${path.resolve(__dirname, 'csv/reviews.csv')}' DELIMITER ',' CSV HEADER;`, 'Reviews seeded'))
  .then(() => db.querySQL(`\copy photos(photo, photocaption) FROM '${path.resolve(__dirname, 'csv/photos.csv')}' DELIMITER ',' CSV HEADER;`, 'Photos seeded')) 
  .then(() => { 
    pool.end(); })
  .catch((err) => {
    console.log('err', err); });

module.exports = db; 