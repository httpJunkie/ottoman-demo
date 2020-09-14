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
  name: String,
  modifiedBy: String
})

schema.pre('save', function(document) {
  document.modifiedBy = 'arun vijayraghvan'
});

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

// Creating a use that matches the model
const united = new Airline({
  callsign: 'Emirates',
  country: 'United States',
  name: 'Emirates Airlines'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
    console.log(`success: airline added`)
  } catch (error) {
    throw error
  }
  //process.exit(0)
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .catch((e) => console.log(e))
  })
