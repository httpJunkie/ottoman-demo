require('dotenv').config()
const { CB_USER, CB_PASS, BUCKET } = process.env
const ottoman = require('ottoman')

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: BUCKET,
  username: CB_USER,
  password: CB_PASS
});

// create a model of users
const Airline = connection.model('Airline', {
  callsign: String,
  country: String,
  name: String
})

// run the query
const runAsync = async() => {
  try {
    const filter = { callsign: 'UNITED'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.find(filter, options)
    console.log('Query Result: ', result.rows)
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
