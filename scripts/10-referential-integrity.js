const ottoman = require('ottoman')
const { model, Schema } = require('ottoman');

// create connection to database/bucket
ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

const airlineSchema = new Schema({
  callsign: String,
  country: String,
  name: String
})

// create model representing our airline
const Airline = model('Airline', airlineSchema)

const routeSchema = new Schema({
  source_airport: String,
  destination_airport: String,
  airline: { type: String, ref: 'Airline' },
  stops: { type: Number, default: 0 }
})

const Route = model('Route', routeSchema)

// create an airline
const americanAirlines = new Airline({
  callsign: 'AA',
  country: 'United States',
  name: 'American Airlines'
})

// run the query
const createAndSaveAirline = async() => {
  try {
    await americanAirlines.save()
    console.log(`success: American Airlines added`)
  } catch (error) {
    throw error
  }
}

const createAndSaveRoute = async() => {
  try {
    const route = new Route({
      source_airport : "LAX",
      destination_airport : "DFW",
      airline: americanAirlines // assign id from the saved airline in the previous step
    })

    await route.save()

    console.log('success: Route between LAX and DFW for American Airlines added')

  } catch (error) {
    throw error
  }
}

const findRoutePopulateAirline = async() => {
  try {
    const filter = { source_airport: 'LAX'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const laxRoute = await Route.findOne(filter,options)

    // ottoman magic shortcut, normally you would have to find these 
    // documents seperately and jon them together
    await laxRoute._populate('airline')

    console.log('Route Retrieved : ', laxRoute)
  }
  catch (error) {
    throw error
  }
}

createAndSaveAirline()
  .then(() => {
    createAndSaveRoute()
      .then(() => {
        findRoutePopulateAirline()
          .then(() => process.exit(0))
      })
  })
  .catch((error) => console.log(error))