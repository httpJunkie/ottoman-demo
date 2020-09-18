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

schema.index.findByName = {
  by: 'name',
  type: 'refdoc'
}

// create model representing our airline
const Airline = model('Airline', schema, {
  collectionName: 'Airlines',
  idKey: 'airlineId'
})

// Creating a use that matches the model
const united = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'Couchbase Airlines',
  airlineId: 'airline_couchbase'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
  } catch (error) {
    throw error
  }
}

let useCollections = true
ottoman.start({useCollections})
  .then(() => {
    runAsync()
      .then(() => {
        console.log(`success: airline added`)
        process.exit(0)}
      )
      .catch((error) => console.log(error))
  })
