const express = require('express');
const db = require('../database/model.js');
const app = express();
const cors = require('cors');
const port = 3003;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/restaurantReviews/:name&:sort', function(req, res) {
  let name = req.params.name;
  let sort = req.params.sort;
  db.getRestaurantReviews(name, sort, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.get('/restaurantReviews/:name&:sort', function(req, res) {
  let name = req.params.name;
  let sort = req.params.sort;
  db.getRestaurantReviews(name, sort, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.put('/restaurantReviews/:name&:sort', function(req, res) {
  let name = req.params.name;
  let sort = req.params.sort;
  db.getRestaurantReviews(name, sort, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.delete('/restaurantReviews/:name&:sort', function(req, res) {
  let name = req.params.name;
  let sort = req.params.sort;
  db.getRestaurantReviews(name, sort, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});



app.post('/uploadAWS', function(req, res) {
  console.log(req.image);
});

app.listen(port, console.log(`Listening on port ${port}`));