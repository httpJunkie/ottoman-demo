require('dotenv').config()
const { CB_USER, CB_PASS, BUCKET } = process.env
const ottoman = require('ottoman')
const { model, Schema } = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

// create a model of users
const Airline = connection.model('Airline', schema, { collectionName: 'Airlines', scopeName: 'us', })

// Creating a use that matches the model
const united = new Airline({
  callsign: 'UNITED',
  country: 'United States',
  name: 'United Airline'
})

// run the query
const runAsync = async() => {
  try {
    const filter = { callsign: 'UNITED'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.find(filter, options)
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
