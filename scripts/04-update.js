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
  collectionName: 'Airlines',
  scopeName: 'us'
})

// run the query
const runAsync = async() => {


  try {
    const filter = { callsign: 'Couchbase'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.findOne(filter, options)
    console.log('Airline Retrieved: ', result)

    // update the country using id of the result above
    await Airline.update({ country: 'United Kingdom' }, result.id)
  } catch (error) {
    throw error
  }

  try {
    // find an Airline by callsign
    const filter = { callsign: 'Couchbase'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const updatedResult = await Airline.findOne(filter, options)
    console.log('Airline Updated and Retrieved: ', updatedResult)
  }
  catch (error) {
    throw error
  }

  process.exit(0)
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .catch((e) => console.log(e))
  })
