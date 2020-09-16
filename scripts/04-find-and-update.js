const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

// create connection to database/bucket
ottoman.connect({
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
const Airline = model('Airline', schema)

// run the query
const findAirline = async() => {
  try {
    const filter = { callsign: 'Couchbase'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.findOne(filter, options)
    console.log(`Airline found: `)
    console.log(result)
    return result
  } catch (error) {
    throw error
  }
}

const updateAirline = async(airline) => {
  try {
    // update the country using id of the result above
    await Airline.update({ country: 'United Kingdom' }, airline.id)
    console.log('Airline update success')
  }
  catch (error) {
    throw error
  }
}

findAirline()
  .then((airline) => {
    updateAirline(airline)
      .then(() => {
        findAirline()
        .then(() => process.exit(0))
      })
  })
  .catch((error) => console.log(error))
