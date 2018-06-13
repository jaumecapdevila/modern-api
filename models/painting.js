const moongose = require('mongoose');

const Schema = moongose.Schema;

const paintingSchema = new Schema({
  name: String,
  url: String,
  technique: String,
});

module.exports = moongose.model('Painting', paintingSchema);
