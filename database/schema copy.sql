DROP DATABASE IF EXISTS yelpreviews;

CREATE DATABASE yelpreviews;

USE yelpreviews;

CREATE TABLE restaurants (
  id int not null auto_increment,
  restname varchar(50) not null,
  primary key(id)
);

CREATE TABLE users (
  id int not null auto_increment,
  name varchar(20) not null,
  location varchar(30) not null,
  friends smallint default 0,
  elite tinyint(1) default 0,
  picture varchar(150) not null,
  numReviews smallint default 0,
  numPics smallint default 0,
  primary key(id)
);

CREATE TABLE reviews (
  id int not null auto_increment primary key,
  date date not null,
  review text not null,
  stars tinyint not null,
  useful tinyint default 0,
  funny tinyint default 0,
  cool tinyint default 0,
  user_id int,
  restaurant_id int,
  foreign key (user_id) references users(id),
  foreign key (restaurant_id) references restaurants(id)
);

CREATE TABLE reviewPictures (
  id int not null auto_increment primary key,
  links varchar(1200),
  review_id int not null,
  foreign key (review_id) references reviews(id)
);