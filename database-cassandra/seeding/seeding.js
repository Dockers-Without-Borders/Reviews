const faker = require('faker');
const path = require('path');
const restaurantsList = require('../restaurantList.js');
const photosList = require('../photosList.js');
const restaurants = restaurantsList.restaurants;
const maxphotosPerReview = 3;
const numUsers = 1000000;
const numRestaurants = 1000000; // leave equal to num users otherwise might break some function below
const numReviews = 1000000;
const maxQuery = 300;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const cassandra = require('cassandra-driver'); 
const authProvider = new cassandra.auth.PlainTextAuthProvider('root', 'AKK');
const contactPoints = ['127.0.0.1:9042'];
const keyspace = 'yelpreviews';
const client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: keyspace, localDataCenter: 'datacenter1'});
const { spawn } = require('child_process');

const writeToCsv = (header, records, filename) => {
  let csvWriter = createCsvWriter({
    path: `database-cassandra/seeding/csv/${filename}.csv`,
    header: header
  });
  console.log(`Writing ${filename}`);
  return csvWriter.writeRecords(records);
}

let db = {
  querySQL: function (query, successLog = 'Success') {
    return new Promise((resolve, reject) => {
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
  },

  seedUsers: async function () {
    const header = [
      {id: 'name', title: 'name'},
      {id: 'location', title: 'location'},
      {id: 'friends', title: 'friends'},
      {id: 'elite', title: 'elite'},
      {id: 'picture', title: 'picture'}
    ]
    let records = [];
    for (let i = 0; i < numUsers; i++) {
      let user = {}
      let firstName = faker.name.firstName().replace('\'', '');
      let lastInitial = String.fromCharCode(Math.floor((Math.random() * 26) + 65)) + '.';
      user.name = `${firstName} ${lastInitial}`;
      user.location = `${faker.address.city().replace('\'', '')}, ${faker.address.stateAbbr()}`;
      user.friends = Math.floor(Math.random() * 200);
      user.elite = Math.random() > .3 ? 1 : 0;
      user.picture = faker.image.avatar();

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

  seedReviews: async function () {
    const header = [
      {id: 'restname', title: 'restname'},
      {id: 'reviewtext', title: 'reviewtext'},
      {id: 'date', title: 'date'},
      {id: 'stars', title: 'stars'},
      {id: 'useful', title: 'useful'},
      {id: 'funny', title: 'funny'},
      {id: 'cool', title: 'cool'},
      {id: 'checkin', title: 'checkin'},
      {id: 'photocaption', title: 'photocaption'},
      {id: 'photo', title: 'photo'},
    ]
    let records = [];
    //select random restaurant and user
    for (let i = 0; i < numReviews; i++) {
      let review = {}
      review.restname = restaurants[Math.floor(Math.random() * restaurants.length - 1)];
      review.reviewtext = faker.lorem.paragraph();
      review.date = faker.date.recent(1600).toISOString().split('T')[0];
      review.stars = Math.floor(Math.random() * 4);
      review.useful = Math.floor(Math.random() * 4);
      review.funny = Math.floor(Math.random() * 4);
      review.cool = Math.floor(Math.random() * 4);
      review.checkin = Math.floor(Math.random() * 4);

      let numPics = Math.ceil(Math.random() * maxphotosPerReview);
      for (let i = 0; i < numPics; i++) {
        review.photo = photosList[Math.floor(Math.random() * photosList.length)];
        review.photocaption = 'DELICIOUS';
        records.push(review);
      }
    }
    return writeToCsv(header, records, 'reviews');
  }
}

let startAll = Date.now();
let startUser = Date.now();
let startReviews;
db.seedUsers()
  .then(() => {
    console.log('users csv written');
    startUser = ((Date.now() - startUser) / 1000 / 60).toFixed(4);
    startReviews = Date.now();
    return db.seedReviews(); })
  .then(() => {
    console.log('reviews csv written');
    startReviews = ((Date.now() - startReviews) / 1000 / 60).toFixed(4);
    const used = process.memoryUsage();
    console.log('Memory:', used);
    console.log('Time to build CSV for Users:', startUser);
    console.log('Time to build CSV for Reviews:', startReviews);
    console.log('Time to build CSV for All:', ((Date.now() - startAll) / 1000 / 60).toFixed(4));
    })
  // .then(() => {
  //   return new Promise((resolve, reject) => {
  //     const cqlsh = spawn('cqlsh');
  //     setTimeout(() => {
  //       cqlsh.stdin.write(`INSERT INTO yelpreviews.users(user_id, elite) VALUES ('Aston Khor', 5);`);
  //       cqlsh.stdout.on('data', (data) => {
  //         console.log('now writting');
  //       });
  //       console.log('hello')
  //       resolve();
  //     }, 1000)
      
  //   })
  // })
  // .then(() => {
  //   console.log(`Users seeded to Database in ${((Date.now() - startPhotos) / 1000 / 60).toFixed(4)}min`);
  //   startRestaurants = Date.now();
  //   let queryBin = [];
  //   for (let i = 0; i < 10; i++) {
  //     queryBin.push(db.querySQL(`\copy restaurants(restname) FROM '${path.resolve(__dirname, 'csv/restaurants.csv')}' DELIMITER ',' CSV HEADER;`, `Restaurants seeded ${i+1}mil`));
  //   }
  //   return Promise.all(queryBin);
  // })
  // .then(() => {
  //   console.log(`Users seeded to Database in ${((Date.now() - startRestaurants) / 1000 / 60).toFixed(4)}min`);
  //   startReviews = Date.now();
  //   let queryBin = [];
  //   for (let i = 0; i < 100; i++) {
  //     queryBin.push(db.querySQL(`\copy reviews(date, review, stars) FROM '${path.resolve(__dirname, 'csv/reviews.csv')}' DELIMITER ',' CSV HEADER;`, `Reviews seeded ${i+1}mil`));
  //   }
  //   return Promise.all(queryBin);
  // })
  // .then(() => {
  //   console.log(`Users seeded to Database in ${((Date.now() - startReviews) / 1000 / 60).toFixed(4)}min`);
  //   startPhotos = Date.now();
  //   let queryBin = [];
  //   for (let i = 0; i < 10; i++) {
  //     queryBin.push(db.querySQL(`\copy photos(photo, photocaption) FROM '${path.resolve(__dirname, 'csv/photos.csv')}' DELIMITER ',' CSV HEADER;`, `Photos seeded ${i+1}mil`));
  //   }
  //   return Promise.all(queryBin);
  // }) 
  // .then(() => { 
  //   console.log(`Users seeded to Database in ${((Date.now() - startPhotos) / 1000 / 60).toFixed(4)}min`);
  //   console.log(`Total time for csv and seeding: ${((Date.now() - startAll) / 1000 / 60).toFixed(4)}min`);

  //   pool.end(); })
  // .catch((err) => {
  //   console.log('err', err); });

module.exports = db; 

