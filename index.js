import express from 'express';
import { add } from './jsonFileStorage.js';
import { read } from '../../week4/day5/noodles-express-bootcamp/jsonFileStorage.js';

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const handleSightingFormRequest = (req, res) => {
  add('data.json', 'sightings', req.body, (err) => { console.log(err); });
  res.redirect('/sightingForm');
};

app.get('/sightingForm', (req, res) => {
  res.render('sightingForm', {});
});
app.get('/', (req, res) => {
  read('data.json', (err, content) => {
    const data = { sightings: content };
    res.render('root', data);
  });
});
app.get('/sighting/:index', (req, res) => {
  read('data.json', (err, content) => {
    const data = { sightings: content.sightings[req.params.index] };
    res.render('sightings', data);
  });
});
app.post('/sightingForm', handleSightingFormRequest);
app.get('/shapes/:shape', (req, res) => {
  read('data.json', (err, content) => {
    const data = { data: [], shape: req.params.shape };
    content.sightings.forEach((element) => {
      if (element.shape === req.params.shape) {
        data.data.push(element);
        console.log(data.data);
      }
    });
    console.log(data.data);
    res.render('shapesIndiv', data);
  });
});
app.get('/shape', (req, res) => {
  read('data.json', (err, content) => {
    const shapesArr = [];
    let data;
    content.sightings.forEach((element) => {
      if (!shapesArr.includes(element.shape)) {
        shapesArr.push(element.shape);
      }
      data = { data: shapesArr };
    });
    res.render('shapes', data);
  });
});

app.listen(3004);
console.log('https://localhost:3004');
