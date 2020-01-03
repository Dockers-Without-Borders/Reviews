const assert = require('assert');
const cassandra = require('cassandra-driver'); 
const authProvider = new cassandra.auth.PlainTextAuthProvider('root', 'AKK');
const contactPoints = ['127.0.0.1:9042'];
const keyspace = 'yelpreviews';
const client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: keyspace, localDataCenter: 'datacenter1'});
let restRows = 0;
let userRows = 0;

//Ensure all queries are executed before exit
function execute(query, callback) {
  return new Promise((resolve, reject) => {
    client.execute(query, (err, result) => {
      if(err) {
        console.log(err);
        console.log('rejected');
        reject()
      } else {
        callback(err, result);
        resolve()
      }
    });
  });
}



let dbQueries = {

  createReviews: function(restInfo, callback) {
    execute(`INSERT INTO ${keyspace}.restreviews(rest_id, restname, reviewtext, date, photo, user_id) VALUES (${restInfo.rest_id},${restInfo.restname}, ${restInfo.reviewtext}, ${restInfo.date}, ${restInfo.photo}, ${restInfo.user_id});`, function(err, data) {
      if(err) {
        console.log('error on create');
      } else {
        callback(null, data);
      }
   });
  },

  readReviews: function(rest_id, callback) {
    execute(`SELECT * from ${keyspace}.restreviews WHERE rest_id = ${rest_id};`, function(err, data) {
      if(err) {
        console.log('mysql error');
      } else {
        callback(null, data);
      }
   });
  },

  updateReviews: function(text, id, callback) {
    execute(`UPDATE ${keyspace}.restreviews SET reviewtext = ${text} WHERE rest_id = ${id};`, function(err, data) {
      if(err) {
        console.log('mysql error');
      } else {
        callback(null, data);
      }
   });
  },

  deleteReviews: function(text, id, callback) {
    execute(`DELETE FROM ${keyspace}.restreviews WHERE reviewtext = ${text} AND rest_id = ${id};`, function(err, data) {
      if(err) {
        console.log('mysql error');
      } else {
        callback(null, data);
      }
   });
  },

  readUsers: function(user_id, callback) {
    execute(`SELECT * FROM ${keyspace}.users WHERE user_id = ${user_id}`, function(err, data) {
      if(err) {
        console.log('get restaurant review error');
      } else {
        callback(null, data);
      }
    });
  }
}

module.exports = dbQueries;