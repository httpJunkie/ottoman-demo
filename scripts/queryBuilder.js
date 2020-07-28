require('dotenv').config()
const { CB_USER, CB_PASS, BUCKET } = process.env
const ottoman = require('ottoman')

const { model, Schema, Query} = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

// create a model of users
const schema = new Schema({
  callsign: String,
  country: String,
  name: String
})

const Airline = connection.model('Airline', schema, { collectionName: 'Airlines', scopeName: 'us', })

// Creating a use that matches the model
const united = new Airline({
  callsign: 'UNITED',
  country: 'United States',
  name: 'United Airline'
})

// run the query
const runAsync = async() => {
  try {
    const select = [{ $field: 'name' }]
    const query = new Query({}, 'default:`travel`.`us`.`Airlines`')
      .select(select).limit(5).build()
      console.log(query)
      const result = await connection.query(query)
      console.log(result.rows)
  } catch (error) {
    throw error
  }
  process.exit(0)
}


runAsync()
  .catch((e) => console.log(e))

