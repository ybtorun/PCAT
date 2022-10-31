const mongoose = require('mongoose');
const schema = mongoose.Schema;

//connect db
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create schema
const photoSchema = new schema({
  title: String,
  description: String,
});

//create model
const Photo = mongoose.model('Photo', photoSchema);

//create a photo
// Photo.create({
//   title: 'Photo title 2',
//   description: 'Photo description 2 lorem ipsum',
// });

//read a photo
// Photo.find({}, (err, data) => {
//   console.log(data);
// });

//update photo
const id = '634d4034e22d15473f33d3d3';

// Photo.findByIdAndUpdate(
//   id,
//   {
//     title: 'Photo title 12 updated',
//     description: 'Photo description 12 updated',
//   },
//   {
//     new: true,
//   },
//   (err, data) => {
//     console.log(data);
//   }
// );

//delete a photo
Photo.findByIdAndDelete(id, (err,data) => {
  console.log('Photo is removed...');
});
