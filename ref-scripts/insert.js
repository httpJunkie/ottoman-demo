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
// update this scheme with phone and Link

// create model representing our user
const Airline = model('Airline', schema, { 
  collectionName: 'Airlines', 
  scopeName: 'us'
})

// Creating a use that matches the model
const united = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'Couchbase Airlines'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
    console.log(`success: airline added`)
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


// runAsync()
//   .catch((e) => console.log(e))