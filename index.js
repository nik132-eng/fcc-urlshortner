require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const shortId = require('shortid');

const urls = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(__dirname+`/public`));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res)=>{
  const longurl = req.body.url;
  const id = shortId.generate();

  urls[id] = longurl;

  res.json({ original_url: longurl, short_url: id }); 
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  const url = urls[id];

  if (url) {
    res.redirect(url);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
