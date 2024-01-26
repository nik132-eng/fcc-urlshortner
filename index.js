require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const shortId = require('shortid');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const urls = {};

const isValidUrl = (url) => {
  // Use a regular expression to check if the URL follows the valid format
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
};

const port = process.env.PORT || 3000;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const longurl = req.body.url;

  // Check if the URL is valid
  if (!isValidUrl(longurl)) {
    return res.json({ error: 'invalid url' });
  }

  const id = shortId.generate();
  urls[id] = longurl;

  res.json({ original_url: longurl, short_url: id });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const url = urls[id];

  if (url) {
    res.redirect(url);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
