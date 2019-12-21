const assert = require('assert');
const cassandra = require('cassandra-driver'); 
const authProvider = new cassandra.auth.PlainTextAuthProvider('root', 'AKK');
const contactPoints = ['127.0.0.1:9042'];
const keyspace = 'yelpreviews';
const client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: keyspace});

//Ensure all queries are executed before exit
function execute(query, params, callback) {
  return new Promise((resolve, reject) => {
    client.execute(query, params, (err, result) => {
      if(err) {
        reject()
      } else {
        callback(err, result);
        resolve()
      }
    });
  });
}


//Execute the queries 
var query = `INSERT INTO ${keyspace}.`;
var q1 = execute(query, ['oranges'], (err, result) => { assert.ifError(err); console.log('The cost per orange is $' + result.rows[0].price_p_item)});
var q2 = execute(query, ['pineapples'], (err,result) => { assert.ifError(err); console.log('The cost per pineapple is $' + result.rows[0].price_p_item)});
var q3 = execute(query, ['apples'], (err,result) => { assert.ifError(err); console.log('The cost per apple is $' + result.rows[0].price_p_item)});
Promise.all([q1,q2,q3]).then(() => {
  console.log('exit');
  process.exit();
});


// let mysqlQueries = {

//   getReviews: function(name, callback) {
//     connection.query(`SELECT * from restaurants WHERE restname = '${name}';`, function(err, data) {
//       if(err) {
//         console.log('mysql error');
//       } else {
//         callback(null, data);
//       }
//    });
//   },

//   getRestaurantReviews: function(name, sort, callback) {
//     let direction = '';
//     let sortBy = ''
//     if(sort === 'Oldest' || sort === 'Newest'){ 
//       sortBy = 'date';
//       sort === 'Oldest' ? direction = 'ASC' : direction = 'DESC';
//     }
//     if(sort === 'Highest' || sort === 'Lowest'){ 
//       sortBy = 'stars';
//       sort === 'Highest' ? direction = 'DESC' : direction = 'ASC';
//     }
//     connection.query(`SELECT * FROM restaurants INNER JOIN reviews ON restaurants.id = reviews.restaurant_id INNER JOIN users ON users.id = reviews.user_id LEFT JOIN reviewPictures ON reviewPictures.review_id = reviews.id WHERE restaurants.restname = '${name}' ORDER BY reviews.${sortBy} ${direction} LIMIT 20;`, function(err, data) {
//       if(err) {
//         console.log('get restaurant review error');
//       } else {
//         callback(null, data);
//       }
//     });
//   }
// }

module.exports = mysqlQueries;