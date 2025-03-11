const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
  question:{
    type:String,
  },
  relatedHint:{
    type:String,
  }
});

const Hint = mongoose.model('Hint', hintSchema);
module.exports = Hint;