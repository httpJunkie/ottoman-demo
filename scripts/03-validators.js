const ottoman = require('ottoman')

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

// define validator
ottoman.addValidators({
  phone: (value) => {
    const phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(value && !value.match(phone)) {
      throw new Error('Phone number invalid')
    }
  }
})

// create model representing our user
const Airline = connection.model('Airline', {
  callsign: String,
  country: String,
  name: String,
  phone: { type: String, validator: 'phone'}
})

// Creating an Airline with phone number that will validate
// ex: 555-321-0123 not 1-555-321-0123
const united = new Airline({
  callsign: 'Couchbase',
  country: 'United States',
  name: 'United Airlines',
  phone: '800-490-2021'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
    console.log(`success: airline added`)
  } catch (error) {
    throw error
  }

  process.exit(0)
}

runAsync()
.catch((e) => console.log(e.message))
