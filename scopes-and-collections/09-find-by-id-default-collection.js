const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

// create connection to database/bucket
ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

const schema = new Schema({
  callsign: String,
  country: String,
  name: String,
  airlineId: String
})

// create model representing our airline
const Airline = model('Airline', schema, {
  idKey: 'airlineId'
})

// run the query
const findAirline = async() => {
  try {
    const result = await Airline.findById('airline_couchbase')
    console.log(`Airline found: `)
    console.log(result)
    return result
  } catch (error) {
    throw error
  }
}

findAirline()
  .then(() => process.exit(0))
  .catch((error) => console.log(error))
