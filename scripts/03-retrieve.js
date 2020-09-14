/*Demonstrate data retrieval using refdoc Indexes*/

const ottoman = require('ottoman')
const { model, Schema } = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

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
  collectionName: 'Airlines', scopeName: 'us'
})

// run the query
const runAsync = async() => {
  try {
    const result = await Airline.findByName('Couchbase Airlines');
    console.log('Query Result: ', result)
  } catch (error) {
    throw error
  }
  process.exit(0)
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .catch((e) => console.log(e))
  })
