/* Demonstrate data retrieval with <Model>.find() using a filter by callsign*/

const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

/* To retrieve doc by field other than id, if no ref index is used,
   we do a full scan without using indexes which is expensive */
const airlineSchema = new Schema({
  callsign: String,
  country: String,
  name: String
})

// create model representing our airline
const Airline = model('Airline', airlineSchema)

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