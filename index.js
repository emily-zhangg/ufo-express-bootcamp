import express from 'express';
import methodOverride from 'method-override';
import { add, read, write } from './jsonFileStorage.js';

const app = express();
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const handleSightingFormRequest = (req, res) => {
  let invalidInput = false;
  for (let i = 0; i < Object.values(req.body).length; i += 1) {
    if (Object.values(req.body)[i] === '') {
      invalidInput = true;
    }
  }
  const timeSubmitted = new Date();
  req.body.dateCreated = timeSubmitted.toISOString().slice(0, 10);
  add('data.json', 'sightings', req.body, (err) => { console.log(err); });
  if (invalidInput === true) { res.send('Please do not leave any field empty'); } else { res.redirect('/sightingForm'); }
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
app.get('/sighting/:index/edit', (req, res) => {
  read('data.json', (err, content) => {
    const data = { index: req.params.index, data: content.sightings[req.params.index] };
    res.render('sightingsEditForm', data);
  });
});
app.put('/sighting/:index/edit', (req, res) => {
  read('data.json', (err, content) => {
    content.sightings[req.params.index] = req.body;
    console.log(req.body);
    write('data.json', content, (err, content) => {
    });
    res.render('notif', { message: 'You have successfully edited the UFO entry' });
  });
});
app.delete('/:index', (req, res) => {
  read('data.json', (err, content) => {
    content.sightings.splice(Number(req.params.index), 1);
    write('data.json', content, (err, content) => {
    });
    res.render('notif', { message: 'You have successfully deleted the UFO entry' });
  });
});
app.listen(3004);
console.log('https://localhost:3004');
