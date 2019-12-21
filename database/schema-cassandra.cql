CREATE keyspace YelpReviews
  with replication = {
    'class': 'SampleStrategy',
    'replication_factor': 3
  };

use YelpReviews;

CREATE TABLE restReviews (
  restname varchar PRIMARY KEY,
  reviewtext varchar,
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

CREATE TABLE users (
  user_id varchar PRIMARY KEY,
  location varchar,
  friends int,
  elite boolean,
  picture varchar,
  numReviews int,
  numPics int
);
