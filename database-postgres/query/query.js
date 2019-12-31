const { Pool } = require('pg');
const numQueries = 1;
const pool = new Pool({
  user: 'postgres',
  password: 'AKK',
  database: 'yelpreviews',
  port: 5432
});

let querySQL = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, function (err, resp) {
      if (err) {
        // console.log(query);
        console.log('query failed: ', err)
        reject('query error', err);
      } else {
        resolve(resp);
      }
    })
  });
}
let queryAllPrimary = (query) => {
  let queryBin = [];
  start = Date.now();
  for (let i = 0; i < numQueries; i++) {
    // queryBin.push(querySQL(`SELECT * FROM restaurants WHERE id = ${123456 + i}`));
    queryBin.push(querySQL(query));
  }
  return Promise.all(queryBin);
}
let queryAllSecondary = (query) => {
  let queryBin = [];
  start = Date.now();
  for (let i = 0; i < numQueries; i++) {
    queryBin.push(querySQL(query));
  }
  return Promise.all(queryBin);
}
let start;
let primaryQuery = `SELECT * FROM restaurants WHERE id = ${Math.floor(Math.random() * 1000000)}`;
let secondaryQuery = `SELECT * from restaurants rest INNER JOIN reviews rev ON rev.restaurant_id = rest.id INNER JOIN users u ON u.id = rev.user_id INNER JOIN photos p ON p.review_id = rev.id WHERE rest.id = ${Math.floor(Math.random() * 1000000)}`;
queryAllPrimary(primaryQuery)
.then((result) => {
  console.log('Postgres');
  console.log('Primary Data Query');
  console.log(`Query: ${primaryQuery}`);
  console.log('Status: 200');
  console.log(`Time to Query: ${(Date.now() - start)}ms`);
  console.log(`Result: ${JSON.stringify(result[0].rows[0])}\n\n`);
  start = Date.now();
  return queryAllSecondary(secondaryQuery);
})
.then((result)=> {
  console.log('Secondary Data Query');
  console.log(`Query: ${secondaryQuery}`);
  console.log('Status: 200');
  console.log(`Time to Query: ${(Date.now() - start)}ms`);
  console.log(`Result Length : ${JSON.stringify(result[0].rows[0])}\n\n`);
  pool.end();
})

