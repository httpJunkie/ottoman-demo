/* Demonstrate model and schema creation and 
  persistance of data with ottoman.save() */

const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

// Create a standard schema for our diferent airline Models
const airlineSchema = new Schema({
  callsign: String,
  country: String,
  name: String
})

// Create refdoc index (faster for retrieve doc with id)
// since name is unique we want to create a ref index on our name
// this is immediately consistent by creating a referntial doc in db in addition 
// to your doc. For purposes of lookup by key
airlineSchema.index.findByName = {
  by: 'name',
  type: 'refdoc'
}

// create model representing our airline that uses airlineSchema
const Airline = model('Airline', airlineSchema)

// Create an Ariline that matches the model
const united = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'Couchbase Airlines'
})

// persist the United Airlines document to Couchbase Server
const saveDocument = async() => {
  try {
    await united.save()
  } catch (error) {
    throw error
  }
}

// Ensure that all indexes exist on the server
ottoman.ensureIndexes()
  // then let's save our document and print a success message 
  .then(async() => {
    saveDocument()
      .then(() => {
        console.log(`success: airline added`)
        process.exit(0)}
      )
      .catch((error) => console.log(error))
  })
  