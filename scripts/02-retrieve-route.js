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

// create model representing our airline
const Airline = model('Airline', schema, {
  collectionName: 'Airlines', scopeName: 'us'
})

const routeSchema = new Schema({
  source_airport: String,
  destination_airport: String,
  airline: { type: String, ref: 'Airline' },
  stops: { type: Number, default: 0 }
})

const Route = model('Route', routeSchema, {
  collectionName: 'Routes',
  scopeName: 'us'
})

// run the query
const runAsync = async() => {
  try {
    const filter = { destination_airport: 'DFW'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL,  limit:1,  populate:'airline' }
    const result = await Route.find(filter, options)
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
