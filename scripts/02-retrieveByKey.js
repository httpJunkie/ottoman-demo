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
  airlineId:String,
  callsign: String,
  country: String,
  name: String,
  modifiedBy: String
})

// create model representing our airline
const Airline = model('Airline', schema, {
  collectionName: 'Airlines',
  scopeName: 'us',
  idkey:'airlineId'
})

// run the query
const runAsync = async() => {
  try {
    const filter = { callsign: 'Emirates'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.find(filter, options)
    console.log('Query Result: ', result._getId())
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
