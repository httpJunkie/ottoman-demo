const { model, Schema } = require('ottoman');

const schema = new Schema({
  callsign: String,
  country: String,
  name: String
})

//create refdoc index
schema.index.findByName = {
  by: 'name',
  type: 'refdoc'
};

// create model representing our airline
const Airline = model('Airline', schema, {
  collectionName: 'Airlines',
  scopeName: 'us'
})

module.exports = Airline