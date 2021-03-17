/* Validate a field on Model.save() using Ottoman addValidators()  */
const { Ottoman, Schema } = require('ottoman')
const ottoman = new Ottoman({collectionName: '_default'});

ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

const regx = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
const airlineSchema = new Schema({ 
  callsign: String, 
  country: String, 
  name: String,
  phone: { type: String, validator: {regexp: regx, message: 'phone invalid'}}
})

const Airline = ottoman.model('Airline', airlineSchema)

const cbAirlines = new Airline({
  callsign: 'UA',
  country: 'United States',
  name: 'United Airlines',
  phone: 'X-Z32-800-490-2021'
})

const saveDocument = async() => {
  try {
    await cbAirlines.save()
  } catch (error) {
    throw error
  }
}

saveDocument()
  .catch((error) => {
    console.log(error.message)
    process.exit(0)
  })