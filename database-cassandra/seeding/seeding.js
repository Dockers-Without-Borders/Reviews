const faker = require('faker');
const path = require('path');
const restaurantsList = require('../restaurantList.js');
const photosList = require('../photosList.js');
const restaurants = restaurantsList.restaurants;
const maxphotosPerReview = 3;
let numUsers = 1000000;
let numReviews = 10000000;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const writeUsers = fs.createWriteStream('database-cassandra/seeding/csv/users.csv');
writeUsers.write('user_id,username,location,friends,elite,picture\n', 'utf8');
const writeReviews = fs.createWriteStream('database-cassandra/seeding/csv/reviews.csv');
writeReviews.write('rest_id,restname,reviewtext,date,stars,useful,funny,cool,checkin,photocaption,photo\n', 'utf8');

const cassandra = require('cassandra-driver'); 
const authProvider = new cassandra.auth.PlainTextAuthProvider('root', 'AKK');
const contactPoints = ['127.0.0.1:9042'];
const keyspace = 'yelpreviews';
const client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: keyspace, localDataCenter: 'datacenter1'});

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
    function writeOneMillionUsers(writer, encoding, callback) {
      let id = 0;
      function write() {
        let ok = true;
        while (numUsers > 0 && ok) {
          id++;
          numUsers--;
          let firstName = faker.name.firstName().replace('\'', '');
          let lastInitial = String.fromCharCode(Math.floor((Math.random() * 26) + 65)) + '.';
          let user_id = id;
          let username = `${firstName} ${lastInitial}`;
          let location = `${faker.address.city().replace('\'', '')} ${faker.address.stateAbbr()}`;
          let friends = Math.floor(Math.random() * 200);
          let elite = Math.random() > .3 ? 1 : 0;
          let picture = faker.image.avatar();
          let data = `${user_id},${username},'${location}',${friends},${elite},${picture}\n`;
          if (numUsers === 0) {
            writer.write(data, encoding, callback);
          } else {
            ok = writer.write(data, encoding);
          }
        }
        if (numUsers > 0) {
          writer.once('drain', write);
        }
      }
    write()
    }
    return new Promise((resolve, reject) => {
      writeOneMillionUsers(writeUsers, 'utf-8', () => {
        console.log('End users stream');
        resolve();
        writeUsers.end();
      });
    })
  },

  seedReviews: async function () {
    function writeTenMillionReviews(writer, encoding, callback) {
      let id = 0;
      function write() {
        let ok = true;
        while (numReviews > 0 && ok) {
          id++;
          numReviews--;
          let rest_id = id;
          let restname = restaurants[Math.floor(Math.random() * restaurants.length - 1)];
          let reviewtext = faker.lorem.paragraph();
          let date = faker.date.recent(1600).toISOString().split('T')[0];
          let stars = Math.floor(Math.random() * 4);
          let useful = Math.floor(Math.random() * 4);
          let funny = Math.floor(Math.random() * 4);
          let cool = Math.floor(Math.random() * 4);
          let checkin = Math.floor(Math.random() * 4);
          
          let numPics = Math.ceil(Math.random() * maxphotosPerReview);
          for (let i = 0; i < numPics; i++) {
            let photo = photosList[Math.floor(Math.random() * photosList.length)];
            let photocaption = 'DELICIOUS';
            let data = `${rest_id},${restname},${reviewtext},${date},${stars},${useful},${funny},${cool},${checkin},${photocaption},${photo}\n`;
            if (numReviews === 0) {
              writer.write(data, encoding, callback);
            } else {
              ok = writer.write(data, encoding);
            }
          }
        }
        if (numReviews > 0) {
          writer.once('drain', write);
        }
      }
    write()
    }
    return new Promise((resolve, reject) => {
      writeTenMillionReviews(writeReviews, 'utf-8', () => {
        console.log('End reviews stream');
        writeReviews.end();
        resolve();
      });
    })
  }
}

let startAll = Date.now();
let startUser = Date.now();
let startReviews;
console.log('Writing user csv');
db.seedUsers()
  .then(() => {
    console.log('Users csv written');
    startUser = ((Date.now() - startUser) / 1000 / 60).toFixed(4);
    startReviews = Date.now();
    console.log('Writing reviews csv');
    return db.seedReviews(); })
  .then(() => {
    console.log('Reviews csv written');
    startReviews = ((Date.now() - startReviews) / 1000 / 60).toFixed(4);
    const used = process.memoryUsage();
    console.log('Memory:', used);
    console.log('Time to build CSV for Users:', startUser);
    console.log('Time to build CSV for Reviews:', startReviews);
    console.log('Time to build CSV for All:', ((Date.now() - startAll) / 1000 / 60).toFixed(4));
    })

module.exports = db; 
