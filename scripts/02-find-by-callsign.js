/* Demonstrate data retrieval using filter and <Model>.find() */

const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

// create connection to database/bucket
ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

// to retrieve doc by field other than id
// if no ref index, we do a full scan without using indexes which is expensive
const schema = new Schema({
  callsign: String,
  country: String,
  name: String
})

// create model representing our airline
const Airline = model('Airline', schema)

// run the query
const findByCallsign = async() => {
  try {
    const filter = { callsign: 'Couchbase'}
    // global will wait for all data from multiple nodes to catch up
    // local will only worry about this node being consistent
    // we are not worried about global consistency here
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    return await Airline.find(filter, options)
  } catch (error) {
    throw error
  }
}


findByCallsign()
  .then((result) => {
    console.log('Query Result: ', result)
    process.exit(0)
  })
  .catch((error) => console.log(error))
