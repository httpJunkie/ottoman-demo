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
  name: String
})

// Create refdoc index (faster for retrieve doc with id)
// since name is unique we want to create a ref index on our name
// this is immediately consistent by creating a referntial doc in db in addition to your doc. 
// For lookup purposes by key
schema.index.findByName = {
  by: 'name',
  type: 'refdoc'
}

// create model representing our airline
const Airline = model('Airline', schema)

// Creating a use that matches the model
const united = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'Couchbase Airlines'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
  } catch (error) {
    throw error
  }
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .then(() => {
        console.log(`success: airline added`)
        process.exit(0)}
      )
      .catch((error) => console.log(error))
  })