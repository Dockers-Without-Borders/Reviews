require('newrelic');
const express = require('express');
const db = require('../database-cassandra/model.js');
const app = express();
const cors = require('cors');
const port = 3003;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/restaurantReviews/:name', function(req, res) {
  let info = {
    rest_id: 123456,
    restname: `Charlie's Choco Facto`,
    reviewText: `This place was so cool`,
    date: 'Jan 25th 2020',
    photo: `thephoto.com`,
    user_id: `The guy posting`
  }
  db.createReviews(info, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.get('/restaurantReviews/:name', function(req, res) {
  let rest_id = 12345
  db.readReviews(rest_id, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.put('/restaurantReviews/:name', function(req, res) {
  let text = `This is the best food I've ever had`;
  let id = 123456;
  db.updateReviews(text, id, function(err, data) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.delete('/restaurantReviews/:name', function(req, res) {
  let text = `This is the best food I've ever had`;
  let id = 123456;
  db.deleteReviews(rext, id, function(err, data) {
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