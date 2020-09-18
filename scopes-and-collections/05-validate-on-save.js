const ottoman = require('ottoman')
const { Schema } = require('ottoman')
const chalk = require("chalk")

const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

ottoman.addValidators({
  phone: (value) => {
    const phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    if(value && !value.match(phone)) {
      throw new Error(`Phone ${chalk.red.bold(value)} is invalid`)
    }
  }
})

const schema = new Schema({
  callsign: String,
  country: String,
  name: String,
  phone: { type: String, validator: 'phone'}
})

const Airline = connection.model('Airline', schema, {
  collectionName: 'Airlines'
})

const model = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'United Airlines',
  phone: 'X-Z32-800-490-2021'
})

const saveDocument = async() => {
  try {
    await model.save()
  } catch (error) {
    throw error
  }
}

saveDocument()
  .catch((error) => {
    console.log(error.message)
    process.exit(0)
  })