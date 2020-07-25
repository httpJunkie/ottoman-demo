require('dotenv').config()
const { CB_USER, CB_PASS, BUCKET } = process.env
const ottoman = require('ottoman')

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: BUCKET,
  username: CB_USER,
  password: CB_PASS
});

// create model representing our user
const Airline = connection.model('Airline', {
  callsign: String,
  country: String,
  name: String
})

// Creating a use that matches the model
const united = new Airline({
  callsign: 'UNITED',
  country: 'United States',
  name: 'United Airline'
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
.catch((e) => console.log(e))