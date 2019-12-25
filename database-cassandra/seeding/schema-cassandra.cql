DROP TABLE IF EXISTS yelpreviews.restReviews ;
DROP TABLE IF EXISTS yelpreviews.users ;
DROP KEYSPACE IF EXISTS yelpreviews;

CREATE KEYSPACE IF NOT EXISTS yelpreviews
  with replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
  };

CREATE TABLE yelpreviews.restReviews (
  restname varchar,
  reviewtext varchar,
  date varchar,
  stars int,
  useful int,
  funny int,
  cool varchar,
  checkin int,
  response_id varchar,
  photocaption varchar,
  photo varchar,
  user_id varchar,
  PRIMARY KEY (restname, user_id)
);

CREATE TABLE yelpreviews.users (
  user_id varchar PRIMARY KEY,
  location varchar,
  friends int,
  elite int,
  picture varchar,
  numReviews int,
  numPics int
);
