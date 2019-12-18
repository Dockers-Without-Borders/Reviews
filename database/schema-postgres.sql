DROP DATABASE IF EXISTS yelpreviews;

CREATE DATABASE yelpreviews;

\c yelpreviews;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  restname varchar(50) not null
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name varchar(20) not null,
  location varchar(30) not null,
  friends smallint default 0,
  elite smallint default 0,
  picture varchar(150) not null,
  numReviews smallint default 0,
  numPics smallint default 0
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  date date not null,
  review text not null,
  stars smallint not null,
  useful smallint default 0,
  funny smallint default 0,
  cool smallint default 0,
  user_id int,
  restaurant_id int,
  foreign key (user_id) references users(id),
  foreign key (restaurant_id) references restaurants(id)
);

CREATE TABLE reviewPictures (
  id SERIAL PRIMARY KEY,
  links varchar(1200),
  review_id int not null,
  foreign key (review_id) references reviews(id)
);