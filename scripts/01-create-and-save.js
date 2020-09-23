/* Demonstrate model and schema creation and persistence 
  of data with ottoman.save() */
const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

// Create a standard schema for airline Models
const airlineSchema = new Schema({
  callsign: String,
  country: String,
  name: String
})

/* Create refdoc index (faster for retrieving docs with id)
  since name is unique we want to create a ref index on our name
  this is immediately consistent by creating a referential doc in db 
  in addition to our airline document. For purposes of lookup by key */
airlineSchema.index.findByName = {
  by: 'name',
  type: 'refdoc'
}

const Airline = model('Airline', airlineSchema)

// Create an Ariline using our Airline model
const cbAirlines = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'Couchbase Airlines'
})

// Persist the Couchbase Airlines document to Couchbase Server
const saveDocument = async() => {
  try {
    await cbAirlines.save()
  } catch (error) {
    throw error
  }
}

// Ensure that all indexes exist on the server
ottoman.ensureIndexes()
  // Next, let's save our document and print a success message 
  .then(async() => {
    saveDocument()
      .then(() => {
        console.log(`success: airline added`)
        process.exit(0)}
      )
      .catch((error) => console.log(error))
  })
  