DROP DATABASE IF EXISTS yelpreviews;

CREATE DATABASE yelpreviews;

\c yelpreviews;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  restname varchar(50)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name varchar(20) not null,
  location varchar(30) not null,
  friends smallint default 0,
  elite smallint default 0,
  picture varchar(150) not null,
  numreviews smallint default 0,
  numpics smallint default 0
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  date date not null,
  review text not null,
  stars smallint not null,
  useful smallint default 0,
  funny smallint default 0,
  cool smallint default 0,
  checkins smallint default 0,
  responseid int, 
  user_id int,
  restaurant_id int
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  review_id int,
  photo varchar(120),
  photocaption varchar(50)
);

CREATE INDEX idx_restaurant_id ON reviews USING HASH (restaurant_id);

CREATE INDEX idx_restaurant_id ON reviews USING HASH (restaurant_id);

CREATE INDEX idx_review_id on photos USING HASH (review_id);