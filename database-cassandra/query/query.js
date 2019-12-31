const cassandra = require('cassandra-driver'); 
const authProvider = new cassandra.auth.PlainTextAuthProvider('root', 'AKK');
const contactPoints = ['127.0.0.1:9042'];
const keyspace = 'yelpreviews';
const client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: keyspace, localDataCenter: 'datacenter1'});

let getTimeFrame = (cb) => {
  client
    .execute(`SELECT * FROM yelpreviews.restreviews WHERE rest_id = 5324132`)
    .then(result => {
      cb(null, result.rows)
    })
    .catch( err => {
      cb(err);
    });
}
let start = Date.now();
getTimeFrame((err, result, other) => {
  if (err) throw err;
  console.log('Cassandra')
  console.log('Status: 200');
  console.log(`Time to Query: ${(Date.now() - start)}ms`);
  console.log(`Result: ${JSON.stringify(result)}\n\n`);
  client.shutdown();
})