/* Demonstrate data retrieval using refdoc Indexes */

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

//create refdoc index
// instructiong our model to use a ref index by name (document field: "name")
// remember *ref doc indexes are immediately consistent
schema.index.findByName = {
  by: 'name',
  type: 'refdoc'
}

// create model representing our airline
const Airline = model('Airline', schema, {
  collectionName: 'Airlines'
})

// run the query
const findByRefIndex = async() => {
  try {
    return await Airline.findByName('Couchbase Airlines')
  } catch (error) {
    throw error
  }
}

findByRefIndex()
  .then((result) => {
    console.log('Query Result: ', result)
    process.exit(0)
  })
  .catch((error) => console.log(error))
